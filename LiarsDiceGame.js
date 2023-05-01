// created by Thomas Hughes in April of 2023

import _ from 'lodash';

export default class LiarsDiceGame {
    constructor(activePlayerRoster) {
        this.activePlayerRoster = activePlayerRoster;
        // # players who haven't been eliminated
        this.numActivePlayers = activePlayerRoster.length;
        // grid representation of the history of bids for this round
        this.currentRoundGrid = [];
        // list of available moves given the previous bid
        this.availableMoves = [];
        // list of objects, containing {name: nameOfPlayer, diceCount: numberOfActiveDice}
        this.dicePerPlayer = [];
        // total dice in play across all players
        this.numAllActiveDice = 0;
        // # rounds played this game
        this.roundNumber = 0;
        // current bid, up for increasing or challenge 
        this.currentBid = {quantity: 0, value: 0};
        // the player whose turn it is
        this.currentPlayerIndex = 0;
        this.currentPlayer = activePlayerRoster[this.currentPlayerIndex];
        // to check if someone's bid, so call is an available move
        this.firstBidMade = false;
    }

    // run at the beginning of every game
    initializeGameStartValues() {
        this.activePlayerRoster.forEach((player) => {
            let numDice = player.getNumActiveDice();
            this.dicePerPlayer.push({name: player.getName(), diceCount: numDice});
            this.numAllActiveDice += numDice;
        });
    }

    // run at the beginning of every round
    resetRoundInfo() {
        // reset grid
        this.currentRoundGrid = [];
        const zerosArray = Array(5).fill(0); // [0, 0, 0, 0, 0]
        for (let i = 0; i < this.numAllActiveDice; i++) {
            this.currentRoundGrid.push(Array.from(zerosArray));
        }
        // reset current bid
        this.currentBid = {quantity: 0, value: 0};
        // reset firstBidMade to acknowledge no one has bid yet
        this.firstBidMade = false;

        // add every possible available move to a list
        this.availableMoves = [];
        for (let i = 1; i <= this.numAllActiveDice; i++) {
            for (let j = 2; j <= 6; j++) {
                this.availableMoves.push({bid: {quantity: i, value: j}})
            }
        }
    }

    // all active players roll their active dice
    allPlayersRoll() {
        this.activePlayerRoster.forEach((player) => player.rollDice());
    }
    
    // count one type of dice across all hands (for checking when one player calls another)
    countAllDiceOfType(value) {
        let count = 0;
        this.activePlayerRoster.forEach((player) => {
            count += player.countDiceOfType(value);
        })
        return count;
    }
    
    // when a player loses a round and they have to kick a dice in
    loseADice(player) {

        // loser starts each round, so currentPlayer must reflect this
        this.currentPlayer = player;
        // have to use _.isEqual() when deep comparing objects
        this.currentPlayerIndex = this.activePlayerRoster.findIndex((myPlayer) => _.isEqual(myPlayer, player));
        
        player.numActiveDice -= 1;

        // update dicePerPlayer
        // find the index of the player in dicePerPlayer by checking for matching name
        let diceCountIndexToUpdate = this.dicePerPlayer.findIndex(myPlayer => myPlayer.name === player.getName())
        // once you've found the index, decrement the value which tracks the number of dice that player has.
        // this is important to update because how many dice all players have individually is given
        // to each player when they're deciding what move to make
        if (diceCountIndexToUpdate !== -1) {
            this.dicePerPlayer[diceCountIndexToUpdate].diceCount -= 1;
        }

        // if they're out of dice, they're eliminated, and wiped from the activePlayerRoster
        if (player.numActiveDice === 0) {
            
            player.receiveFeedback({event: "elimination"});
            
            this.activePlayerRoster = this.activePlayerRoster.filter(myPlayer => myPlayer !== player);
            this.numActivePlayers -= 1;
            
            // if a player is eliminated, the next round will begin with the player after them
            // circle around to the front if you just eliminated the last one
            this.currentPlayerIndex = this.currentPlayerIndex % this.numActivePlayers;
            this.currentPlayer = this.activePlayerRoster[this.currentPlayerIndex];

        }

        this.numAllActiveDice -= 1;
        
    }
    
    // run one round
    playRound() {
        
        this.resetRoundInfo();
        this.roundNumber += 1;
        this.allPlayersRoll();
        
        let previousPlayer;
        // let players bid until someone calls
        while (true) {
            // ask the current player for their move
            // built into the bot is the guarantee that a legal move
            // is made, so we don't have to check
            let currentName = this.currentPlayer.getName();
            let move = this.currentPlayer.getMove(currentName, this.currentRoundGrid, this.dicePerPlayer, this.currentBid, this.availableMoves);
            // console.log(currentName);
            // console.log(move);
            
            // you can always call, that's always an available move
            // when all the others are gone, call is the last option
            // so it goes at the very end of the availableMoves list.
            // But, you can only add it once someone has bid. So don't add
            // it to the list of available moves until after the first move
            // has been made.
            if (this.firstBidMade === false) {
                this.availableMoves.push({call: true});
                this.firstBidMade = true;
            }
            
            if ('call' in move) {
                break;
            }

            if (previousPlayer !== undefined) previousPlayer.receiveFeedback({event: "bid was not called"});

            // update the grid to have name of the player at the coordinate of their bid
            let gridCoordMoveQuantity = move.bid.quantity - 1;
            let gridCoordMoveValue = move.bid.value - 2;
            // change quantity and value to coordinates on the grid
            this.currentRoundGrid[gridCoordMoveQuantity][gridCoordMoveValue] = currentName;

            // update the current bid
            this.currentBid = move.bid;

            // update the list of available moves by deleting everything left of the move made
            // and the move itself
            // Can't use indexOf because it's not looking at primitive types
            let indexOfMove = this.availableMoves.findIndex(myMove => _.isEqual(myMove, move));
            if (indexOfMove !== -1) {
                this.availableMoves.splice(0, indexOfMove + 1);
            }

            // keep track of previous player for when a call happens
            previousPlayer = this.currentPlayer;
            // update current player to the next person
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numActivePlayers;
            this.currentPlayer = this.activePlayerRoster[this.currentPlayerIndex];
        }

        // at this point, currentPlayer is the one who called
        // previousPlayer is the one who had their bid called
        // currentBid is the most recent bid, so it's the one that was called

        // check if the bid was satisfied, if there are more than enough of that value of dice
        let bidderWasRight = this.countAllDiceOfType(this.currentBid.value) >= this.currentBid.quantity;

        // if the bidder was right, the player who called loses a dice
        if (bidderWasRight) {
            
            this.currentPlayer.receiveFeedback({event: "you called", loss: true});
            previousPlayer.receiveFeedback({event: "your bid was called", loss: false});
            this.loseADice(this.currentPlayer);

        } else { // if the bid was not satisfied, the bidder loses a dice
            
            this.currentPlayer.receiveFeedback({event: "you called", loss: false});
            previousPlayer.receiveFeedback({event: "your bid was called", loss: true});
            this.loseADice(previousPlayer);

        }

    }

    runGame() {
        this.initializeGameStartValues();
        while (this.numActivePlayers > 1) {
            this.playRound();
        }

        const champ = this.activePlayerRoster[0];
        champ.receiveFeedback({event: "victory"});
        return champ;
    }

}

