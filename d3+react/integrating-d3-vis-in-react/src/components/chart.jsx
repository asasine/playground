// src/components/chart.jsx
import React from 'react';
import d3ScatterPlot from './d3/d3-scatter-plot.js';

export default class ScatterPlot extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		d3ScatterPlot.create(this.refs.el, {
			width: this.props.width,
			height: this.props.height,
			padding: this.props.padding
		}, this.getScatterPlotState());
	}

	componentDidUpdate() {
		d3ScatterPlot.update(this.refs.el, this.getScatterPlotState());
	}

	getScatterPlotState() {
		return {
			data: this.props.data,
			domain: this.props.domain
		};
	}

	componentWillUnmount() {
		d3ScatterPlot.destroy(this.refs.el);
	}

	render() {
		return <div ref="el"></div>
	}
}