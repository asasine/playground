// src/components/App.jsx
import React from 'react';
import ScatterPlot from './chart.jsx';

const styles = {
	width: 500,
	height: 300,
	padding: 30,
};

const numDataPoints = 50;
const maxX = 50;
const maxY = 100;
const maxZ = 10;
var numRandoms = 0;
const randomNum = (num) => Math.floor(Math.random() * num);
const randomDataSet = () => {
	return Array.apply(null, { length: numDataPoints }).map((d, i) => {
		return {
			id: i + numRandoms * numDataPoints,
			x: randomNum(maxX),
			y: randomNum(maxY),
			z: randomNum(maxZ)
		}
	});
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: randomDataSet(),
			domain: {
				x: [0, maxX],
				y: [0, maxY],
				z: [0, maxZ]
			}
		};
	}

	randomizeDate() {
		numRandoms++;
		this.setState({
			data: randomDataSet()
		});
	}

	render() {
		return <div>
			<h1>Integrating D3.js visualizations in a React app</h1>
			<ScatterPlot {...this.state} {...styles} />
			<div className="controls">
				<button className="btn randomize" onClick={() => this.randomizeDate()}>
					Randomize Data
				</button>
			</div>
		</div>
	}
}
