// src/components/d3/d3-scatter-plot.js
import { memoize } from '../../helpers.js';
var d3 = Object.assign({}, require('d3-selection'), require('d3-scale'), require('d3-transition'));

const TAG = 'd3ScatterPlot';

var d3ScatterPlot = {};

d3ScatterPlot.create = function(el, props, state) {
	console.log(TAG + '.create', el, props, state);
	var svg = d3.select(el).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width)
		.attr('height', props.height);

	svg.append('g')
		.attr('class', 'd3-points');

	this.update(el, state);
};

d3ScatterPlot.update = function(el, state) {
	console.log(TAG + '.update', el, state);
	var scales = this._scales(el, state.domain);
	this._drawPoints(el, scales, state.data);
};

d3ScatterPlot.destroy = function(el) {
	console.log(TAG + '.destroy', el);
};

d3ScatterPlot._scales = memoize(function(el, domain) {
	console.log(TAG +'._scales', el, domain);
	if (!domain) {
		return null;
	}

	var width = el.offsetWidth;
	var height = el.offsetHeight;

	var x = d3.scaleLinear()
		.range([0, width])
		.domain(domain.x);

	var y = d3.scaleLinear()
		.range([height, 0])
		.domain(domain.y);

	var z = d3.scaleLinear()
		.range([5, 20])
		.domain(domain.z);

	return { x: x, y: y, z: z };
});
// d3ScatterPlot._scales = memoize(d3ScatterPlot._scales);

d3ScatterPlot._drawPoints = function(el, scales, data) {
	console.log(TAG + '._drawPoints', el, scales, data);
	var g = d3.select(el).selectAll('.d3-points');

	var point = g.selectAll('.d3-point')
		.data(data, d => d.id);

	// NEW
	point.enter().append('circle')
		.attr('class', 'd3-point')
	// NEW + CURRENT
	.merge(point)
		.attr('cx', d => scales.x(d.x))
		.attr('cy', d => scales.y(d.y))
		.transition()
		.attr('r', d => scales.z(d.z))
	// OLD
	point.exit()
		.transition()
		.attr('fill', 'red')
		.attr('r', 0)
		.remove();
}

export default d3ScatterPlot;