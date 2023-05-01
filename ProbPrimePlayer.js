// created by Thomas Hughes in April of 2023

import ProbPlayer from './ProbPlayer.js';

// identical to ProbPlayer, but plays optimistically - 
// if there is projected to be 0.5 matching dice on the table,
// ProbPrimePlayer rounds that up to 1 and bids based on it.
export default class ProbPrimePlayer extends ProbPlayer {
    constructor(name, numDiceStart) {
        super(name, numDiceStart);
        
        this.optimistic = true;

    }
}