// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

import NumberInput from './NumberInput';

import { ButtonLabelToggle } from './AppContainer';
import { convertToAnnual, convertToInterval, round } from './calculations';

ExtraSpendings.propTypes = {
	extraSpendings: PropTypes.array.isRequired,
	setExtraSpendings: PropTypes.func.isRequired,
};

export default function ExtraSpendings({ extraSpendings, setExtraSpendings }) {
	return extraSpendings.map(({ value, format }, i) => (
		<NumberInput
			key={`extraSpending${i}`}
			className="mr-4"
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
			suffix={
				<button
					type="button"
					className="button is-clickable is-small ml-4 is-danger"
					onClick={() => setExtraSpendings((arr) => arr.filter((_, i2) => i2 !== i))}
				>
					X
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
