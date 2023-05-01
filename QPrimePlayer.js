// created by Thomas Hughes in April of 2023

import QPlayer from './QPlayer.js';

// identical to QPlayer, but making a move which does not
// result in a positive or negative outcome is given a slight negative
// reward
export default class QPrimePlayer extends QPlayer {
    constructor(name, numDiceStart, qTable) {
        super(name, numDiceStart, qTable);
    }

    // establish rewards for 7 possible events
    makeFeedbackRewardTable() {
        this.feedbackRewardTable[JSON.stringify({event: "you called", loss: true})] = -1;
        this.feedbackRewardTable[JSON.stringify({event: "your bid was called", loss: false})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "you called", loss: false})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "your bid was called", loss: true})] = -1;

        // this is the only difference from QPlayer
        this.feedbackRewardTable[JSON.stringify({event: "bid was not called"})] = -0.1;

        this.feedbackRewardTable[JSON.stringify({event: "victory"})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "elimination"})] = -1;
    }
}