// src/components/chart.jsx
import React from 'react';
import d3ScatterPlot from './d3/d3-scatter-plot.js';

const TAG = 'ScatterPlot'

export default class ScatterPlot extends React.Component {
	constructor(props) {
		super(props);
		console.log(TAG + '.constructor', props);
	}

	componentDidMount() {
		console.log(TAG + '.componentDidMount')
		d3ScatterPlot.create(this.refs.el, {
			width: this.props.width,
			height: this.props.height,
			padding: this.props.padding
		}, this.getScatterPlotState());
	}

	componentDidUpdate() {
		console.log(TAG + '.componentDidUpdate');
		d3ScatterPlot.update(this.refs.el, this.getScatterPlotState());
	}

	getScatterPlotState() {
		console.log(TAG + '.getScatterPlotState');
		return {
			data: this.props.data,
			domain: this.props.domain
		};
	}

	componentWillUnmount() {
		console.log(TAG + '.componentWillUnmount');
		d3ScatterPlot.destroy(this.refs.el);
	}

	render() {
		console.log(TAG + '.render')
		return <div ref="el"></div>
	}
}