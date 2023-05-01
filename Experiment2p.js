// created by Thomas Hughes in April of 2023

import Player from './Player.js';
import ProbPlayer from './ProbPlayer.js';
import ProbPrimePlayer from './ProbPrimePlayer.js';
import QPlayer from './QPlayer.js';
import QPrimePlayer from './QPrimePlayer.js';
import LDG2p from './LDG2p.js';
import MovingAverageGraph from './MovingAverageGraph.js';

// for creating and running two person experiments
export default class Experiment2p {
    constructor(title, iterationsNum, sideAPlayerNames, sideBPlayerNames, playersToGraph, outputFilename) {
        this.title = title;
        this.iterationsNum = iterationsNum;
        this.sideAPlayerNames = sideAPlayerNames;
        this.sideBPlayerNames = sideBPlayerNames;
        this.playersToGraph = playersToGraph;
        this.outputFilename = outputFilename;
        this.qTable = {};
        this.gamesData = [];
    }

    // look at the name and figure out what kind of player to make
    convertNameToPlayerInstance(playerName) {
        const playerType = playerName[0];
        const prime = playerName[1] === "'";
        const playerNum = parseInt(playerName.slice(prime ? 2 : 1), 10);

        if (playerType === 'P') {
            return prime ? new ProbPrimePlayer(`P'${playerNum}`, playerNum) : new ProbPlayer(`P${playerNum}`, playerNum);
        } else if (playerType === 'R') {
            return new Player(`R${playerNum}`, playerNum);
        } else if (playerType === 'Q') {
            return prime ? new QPrimePlayer(`Q'${playerNum}`, playerNum, this.qTable) : new QPlayer(`Q${playerNum}`, playerNum, this.qTable);
        }
    }
    
    // run one matchup of two given players
    runOneMatchup(playerName1, playerName2) {
        
        let playerNames = [playerName1, playerName2];
        let winCounts = [0, 0];
        let winnerArr = [];
        // reset qTable for each matchup so it can relearn
        this.qTable = {};

        console.log(`${this.title}: ${playerName1}v${playerName2}`);
        for (let i = 0; i < this.iterationsNum; i++) {
            // display what iteration we're on at every step
            process.stdout.write(`${i + 1} / ${this.iterationsNum}\r`);
            
            let player1 = this.convertNameToPlayerInstance(playerName1);
            let player2 = this.convertNameToPlayerInstance(playerName2);
            let playerList = [player1, player2];

            let game = new LDG2p(playerList);
            let winner = game.runGame();

            // update the win count for the player that won
            const winnerIndex = playerNames.indexOf(winner.name);
            if (winnerIndex !== -1) winCounts[winnerIndex]++;

            // add their name to the giant list of winners
            winnerArr.push(winner.name);

            // if either of the players are Q players, update the q table
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

    // run every possible matchup between the two sides
    runAllMatchups(sideAPlayerNames, sideBPlayerNames) {
        for (const playerName1 of sideAPlayerNames) {
            for (const playerName2 of sideBPlayerNames) {
                this.runOneMatchup(playerName1, playerName2);
            }
        }
    }

    graphResults() {
        const graph = new MovingAverageGraph(this.title, this.gamesData, this.iterationsNum/20, this.outputFilename);
        graph.makeGraph();
    }

    run() {
        this.runAllMatchups(this.sideAPlayerNames, this.sideBPlayerNames);
        this.graphResults();
    }

}