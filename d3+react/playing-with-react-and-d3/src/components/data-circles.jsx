// src/components/data-circles.jsx
import React from 'react';

const renderCircles = (props) => {
	return (d, i) => {
		const circleProps = {
			cx: props.scales.x(d[0]),
			cy: props.scales.y(d[1]),
			r: props.scales.r(d[2]),
			key: i,
			className: "circle"
		};
		return <circle {...circleProps} />;
	};
};

export default (props) => {
	return <g className="circles">
		{ props.data.map(renderCircles(props)) }
	</g>
}