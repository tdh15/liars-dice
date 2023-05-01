// created by Thomas Hughes in April of 2023

// run experiments

import Experiment2p from './Experiment2p.js';
import Experiment3p from './Experiment3p.js';

const standardIterNum = 10000;
let experiments = [0]; // so it's 1-indexed
function runExperimentNumber(experimentNumber) {
    experiments[experimentNumber].run();
}

// Experiment 1 - R1v[P1/P'1]
const E1title = "Experiment 1";
const E1sideAPlayerNames = ['R1'];
const E1sideBPlayerNames = ['P1', 'P\'1'];
const E1playersToGraph = ['P1', 'P\'1'];
const E1outputFilename = 'Experiment1.png'
let experiment1 = new Experiment2p(E1title, standardIterNum, E1sideAPlayerNames, E1sideBPlayerNames, E1playersToGraph, E1outputFilename);
experiments.push(experiment1);

// Experiment 2 - R1v[Q1/Q'1]
const E2title = "Experiment 2";
const E2sideAPlayerNames = ['R1'];
const E2sideBPlayerNames = ['Q1', 'Q\'1'];
const E2playersToGraph = ['Q1', 'Q\'1'];
const E2outputFilename = 'Experiment2.png'
let experiment2 = new Experiment2p(E2title, standardIterNum, E2sideAPlayerNames, E2sideBPlayerNames, E2playersToGraph, E2outputFilename);
experiments.push(experiment2);

// Experiment 3 - [P1/P'1]v[Q1/Q'1]
const E3title = "Experiment 3";
const E3sideAPlayerNames = ['P1', 'P\'1'];
const E3sideBPlayerNames = ['Q1', 'Q\'1'];
const E3playersToGraph = ['Q1', 'Q\'1'];
const E3outputFilename = 'Experiment3.png'
let experiment3 = new Experiment2p(E3title, standardIterNum, E3sideAPlayerNames, E3sideBPlayerNames, E3playersToGraph, E3outputFilename);
experiments.push(experiment3);

// Experiment 4 - R2v[P2/P'2]
const E4title = "Experiment 4";
const E4sideAPlayerNames = ['R2'];
const E4sideBPlayerNames = ['P2', 'P\'2'];
const E4playersToGraph = ['P2', 'P\'2'];
const E4outputFilename = 'Experiment4.png'
let experiment4 = new Experiment2p(E4title, standardIterNum, E4sideAPlayerNames, E4sideBPlayerNames, E4playersToGraph, E4outputFilename);
experiments.push(experiment4);

// Experiment 5 - R2v[Q2/Q'2]
const E5title = "Experiment 5";
const E5sideAPlayerNames = ['R2'];
const E5sideBPlayerNames = ['Q2', 'Q\'2'];
const E5playersToGraph = ['Q2', 'Q\'2'];
const E5outputFilename = 'Experiment5.png'
let experiment5 = new Experiment2p(E5title, standardIterNum, E5sideAPlayerNames, E5sideBPlayerNames, E5playersToGraph, E5outputFilename);
experiments.push(experiment5);

// Experiment 6 - [P2/P'2]v[Q2/Q'2]
const E6title = "Experiment 6";
const E6sideAPlayerNames = ['P2', 'P\'2'];
const E6sideBPlayerNames = ['Q2', 'Q\'2'];
const E6playersToGraph = ['Q2', 'Q\'2'];
const E6outputFilename = 'Experiment6.png'
let experiment6 = new Experiment2p(E6title, standardIterNum, E6sideAPlayerNames, E6sideBPlayerNames, E6playersToGraph, E6outputFilename);
experiments.push(experiment6);

// Experiment 7 - R2v[Q1/Q'1]
const E7title = "Experiment 7";
const E7sideAPlayerNames = ['R2'];
const E7sideBPlayerNames = ['Q1', 'Q\'1'];
const E7playersToGraph = ['Q1', 'Q\'1'];
const E7outputFilename = 'Experiment7.png'
let experiment7 = new Experiment2p(E7title, standardIterNum, E7sideAPlayerNames, E7sideBPlayerNames, E7playersToGraph, E7outputFilename);
experiments.push(experiment7);

// Experiment 8 - [P2/P'2]v[Q1/Q'1]
const E8title = "Experiment 8";
const E8sideAPlayerNames = ['P2', 'P\'2'];
const E8sideBPlayerNames = ['Q1', 'Q\'1'];
const E8playersToGraph = ['Q1', 'Q\'1'];
const E8outputFilename = 'Experiment8.png'
let experiment8 = new Experiment2p(E8title, standardIterNum, E8sideAPlayerNames, E8sideBPlayerNames, E8playersToGraph, E8outputFilename);
experiments.push(experiment8);

// Experiment 9 - [Q2/Q'2]vR1
const E9title = "Experiment 9";
const E9sideAPlayerNames = ['Q2', 'Q\'2'];
const E9sideBPlayerNames = ['R1'];
const E9playersToGraph = ['Q2', 'Q\'2'];
const E9outputFilename = 'Experiment9.png'
let experiment9 = new Experiment2p(E9title, standardIterNum, E9sideAPlayerNames, E9sideBPlayerNames, E9playersToGraph, E9outputFilename);
experiments.push(experiment9);

