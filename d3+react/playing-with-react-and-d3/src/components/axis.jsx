// src/components/axis.jsx
import React from 'react';
var d3 = Object.assign({}, require('d3-selection'), require('d3-axis'));

export default class Axis extends React.Component {
	componentDidMount() {
		this.renderAxis();
	}

	componentDidUpdate() {
		this.renderAxis();
	}

	renderAxis() {
		var node = this.refs.axis;
		var axis;
		switch (this.props.orient) {
			case 'top':
				axis = d3.axisTop();
				break;
			case 'right':
				axis = d3.axisRight();
				break;
			case 'bottom':
				axis = d3.axisBottom();
				break;
			case 'left':
				axis = d3.axisLeft();
				break
		}
		axis = axis.ticks(5).scale(this.props.scale);
		// var axis = d3.svg.axis().orient(this.props.orient).ticks(5).scale(this.props.scale);
		d3.select(node).call(axis);
	}

	render() {
		return <g className="axis" ref="axis" transform={this.props.translate}></g>
	}
}