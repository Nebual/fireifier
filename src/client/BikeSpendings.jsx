// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import NumberInput from './NumberInput';

import ButtonLabelToggle from './ButtonLabelToggle';
import { convertToAnnual, convertToInterval, round } from './calculations';

BikeSpendings.propTypes = {
	extraSpendings: PropTypes.array.isRequired,
	setExtraSpendings: PropTypes.func.isRequired,
};

export default function BikeSpendings({ extraSpendings, setExtraSpendings }) {
	const bikePurchase = extraSpendings.find(({ id }) => id === 'bikePurchase') || {
		id: 'bikePurchase',
		value: 2100,
		format: 'once',
		bike: 1,
	};
	const bikeElecCost = extraSpendings.find(({ id }) => id === 'bikeElecCost') || {
		id: 'bikeElecCost',
		value: 0.15,
		disabled: true,
		bike: 1,
	};
	const mileage = extraSpendings.find(({ id }) => id === 'bikeMileage') || {
		id: 'bikeMileage',
		value: 12 * 5,
		type: 'km',
		format: 'weekly',
		disabled: true,
		bike: 1,
	};
	const mileageCost = extraSpendings.find(({ id }) => id === 'bikeMileageCost') || {
		id: 'bikeMileageCost',
		value: 0,
		bike: 1,
		format: 'annual',
	};
	const bikeMaintenance = extraSpendings.find(({ id }) => id === 'bikeMaintenance') || {
		id: 'bikeMaintenance',
		value: 100,
		format: 'annual',
		bike: 1,
	};

	React.useEffect(() => {
		setExtraSpendings((extraSpendings) => {
			const mileageCostInner = extraSpendings.find(({ id }) => id === 'bikeMileageCost') || mileageCost;
			const kmPerYear = convertToAnnual(
				mileage.type === 'miles' ? mileage.value * 1.60934 : mileage.value,
				mileage.format,
			);
			const kmPerKwh = 70;
			console.log('S', kmPerYear, (kmPerYear / kmPerKwh) * bikeElecCost.value);
			return [
				...extraSpendings.filter(({ id }) => id !== 'bikeMileageCost'),
				{
					...mileageCostInner,
					value: (kmPerYear / kmPerKwh) * bikeElecCost.value,
				},
			];
		});
	}, [mileage.value, mileage.type, bikeElecCost.value, bikeElecCost.type]);
	React.useEffect(() => {
		setExtraSpendings((extraSpendings) => [
			...extraSpendings.filter(({ id }) => !['bikePurchase', 'bikeMaintenance'].includes(id)),
			bikePurchase,
			bikeMaintenance,
		]);
	}, []);

	return (
		<div className="field is-flex">
			<NumberInput
				className="mr-4"
				label="Bike Purchase"
				suffix="$"
				value={bikePurchase.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'bikePurchase'),
						{ ...bikePurchase, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label="Electricity Cost"
				suffix="$/kwh"
				value={bikeElecCost.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'bikeElecCost'),
						{ ...bikeElecCost, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label={
					<>
						<ButtonLabelToggle
							states={['annual', 'weekly']}
							value={mileage.format}
							setValue={(newFormat) => {
								setExtraSpendings((extraSpendings) => [
									...extraSpendings.filter(({ id }) => id !== 'bikeMileage'),
									{
										...mileage,
										format: newFormat,
										value: round(
											convertToInterval(
												convertToAnnual(mileage.value, mileage.format),
												newFormat,
											),
											1,
										),
									},
								]);
							}}
						/>
						<ButtonLabelToggle
							states={['km', 'miles']}
							value={mileage.type}
							setValue={(newType) => {
								setExtraSpendings((extraSpendings) => [
									...extraSpendings.filter(({ id }) => id !== 'bikeMileage'),
									{
										...mileage,
										type: newType,
										value: round(
											newType === 'miles' ? mileage.value / 1.60934 : mileage.value * 1.60934,
											1,
										),
									},
								]);
							}}
						/>
					</>
				}
				suffix={mileage.type === 'miles' ? 'mi' : 'km'}
				value={mileage.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'bikeMileage'),
						{ ...mileage, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label="Maintenance"
				suffix="$/y"
				value={bikeMaintenance.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'bikeMaintenance'),
						{ ...bikeMaintenance, value: Number(newVal) },
					]);
				}}
			/>
		</div>
	);
}