// Experiment 10 - [Q2/Q'2]v[P1/P'1]
const E10title = "Experiment 10";
const E10sideAPlayerNames = ['Q2', 'Q\'2'];
const E10sideBPlayerNames = ['P1', 'P\'1'];
const E10playersToGraph = ['Q2', 'Q\'2'];
const E10outputFilename = 'Experiment10.png'
let experiment10 = new Experiment2p(E10title, standardIterNum, E10sideAPlayerNames, E10sideBPlayerNames, E10playersToGraph, E10outputFilename);
experiments.push(experiment10);

// Experiment 11 - R3v[Q1/Q'1]
const E11title = "Experiment 11";
const E11sideAPlayerNames = ['R3'];
const E11sideBPlayerNames = ['Q1', 'Q\'1'];
const E11playersToGraph = ['Q1', 'Q\'1'];
const E11outputFilename = 'Experiment11.png'
let experiment11 = new Experiment2p(E11title, standardIterNum, E11sideAPlayerNames, E11sideBPlayerNames, E11playersToGraph, E11outputFilename);
experiments.push(experiment11);

// Experiment 12 - [P3/P'3]v[Q1/Q'1]
const E12title = "Experiment 12";
const E12sideAPlayerNames = ['P3', 'P\'3'];
const E12sideBPlayerNames = ['Q1', 'Q\'1'];
const E12playersToGraph = ['Q1', 'Q\'1'];
const E12outputFilename = 'Experiment12.png'
let experiment12 = new Experiment2p(E12title, standardIterNum, E12sideAPlayerNames, E12sideBPlayerNames, E12playersToGraph, E12outputFilename);
experiments.push(experiment12);

// Experiment 13 - [Q3/Q'3]v[P1/P'1]
const E13title = "Experiment 13";
const E13sideAPlayerNames = ['Q3', 'Q\'3'];
const E13sideBPlayerNames = ['P1', 'P\'1'];
const E13playersToGraph = ['Q3', 'Q\'3'];
const E13outputFilename = 'Experiment13.png'
let experiment13 = new Experiment2p(E13title, standardIterNum, E13sideAPlayerNames, E13sideBPlayerNames, E13playersToGraph, E13outputFilename);
experiments.push(experiment13);

// Experiment 14 - R1v[P1/P'1]v[Q1/Q'1]
const E14title = "Experiment 14";
const E14sideAPlayerNames = ['R1'];
const E14sideBPlayerNames = ['P1', 'P\'1'];
const E14sideCPlayerNames = ['Q1', 'Q\'1'];
const E14playersToGraph = ['Q1', 'Q\'1'];
const E14outputFilename = 'Experiment14.png';
let experiment14 = new Experiment3p(E14title, standardIterNum, E14sideAPlayerNames, E14sideBPlayerNames, E14sideCPlayerNames, E14playersToGraph, E14outputFilename);
experiments.push(experiment14);

// Experiment 15 - R2v[P2/P'2]v[Q1/Q'1]
const E15title = "Experiment 15";
const E15sideAPlayerNames = ['R2'];
const E15sideBPlayerNames = ['P2', 'P\'2'];
const E15sideCPlayerNames = ['Q1', 'Q\'1'];
const E15playersToGraph = ['Q1', 'Q\'1'];
const E15outputFilename = 'Experiment15.png';
let experiment15 = new Experiment3p(E15title, standardIterNum, E15sideAPlayerNames, E15sideBPlayerNames, E15sideCPlayerNames, E15playersToGraph, E15outputFilename);
experiments.push(experiment15);

// Experiment 16 - R2v[P2/P'2]v[Q2/Q'2]
const E16title = "Experiment 16";
const E16sideAPlayerNames = ['R2'];
const E16sideBPlayerNames = ['P2', 'P\'2'];
const E16sideCPlayerNames = ['Q2', 'Q\'2'];
const E16playersToGraph = ['Q2', 'Q\'2'];
const E16outputFilename = 'Experiment16.png';
let experiment16 = new Experiment3p(E16title, standardIterNum, E16sideAPlayerNames, E16sideBPlayerNames, E16sideCPlayerNames, E16playersToGraph, E16outputFilename);
experiments.push(experiment16);

// Experiment 17 - R3v[P3/P'3]v[Q3/Q'3]
const E17title = "Experiment 17";
const E17sideAPlayerNames = ['R3'];
const E17sideBPlayerNames = ['P3', 'P\'3'];
const E17sideCPlayerNames = ['Q3', 'Q\'3'];
const E17playersToGraph = ['Q3', 'Q\'3'];
const E17outputFilename = 'Experiment17.png';
let experiment17 = new Experiment3p(E17title, standardIterNum, E17sideAPlayerNames, E17sideBPlayerNames, E17sideCPlayerNames, E17playersToGraph, E17outputFilename);
experiments.push(experiment17);










runExperimentNumber(6);