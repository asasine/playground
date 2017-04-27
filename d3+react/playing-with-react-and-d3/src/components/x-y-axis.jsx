// src/components/x-y-axis.jsx
import React from 'react';
import Axis from './axis';

export default (props) => {
	const xSettings = {
		translate: `translate(0, ${props.styles.height - props.styles.padding})`,
		scale: props.scales.x,
		orient: 'bottom'
	};
	const ySettings = {
		translate: `translate(${props.styles.padding}, 0)`,
		scale: props.scales.y,
		orient: 'left'
	};
	return <g className="xy-axis">
		<Axis {...xSettings} />
		<Axis {...ySettings} />
	</g>
}