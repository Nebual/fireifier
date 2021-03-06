import React from 'react';
import PropTypes from 'prop-types';

ButtonLabelToggle.propTypes = {
	states: PropTypes.arrayOf(PropTypes.string).isRequired,
	displayStates: PropTypes.arrayOf(PropTypes.node),
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	className: PropTypes.string,
};
export default function ButtonLabelToggle({ states, displayStates, value, setValue, className = '' }) {
	return (
		<button
			className={`button is-text inline-button is-capitalized ${className}`}
			type="button"
			onClick={() => {
				let nextIndex = states.indexOf(value) + 1;
				if (nextIndex >= states.length) {
					nextIndex = 0;
				}
				setValue(states[nextIndex]);
			}}
		>
			{displayStates ? displayStates[states.indexOf(value)] : value}
		</button>
	);
}
