import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

NumberInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
	label: PropTypes.node.isRequired,
	labelClassName: PropTypes.string,
	inputClassName: PropTypes.string,
	prefix: PropTypes.node,
	suffix: PropTypes.node,
	help: PropTypes.node,
	title: PropTypes.string,
	placeholder: PropTypes.string,
};
export default function NumberInput({
	value,
	onChange,
	className = '',
	label,
	labelClassName = '',
	inputClassName = '',
	prefix = null,
	suffix = null,
	help = null,
	title = null,
	placeholder = '',
}) {
	return (
		<div className={`field ${className}`}>
			<label className={`label ${labelClassName}`}>{label}</label>
			<p className={classNames('control numeric', suffix && 'has-icons-right', prefix && 'has-icons-left')}>
				{prefix && <span className="icon is-small is-left">{prefix}</span>}
				<input
					className={`input is-small ${inputClassName}`}
					type="number"
					value={value}
					placeholder={placeholder}
					title={title}
					onChange={(e) => onChange(e.target.value)}
				/>
				{suffix && <span className="icon is-small is-right">{suffix}</span>}
			</p>
			{help && <p className="help">{help}</p>}
		</div>
	);
}
