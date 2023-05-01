// created by Thomas Hughes in April of 2023

import Player from './Player.js';

export default class QPlayer extends Player {
    constructor(name, numDiceStart, qTable) {
        super(name, numDiceStart);
        // of the form
        // {'singular state in string form': {action1StringForm: qValue, action2StringForm: qValue, ...}}
        // put this in as a blank table at first,  otherwise use the learned q values and keep building off them
        this.qTable = qTable;
        this.learningRate = 0.1; // how much newly discovered Qs are factored in
        this.discountFactor = 0.9; // closer to 1 means focus on long-term payoffs
        this.epsilon = 0.1; // closer to 1 is more likely to explore and move random
        this.mostRecentStateAndAction; // for updating qValues
        this.mostRecentReward = 0; // feedback on the previous move
        this.feedbackRewardTable = {}; // lookup table for reward for different types of feedback
        this.makeFeedbackRewardTable(); // runs when QPlayer is created
    }

    getQTable() {
        return this.qTable;
    }
    
    // establish rewards for 7 possible events
    makeFeedbackRewardTable() {
        
        this.feedbackRewardTable[JSON.stringify({event: "you called", loss: true})] = -1;
        this.feedbackRewardTable[JSON.stringify({event: "your bid was called", loss: false})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "you called", loss: false})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "your bid was called", loss: true})] = -1;
        this.feedbackRewardTable[JSON.stringify({event: "bid was not called"})] = 0;

        this.feedbackRewardTable[JSON.stringify({event: "victory"})] = 1;
        this.feedbackRewardTable[JSON.stringify({event: "elimination"})] = -1;
    }
    
    // If q values of actions for a given state haven't been initialized,
    // initialize them to 0.0
    initializeQValuesForState(state, availableMoves) {
        if (!(state in this.qTable)) {
            this.qTable[state] = {};
            availableMoves.forEach((move) => {
                this.qTable[state][JSON.stringify(move)] = 0.0;
            })
        }
    }

    // get the q value of a given action in a given state
    // (when this is called, the value is guaranteed initialized already)
    getQValue(state, action) {
        const actionString = JSON.stringify(action);
        return this.qTable[state][actionString];
    }

    // change the q value of a given action in a given state
    // (when this is called, the value is guaranteed initialized already)
    setQValue(state, action, newQValue) {
        const actionString = JSON.stringify(action);
        this.qTable[state][actionString] = newQValue;
    }

    // define the state of the game  --> make it a string so it's immutable
    defineCurrentState(playerName, currentRoundGrid, dicePerPlayer) {
        const state = {
            playerName,
            currentRoundGrid,
            dicePerPlayer,
            currentHand: this.currentHand
        }
        return JSON.stringify(state);
    }

    // explore or exploit, then return the action you get
    chooseAction(currentState, availableMoves) {
        let action;
        if (Math.random() < this.epsilon) {
            // explore: choose a random action
            // console.log("(random move)");
            action = this.getRandomAction(availableMoves);
        } else {
            // exploit: choose the action with the highest q-value
            // console.log("(best q value move)");
            action = this.getBestAction(currentState, availableMoves);
        }
        return action;
    }

    // don't even need to look at current state, just randomly choose a legal move
    getRandomAction(availableMoves) {
        const randIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randIndex];
    }
    
    // look for the highest qValue from the possible moves given the state
    // return the state that has that qValue
    getBestAction(currentState, availableMoves) {
        const bestAction = this.getMaxActionAndQ(currentState, availableMoves).bestAction;
        return bestAction;
    }

    // looking at your currentState, return the action with the
    // highest Q value, and its Q value
    getMaxActionAndQ(currentState, availableMoves) {
        let bestAction;
        let bestQ = -Infinity;
        
        for (let action in availableMoves) {
            let currentQValue = this.getQValue(currentState, availableMoves[action])
            if (currentQValue > bestQ) {
                bestAction = availableMoves[action];
                bestQ = currentQValue;
            }
        }

        return {bestAction, bestQ};
    }

    getMove(playerName, currentRoundGrid, dicePerPlayer, currentBid, availableMoves) {
        
        let state = this.defineCurrentState(playerName, currentRoundGrid, dicePerPlayer);
        
        // initialize the q Values to 0 for the currentState and all its
        // possible actions if it hasn't been done yet
        this.initializeQValuesForState(state, availableMoves);
        
        // if the player has made a move previously, update the q-value
        // (just means don't update anything when you haven't made a move yet)
        if (this.mostRecentStateAndAction !== undefined) {
            this.updateQValue(state, availableMoves);
        }
        
        let action = this.chooseAction(state, availableMoves);

        this.mostRecentStateAndAction = {state, action}; // save this for updating qValues

        return action;
    }

    getMaxQValue(currentState, availableMoves) {
        const maxQ = this.getMaxActionAndQ(currentState, availableMoves).bestQ;
        return maxQ;
    }
    
    // given the currentState, update the q value of the action
    // taken on the previous state
    updateQValue(currentState, availableMoves, gameEnded = false) {

        const stateToUpdate = this.mostRecentStateAndAction.state;
        const actionToUpdate = this.mostRecentStateAndAction.action;

        const previousQValue = this.getQValue(stateToUpdate, actionToUpdate);
        const reward = this.mostRecentReward;
        
        // if the player won the game or was eliminated, getMove() has
        // not been called so there's no new state to look at. So,
        // when we update the q value, the max q values of
        // the current state is 0, because there are no future states.
        let maxQValue;
        if (gameEnded) {
            maxQValue = 0.0;
        } else {
            maxQValue = this.getMaxQValue(currentState, availableMoves);
        }

        const newQValue = previousQValue + this.learningRate * (reward +
            this.discountFactor * maxQValue - previousQValue);
        this.setQValue(stateToUpdate, actionToUpdate, newQValue);

    }
    
    // store the reward for the last action taken.
    // If the player was eliminated or won the game, update
    // q values from previous move (because getMove won't be
    // called again so this is the only chance to do it)
    receiveFeedback(feedback) {

        const feedbackString = JSON.stringify(feedback);
        this.mostRecentReward = this.feedbackRewardTable[feedbackString];
        if (feedback.event === "victory" || feedback.event === "elimination") {
            // current state doesn't matter because the game is over,
            // so there is no current state. We just care about updating
            // the q value for the previous one.
            this.updateQValue({}, {}, true);
        }
    }

}

