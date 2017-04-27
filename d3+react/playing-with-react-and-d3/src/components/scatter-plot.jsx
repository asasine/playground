// src/components/scatter-plot.jsx
import React from 'react';
var d3 = Object.assign({}, require('d3-scale'), require('d3-array'));
import DataCircles from './data-circles';
import XYAxis from './x-y-axis';

const iMax = (data, i) => d3.max(data, d => d[i]);
const xScale = (props) => {
	return d3.scaleLinear()
		.domain([0, iMax(props.data, 0)])
		.range([props.styles.padding, props.styles.width - props.styles.padding * 2]);
};
const yScale = (props) => {
	return d3.scaleLinear()
		.domain([0, iMax(props.data, 1)])
		.range([props.styles.height - props.styles.padding, props.styles.padding]);
};
const zScale = (props) => {
	return d3.scaleLinear()
		.domain([0, iMax(props.data, 2)])
		.range([1, 5]);
};

export default (props) => {
	const scales = { x: xScale(props), y: yScale(props), r: zScale(props) };
	return <svg width={props.styles.width} height={props.styles.height}>
		<DataCircles data={props.data} scales={scales} />
		<XYAxis styles={props.styles} scales={scales} />
	</svg>
}