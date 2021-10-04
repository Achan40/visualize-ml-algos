import React, {Component} from "react"
import {giniIndex} from '../mlAlgos/decisionTree.js';

// dataset size
const SAMPLE_SET_SIZE = 30

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
        console.log(giniIndex([[[1,1], [1,0]], [[1,1], [1,0]]], [0,1]));
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