import React, {Component} from "react"
import {buildTree, makePrediction, printTree} from '../mlAlgos/decisionTree.js';

// dataset size
const SAMPLE_SET_SIZE = 10

class Visualizer extends Component {
    constructor() {
        super()
        // initialize array, place holder will be overwritten when component mounts
        this.state = {
            arr: [[0,0,0]],
        };
        this.resetArray = this.resetArray.bind(this);
    }

    componentDidMount() {
        this.resetArray();
    }

    // generate a dataset [X1,X2,Y] X1 and X2 are features and Y is out binary classifier
    resetArray() {
        const arr = [];
        for (let i = 0; i < SAMPLE_SET_SIZE; i++) {
            arr.push([randomIntFromInterval(1, 10),randomIntFromInterval(1, 10),randomIntFromInterval(0, 1)]);
        }
        this.setState({arr});
    }

    render() {
        console.log(this.state.arr);
        let tmp = buildTree(this.state.arr, 3, 2);
        console.log(tmp)
        console.log(printTree(tmp));
        for (const row of this.state.arr) {
            let pred = makePrediction(tmp, row);
            if (row[row.length-1] !== pred) {
                console.log('Expected=%d, Got=%d Incorrect', row[row.length-1], pred);
            }
            else {
                console.log('Expected=%d, Got=%d', row[row.length-1], pred);
            }
        }
        return (
            <div>
                <button onClick={this.resetArray}>Generate Sample</button>
                <button>ML1</button>
                <button>ML2</button>
                <button>ML3</button>
            </div>
        )
    }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default Visualizer