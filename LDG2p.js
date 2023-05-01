// created by Thomas Hughes in April of 2023

import LiarsDiceGame from './LiarsDiceGame.js';

// this is a class for creating instances of 2-person game
export default class LDG2p extends LiarsDiceGame {
    constructor(activePlayerRoster) {
        
        super(activePlayerRoster);
        
        // randomly assign the starting player
        let randomZeroOrOne = Math.round(Math.random());
        this.currentPlayerIndex = randomZeroOrOne;
        this.currentPlayer = this.activePlayerRoster[this.currentPlayerIndex];

    }
}