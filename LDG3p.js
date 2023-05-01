// created by Thomas Hughes in April of 2023

import LiarsDiceGame from './LiarsDiceGame.js';

// this is a class for creating instances of 3-person game
export default class LD3p extends LiarsDiceGame {
    constructor(activePlayerRoster) {
        
        super(activePlayerRoster);
        // shuffle the order of the list of players each game
        this.activePlayerRoster.sort(() => Math.random() - 0.5);
        
        // randomly assign the starting player
        const randomNum = Math.floor(Math.random() * 3);
        this.currentPlayerIndex = randomNum;
        this.currentPlayer = this.activePlayerRoster[this.currentPlayerIndex];

    }
}