// src/components/app.jsx
import React from 'react';
import Chart from './chart';

const styles = {
	width: 500,
	height: 300,
	padding: 30,
};

const numDataPoints = 50;
const randomNum = () => Math.floor(Math.random() * 1000);
const randomDataSet = () => {
	return Array.apply(null, { length: numDataPoints }).map(() => [randomNum(), randomNum(), randomNum()]);
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: randomDataSet()
		};
	}

	randomizeDate() {
		var newData = randomDataSet();
		this.setState({
			data: newData
		});
	}

	render() {
		return <div>
			<h1>Playing with React and D3</h1>
			<Chart data={this.state.data} styles={styles} />
			<div className="controls">
				<button className="btn randomize" onClick={() => this.randomizeDate()}>
					Randomize Data
				</button>
			</div>
		</div>
	}
}
