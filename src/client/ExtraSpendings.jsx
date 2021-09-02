// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import NumberInput from './NumberInput';
import { FaEye, FaEyeSlash, FaTrashAlt } from 'react-icons/fa';

import { ButtonLabelToggle } from './AppContainer';
import { convertToAnnual, convertToInterval, round } from './calculations';

ExtraSpendings.propTypes = {
	extraSpendings: PropTypes.array.isRequired,
	setExtraSpendings: PropTypes.func.isRequired,
};

export default function ExtraSpendings({ extraSpendings, setExtraSpendings }) {
	return extraSpendings.map(({ value, format, disabled }, i) => (
		<NumberInput
			key={`extraSpending${i}`}
			className="mr-4"
			inputClassName={classNames(disabled && 'has-text-grey-light')}
			label={
				<>
					Extra
					<ButtonLabelToggle
						className="ml-1 is-small has-text-info"
						states={['daily', 'monthly', 'annual']}
						value={format}
						setValue={(newFormat) => {
							const oldFormat = extraSpendings[i].format;
							const modified = [...extraSpendings];
							modified[i].format = newFormat;
							modified[i].value = round(
								convertToInterval(convertToAnnual(extraSpendings[i].value, oldFormat), newFormat),
								2,
							);
							setExtraSpendings(modified);
						}}
					/>
					{value >= 0 ? 'Spending' : 'Savings'}
				</>
			}
			labelClassName="is-small has-text-info"
			value={value}
			onChange={(newValue) => {
				const modified = [...extraSpendings];
				modified[i].value = newValue;
				setExtraSpendings(modified);
			}}
			prefix={
				<button
					type="button"
					className="button is-clickable is-small px-1"
					onClick={() => {
						const modified = [...extraSpendings];
						modified[i].disabled = !extraSpendings[i].disabled;
						setExtraSpendings(modified);
					}}
				>
					{disabled ? <FaEyeSlash/> : <FaEye/>}
				</button>
			}
			suffix={
				<button
					type="button"
					className="button is-clickable is-small px-1 is-danger"
					onClick={() => setExtraSpendings((arr) => arr.filter((_, i2) => i2 !== i))}
				>
					<FaTrashAlt/>
				</button>
			}
			help={
				<>
					<label className="checkbox">
						<input
							type="checkbox"
							checked={!!extraSpendings[i].preRe}
							onChange={() => {
								const modified = [...extraSpendings];
								modified[i].preRe = !extraSpendings[i].preRe;
								setExtraSpendings(modified);
							}}
						/>{' '}
						only before retirement
					</label>
				</>
			}
		/>
	));
}
