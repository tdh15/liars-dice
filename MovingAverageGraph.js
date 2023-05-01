// created by Thomas Hughes in April of 2023

import plotlib from 'nodeplotlib';

// format of gamesData is:
// const gamesData = [
//     {
//         winnerArr: winnerArrR1vP1,
//         playersToGraph: ['P1'],
//         allPlayers: ['R1', 'P1'],
//     },
//     {
//         winnerArr: winnerArrR1vPPrime1,
//         playersToGraph: ['PPrime1'],
//         allPlayers: ['R1', 'PPrime1'],
//     }
// ];

// take in the data and make the moving average graph - comes up in browser (localhost)
export default class MovingAverageGraph {
    constructor(title, gamesData, windowSize, outputFilename) {
        this.title = title;
        this.winPercentages = this.calculateWinPercentages(gamesData, windowSize);
        this.outputFilename = outputFilename;
    }

    movingAverage(arr, windowSize) {
        let result = [];
        for (let i = 0; i < arr.length - windowSize + 1; i++) {
            let window = arr.slice(i, i + windowSize);
            let avg = window.reduce((acc, curr) => acc + curr, 0) / windowSize;
            result.push(avg);
        }
        return result;
    }
    
    calculateWinPercentages(gamesData, windowSize) {
        let winPercentages = {};

        for (const gameData of gamesData) {
            const { winnerArr, playersToGraph, allPlayers } = gameData;
            const allPlayersStr = allPlayers.join('v');

            for (const player of playersToGraph) {
                let playerWins = winnerArr.map((name, idx) => (name === player ? 1 : 0));
                let movingAvg = this.movingAverage(playerWins, windowSize);
                winPercentages[`${player} in ${allPlayersStr}`] = movingAvg;
            }
        }

        return winPercentages;
    }
    
    plotWinPercentages(winPercentages, outputFilename) {
        let data = [];
    
        for (const playerName in winPercentages) {
            let trace = {
                x: Array.from({ length: winPercentages[playerName].length }, (_, i) => i + 1),
                y: winPercentages[playerName].map((percentage) => percentage * 100), // Convert to percentage
                mode: 'lines',
                name: playerName,
            };
            data.push(trace);
        }
    
        const layout = {
            title: this.title,
            xaxis: { title: 'Game Number' },
            yaxis: {
                title: 'Win Percentage',
                range: [0, 100]
            }
        };
    
        plotlib.plot(data, layout, { format: 'png', filename: outputFilename });
    }

    makeGraph() {
        this.plotWinPercentages(this.winPercentages, this.outputFilename);
    }

}