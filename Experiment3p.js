// created by Thomas Hughes in April of 2023

import Experiment2p from './Experiment2p.js';
import LDG3p from './LDG3p.js';

export default class Experiment3p extends Experiment2p {
    constructor(title, iterationsNum, sideAPlayerNames, sideBPlayerNames, sideCPlayerNames, playersToGraph, outputFilename) {
        super(title, iterationsNum, sideAPlayerNames, sideBPlayerNames, playersToGraph, outputFilename);
        this.sideCPlayerNames = sideCPlayerNames;
    }

    // run one matchup of three given players
runOneMatchup(playerName1, playerName2, playerName3) {
    let playerNames = [playerName1, playerName2, playerName3];
    let winCounts = [0, 0, 0];
    let winnerArr = [];
    // reset qTable for each matchup so it can relearn
    this.qTable = {};

    console.log(`${this.title}: ${playerName1}v${playerName2}v${playerName3}`);
    for (let i = 0; i < this.iterationsNum; i++) {
        // display what iteration we're on at every step
        process.stdout.write(`${i + 1} / ${this.iterationsNum}\r`);
        
        let player1 = this.convertNameToPlayerInstance(playerName1);
        let player2 = this.convertNameToPlayerInstance(playerName2);
        let player3 = this.convertNameToPlayerInstance(playerName3);
        let playerList = [player1, player2, player3];

        let game = new LDG3p(playerList);
        let winner = game.runGame();

        // update the win count for the player that won
        const winnerIndex = playerNames.indexOf(winner.name);
        if (winnerIndex !== -1) winCounts[winnerIndex]++;

        // add their name to the giant list of winners
        winnerArr.push(winner.name);

        // if any of the players are Q players, update the q table
        // with what they learned in the last game
        for (const player of playerList) {
            if (player.name[0] === 'Q') {
                this.qTable = player.getQTable();
                break;
            }
        }
    }

    console.log("Games played: " + this.iterationsNum);
    console.log(`${playerName1} wins: ${winCounts[0]}`);
    console.log(`${playerName2} wins: ${winCounts[1]}`);
    console.log(`${playerName3} wins: ${winCounts[2]}`);

    // add the wins of the player(s) that is meant to be graphed
    // in this experiment to the graph
    let playersGraphThisMatchup = [];
    for (const playerName of playerNames) {
        if (this.playersToGraph.includes(playerName)) {
            playersGraphThisMatchup.push(playerName);
        }
    }
    this.gamesData.push({
        winnerArr: winnerArr,
        playersToGraph: playersGraphThisMatchup,
        allPlayers: playerNames
    })
}


    // Override the runAllMatchups method to handle 3 players
    runAllMatchups(sideAPlayerNames, sideBPlayerNames, sideCPlayerNames) {
        for (const playerName1 of sideAPlayerNames) {
            for (const playerName2 of sideBPlayerNames) {
                for (const playerName3 of sideCPlayerNames) {
                    this.runOneMatchup(playerName1, playerName2, playerName3);
                }
            }
        }
    }

    // Override the run method to handle 3 players
    run() {
        this.runAllMatchups(this.sideAPlayerNames, this.sideBPlayerNames, this.sideCPlayerNames);
        this.graphResults();
    }

}