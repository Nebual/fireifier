// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import NumberInput from './NumberInput';

import { ButtonLabelToggle } from './AppContainer';
import { convertToAnnual, convertToInterval, round } from './calculations';

CarSpendings.propTypes = {
	extraSpendings: PropTypes.array.isRequired,
	setExtraSpendings: PropTypes.func.isRequired,
};

export default function CarSpendings({ extraSpendings, setExtraSpendings }) {
	const carPurchase = extraSpendings.find(({ id }) => id === 'carPurchase') || {
		id: 'carPurchase',
		value: 10000,
		format: 'once',
		car: 1,
	};
	const gasCost = extraSpendings.find(({ id }) => id === 'gasCost') || {
		id: 'gasCost',
		value: 1.8,
		type: '$/L',
		disabled: true,
		car: 1,
	};
	const carEfficiency = extraSpendings.find(({ id }) => id === 'carEfficiency') || {
		id: 'carEfficiency',
		value: 8.9,
		type: 'l/100km',
		disabled: true,
		car: 1,
	};
	const mileage = extraSpendings.find(({ id }) => id === 'mileage') || {
		id: 'mileage',
		value: 150,
		type: 'km',
		format: 'weekly',
		disabled: true,
		car: 1,
	};
	const mileageCost = extraSpendings.find(({ id }) => id === 'mileageCost') || {
		id: 'mileageCost',
		value: 0,
		car: 1,
		format: 'annual',
	};
	const carMaintenance = extraSpendings.find(({ id }) => id === 'carMaintenance') || {
		id: 'carMaintenance',
		value: 600,
		format: 'annual',
		car: 1,
	};
	const carInsurance = extraSpendings.find(({ id }) => id === 'carInsurance') || {
		id: 'carInsurance',
		value: 1500,
		format: 'annual',
		car: 1,
	};

	React.useEffect(() => {
		setExtraSpendings((extraSpendings) => {
			const mileageCostInner = extraSpendings.find(({ id }) => id === 'mileageCost') || mileageCost;
			const kmPerYear = convertToAnnual(
				mileage.type === 'miles' ? mileage.value * 1.60934 : mileage.value,
				mileage.format,
			);
			const efficiencyLitrePerKm =
				carEfficiency.type === 'mpg'
					? 235.215 / Number(carEfficiency.value) / 100
					: Number(carEfficiency.value) / 100;
			const gasCostPerLitre = gasCost.type === '$/G' ? gasCost.value / 3.78541 : gasCost.value;
			return [
				...extraSpendings.filter(({ id }) => id !== 'mileageCost'),
				{
					...mileageCostInner,
					value: kmPerYear * efficiencyLitrePerKm * gasCostPerLitre,
				},
			];
		});
	}, [mileage.value, mileage.type, carEfficiency.value, carEfficiency.type, gasCost.value, gasCost.type]);
	React.useEffect(() => {
		setExtraSpendings((extraSpendings) => [
			...extraSpendings.filter(({ id }) => !['carPurchase', 'carMaintenance', 'carInsurance'].includes(id)),
			carPurchase,
			carMaintenance,
			carInsurance,
		]);
	}, []);

	return (
		<div className="field is-flex">
			<NumberInput
				className="mr-4"
				label="Car Purchase"
				suffix="$"
				value={carPurchase.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'carPurchase'),
						{ ...carPurchase, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label="Gas Cost"
				suffix={
					<ButtonLabelToggle
						states={['$/G', '$/L']}
						value={gasCost.type}
						setValue={(newType) => {
							setExtraSpendings((extraSpendings) => [
								...extraSpendings.filter(({ id }) => id !== 'gasCost'),
								{
									...gasCost,
									type: newType,
									value: round(newType === '$/G' ? gasCost.value * 3.78541 : gasCost.value / 3.78541),
								},
							]);
						}}
						className="is-clickable is-size-7"
					/>
				}
				value={gasCost.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'gasCost'),
						{ ...gasCost, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4 input--right-3-5"
				label="Efficiency"
				title="Expected longterm fuel efficiency (ie. https://fueleconomy.gov): 6.68 l/100km is good, 8.9 average car, 13.4 average truck"
				suffix={
					<ButtonLabelToggle
						states={['mpg', 'l/100km']}
						value={carEfficiency.type}
						setValue={(newType) => {
							setExtraSpendings((extraSpendings) => [
								...extraSpendings.filter(({ id }) => id !== 'carEfficiency'),
								{ ...carEfficiency, type: newType, value: 235.215 / carEfficiency.value },
							]);
						}}
						className="is-clickable is-size-7"
					/>
				}
				value={carEfficiency.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'carEfficiency'),
						{ ...carEfficiency, value: Number(newVal) },
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
									...extraSpendings.filter(({ id }) => id !== 'mileage'),
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
									...extraSpendings.filter(({ id }) => id !== 'mileage'),
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
						...extraSpendings.filter(({ id }) => id !== 'mileage'),
						{ ...mileage, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label="Maintenance"
				suffix="$/y"
				value={carMaintenance.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'carMaintenance'),
						{ ...carMaintenance, value: Number(newVal) },
					]);
				}}
			/>
			<NumberInput
				className="mr-4"
				label="Insurance"
				suffix="$/y"
				value={carInsurance.value}
				onChange={(newVal) => {
					setExtraSpendings((extraSpendings) => [
						...extraSpendings.filter(({ id }) => id !== 'carInsurance'),
						{ ...carInsurance, value: Number(newVal) },
					]);
				}}
			/>
		</div>
	);
}
