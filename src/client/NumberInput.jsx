import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

NumberInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
	label: PropTypes.node.isRequired,
	labelClassName: PropTypes.string,
	suffix: PropTypes.node,
	help: PropTypes.node,
};
export default function NumberInput({
	value,
	onChange,
	className,
	label,
	labelClassName,
	suffix,
	help,
}) {
	return (
		<div className={`field ${className}`}>
			<label className={`label ${labelClassName}`}>{label}</label>
			<p
				className={classNames(
					'control numeric',
					suffix && 'has-icons-right',
				)}
			>
				<input
					className="input is-small"
					type="number"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				{suffix && (
					<span className="icon is-small is-right">{suffix}</span>
				)}
			</p>
			{help && <p className="help">{help}</p>}
		</div>
	);
}
