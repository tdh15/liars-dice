// created by Thomas Hughes in April of 2023

import _ from 'lodash';

// this is the base player, just chooses a random move in getMove()
export default class Player {
    constructor(name, numDiceStart) {
        this.name = name;
        // how many dice you have left
        this.numActiveDice = numDiceStart;
        // what dice you have in your hand
        this.currentHand = [];
    }

    getName() {
        return this.name;
    }

    getNumActiveDice() {
        return this.numActiveDice;
    }

    getCurrentHand() {
        return this.currentHand;
    }

    // count the number of a given dice that you have, including 1s because they're wild
    countDiceOfType(targetValue) {
        let count = this.currentHand.reduce((count, val) => count + (val === targetValue || val === 1 ? 1 : 0), 0);
        return count;
    }

    rollDice() {
        this.currentHand = [];
        for (let i = 0; i < this.numActiveDice; i++) {
            this.currentHand.push(Math.floor(Math.random() * 6) + 1);
        }
        
        // sort it such that the player is looking at their hand in ascending order
        // this way, in the Qtable, if you have more than one dice in your hand,
        // you don't see [1,3] as a different state than [3,1]
        this.currentHand.sort((a, b) => a - b);
        // console.log(this.name + " rolled: ");
        // console.log(this.currentHand);
    }

    
    
    // ignores feedback
    receiveFeedback(feedback) {

        // feedback a player can receive:
        
        // after a move:
        // {event: "you called", loss: true}
        // {event: "your bid was called", loss: false}
        // {event: "you called", loss: false}
        // {event: "your bid was called", loss: true}
        // {event: "bid was not called"}

        // after a game:
        // {event: "victory"}
        // {event: "elimination"}

        return;
    }
    
    // choose a random move
    getMove(playerName, currentRoundGrid, dicePerPlayer, currentBid, availableMoves) {
        const randIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randIndex];
    }
}