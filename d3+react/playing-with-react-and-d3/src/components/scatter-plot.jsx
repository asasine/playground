// unfinished/src/components/scatter-plot.jsx
import React from 'react';
var d3 = Object.assign({}, require('d3-scale'), require('d3-array'));
import DataCircles from './data-circles';
import XYAxis from './x-y-axis';

const xMax = (data) => d3.max(data, (d) => d[0]);
const yMax = (data) => d3.max(data, (d) => d[1]);
const xScale = (props) => {
	return d3.scaleLinear()
		.domain([0, xMax(props.data)])
		.range([props.padding, props.width - props.padding * 2]);
};
const yScale = (props) => {
	return d3.scaleLinear()
		.domain([0, yMax(props.data)])
		.range([props.height - props.padding, props.padding]);
};

export default (props) => {
	const scales = { xScale: xScale(props), yScale: yScale(props) };
	return <svg width={props.width} height={props.height}>
		<DataCircles {...props} {...scales} />
		<XYAxis {...props} {...scales} />
	</svg>
}