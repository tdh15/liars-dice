// created by Thomas Hughes in April of 2023

import Player from './Player.js';
import _ from 'lodash';

// plays probabilistically, obeys the [my hand] + [one third of unseen dice] rule
export default class ProbPlayer extends Player {
    constructor(name, numDiceStart) {
        super(name, numDiceStart);
        this.optimistic = false;
    }
    
    getMove(playerName, currentRoundGrid, dicePerPlayer, currentBid, availableMoves) {
        
        let totalDiceOnTable = 0;
        dicePerPlayer.forEach((myPlayer) => totalDiceOnTable += myPlayer.diceCount);
        const diceOutsideOfYourHand = totalDiceOnTable - this.numActiveDice;
        let predictedAmountOutsideOfYourHand = 0;
        // round up or round down (difference between ProbPlayer and ProbPrimePlayer)
        if (this.optimistic) {
            predictedAmountOutsideOfYourHand = Math.ceil(diceOutsideOfYourHand / 3);
        } else {
            predictedAmountOutsideOfYourHand = Math.floor(diceOutsideOfYourHand / 3);
        }
        
        
        // Decide whether or not to call the previous bid (e.g. three 5s)
        // by doing the following:
        // 1) Look at the value of the current bid (5).
        // 2) Subtract the quantity of that value that you have in
        //  your hand from the bidded quantity (3 - 1 = 2).
        // 3) If the resulting number is more than one-third
        //  of the dice outside of your hand, call.
        const quantityYouHaveOfBidValue = this.countDiceOfType(currentBid.value);
        if (_.isEqual(currentBid, {quantity: 0, value: 0}) === false) {
            const quantityNeededOnTable = currentBid.quantity - quantityYouHaveOfBidValue;
            if (quantityNeededOnTable > predictedAmountOutsideOfYourHand) return {call: true};
        }
        
        // If you made it past that, then you're going to be bidding.
        // To choose what to bid, just start at the top of the available
        // remaining moves, and do the first one that seems statistically
        // sound given your hand. So where the quantity is less than
        // [the quantity you have of that value] + [one-third of other people's dice].
        // This means you're choosing the most aggressive possible move given the
        // stats of the board, so trying to get them to call or step outside the boundary
        // of what is statistically feasible.
        for (let moveIndex = availableMoves.length-2; moveIndex >= 0; moveIndex--) {
            // we start at length - 2 so that we ignore ({call: true}) until needed
            const quantityYouHaveOfPossibleMoveValue = this.countDiceOfType(availableMoves[moveIndex].bid.value);
            const predictedTotalQuantity = quantityYouHaveOfPossibleMoveValue + predictedAmountOutsideOfYourHand;
            if (availableMoves[moveIndex].bid.quantity <= predictedTotalQuantity) return availableMoves[moveIndex];
        }

        // If there are no statistically feasible states remaining, you call. But!
        // There's one corner case. If you've exhausted all options and they
        // all seem statistically infeasible, but you know that to call the previous bid
        // guarantees a loss because your own dice make up enough of the quantity to
        // make the previous bid correct: increase the quantity of the previous bid by 1.
        // You're banking on them actually having the dice they bid, and thus, supplemented
        // with your dice, you getting kinda lucky.
        // This is, in effect, a bluff.
        if (quantityYouHaveOfBidValue === currentBid.quantity) {
            return {bid: {quantity: quantityYouHaveOfBidValue + 1, value: currentBid.value}}
        } else {
            return {call: true};
        }
    }
}
