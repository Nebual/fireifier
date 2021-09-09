import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';
import ButtonLabelToggle from './ButtonLabelToggle';

NumberInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
	label: PropTypes.node.isRequired,
	labelClassName: PropTypes.string,
	inputClassName: PropTypes.string,
	helpClassName: PropTypes.string,
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
	helpClassName = '',
	prefix = null,
	suffix = null,
	help = null,
	title = null,
	placeholder = '',
}) {
	return (
		<div className={`field ${className}`}>
			<label className={`${labelClassName}`} title={title}>
				{label}
			</label>
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
			{help && <div className={`help ${helpClassName}`}>{help}</div>}
		</div>
	);
}

DurationControl.propTypes = {
	extraSpending: PropTypes.shape({ years: PropTypes.number, preRe: PropTypes.bool }).isRequired,
	updateExtraSpendings: PropTypes.func.isRequired,
};
export function DurationControl({ extraSpending, updateExtraSpendings }) {
	return extraSpending.preRe ? (
		<ButtonLabelToggle
			states={['Until Retirement', 'forever']}
			value={'Until Retirement'}
			setValue={() => {
				const { years: _, preRe: _2, ...rest } = extraSpending;
				updateExtraSpendings(rest);
			}}
			className="is-clickable is-size-7 mb-2"
		/>
	) : extraSpending.years === undefined ? (
		<ButtonLabelToggle
			states={['forever', 'for']}
			value={'forever'}
			setValue={() => {
				const { years: _, ...rest } = extraSpending;
				updateExtraSpendings({ ...rest, years: 5 });
			}}
			className="is-clickable is-size-7"
		/>
	) : (
		<NumberInput
			label={
				<ButtonLabelToggle
					states={['for', 'preRe']}
					value={'for'}
					setValue={() => {
						const { years: _, ...rest } = extraSpending;
						updateExtraSpendings({ ...rest, preRe: 1 });
					}}
					className="is-clickable is-size-7"
				/>
			}
			value={extraSpending.years}
			onChange={(newVal) => {
				updateExtraSpendings({ ...extraSpending, years: Number(newVal) });
			}}
			className="is-tiny is-inline-flex"
			suffix="y"
		/>
	);
}
