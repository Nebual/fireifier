// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';
import { FaCar } from 'react-icons/fa';

import NumberInput, { DurationControl } from './NumberInput';

import ButtonLabelToggle from './ButtonLabelToggle';
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
		type: 'purchase',
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
	const carPayment = extraSpendings.find(({ id }) => id === 'carPayment') || {
		id: 'carPayment',
		value: 500,
		format: 'monthly',
		years: 8,
		car: 1,
		disabled: 1,
	};
	const carInsurance = extraSpendings.find(({ id }) => id === 'carInsurance') || {
		id: 'carInsurance',
		value: 1500,
		format: 'annual',
		car: 1,
	};

	function updateExtraSpendings(updatedSpending) {
		if (updatedSpending.length) {
			const ids = updatedSpending.map(({ id }) => id);
			setExtraSpendings((extraSpendings) => [
				...extraSpendings.filter(({ id }) => !ids.includes(id)),
				...updatedSpending,
			]);
		} else {
			setExtraSpendings((extraSpendings) => [
				...extraSpendings.filter(({ id }) => id !== updatedSpending.id),
				updatedSpending,
			]);
		}
	}

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
		<div className="is-flex is-flex-wrap-wrap">
			<NumberInput
				className="mr-4"
				inputClassName="is-light-red"
				labelClassName="is-flex is-align-items-center"
				label={
					<>
						Car{' '}
						<ButtonLabelToggle
							states={['purchase', 'lease', 'loan']}
							value={carPurchase.type || 'purchase'}
							setValue={(newType) => {
								updateExtraSpendings([
									{
										...carPurchase,
										type: newType,
									},
									{ ...carMaintenance, disabled: newType === 'lease' },
									{ ...carPayment, disabled: newType === 'purchase', preRe: newType === 'lease' },
								]);
							}}
							className="mx-1"
						/>
					</>
				}
				title={carPurchase.type !== 'purchase' && `Down Payment for ${carPurchase.type}`}
				suffix="$"
				value={carPurchase.value}
				onChange={(newVal) => {
					updateExtraSpendings({
						...carPurchase,
						value: Number(newVal),
					});
				}}
				help={carPurchase.format !== 'once' && 'Down Payment'}
			/>
			{carPurchase.type !== 'purchase' && (
				<NumberInput
					className="mr-4"
					inputClassName="is-light-red"
					label={
						<>
							<FaCar style={{ position: 'relative', top: 2 }} /> Payments
						</>
					}
					suffix="$/m"
					value={carPayment.value}
					title={
						carPurchase.type === 'lease'
							? 'Tesla Model 3 lease: $593/m x 4y + $5000 dp'
							: 'Telsa Model 3 loan: $562/m x 8y + $5000 dp'
					}
					onChange={(newVal) => {
						updateExtraSpendings({
							...carPayment,
							value: Number(newVal),
						});
					}}
					help={<DurationControl extraSpending={carPayment} updateExtraSpendings={updateExtraSpendings} />}
					helpClassName="min-height-24"
				/>
			)}
			<NumberInput
				className="mr-4"
				inputClassName="is-light-red"
				label="Gas Cost"
				title="For Electric cars, use $/L for $/kwh, and kwh/100kw"
				suffix={
					<ButtonLabelToggle
						states={['$/G', '$/L']}
						value={gasCost.type}
						setValue={(newType) => {
							updateExtraSpendings({
								...gasCost,
								type: newType,
								value: round(newType === '$/G' ? gasCost.value * 3.78541 : gasCost.value / 3.78541),
							});
						}}
						className="is-clickable is-size-7"
					/>
				}
				value={gasCost.value}
				onChange={(newVal) => {
					updateExtraSpendings({ ...gasCost, value: Number(newVal) });
				}}
			/>
			<NumberInput
				className="mr-4 input--right-3-5"
				inputClassName="is-light-red"
				label="Efficiency"
				title="Expected longterm fuel efficiency (ie. https://fueleconomy.gov): 6.68 l/100km is good, 8.9 average car, 13.4 average truck. Tesla Model 3: 18 kwh/100km"
				suffix={
					<ButtonLabelToggle
						states={['mpg', 'l/100km']}
						value={carEfficiency.type}
						setValue={(newType) => {
							updateExtraSpendings({
								...carEfficiency,
								type: newType,
								value: 235.215 / carEfficiency.value,
							});
						}}
						className="is-clickable is-size-7"
					/>
				}
				value={carEfficiency.value}
				onChange={(newVal) => {
					updateExtraSpendings({ ...carEfficiency, value: Number(newVal) });
				}}
			/>
			<NumberInput
				className="mr-4"
				inputClassName="is-light-red"
				label={
					<>
						<ButtonLabelToggle
							states={['annual', 'weekly']}
							value={mileage.format}
							setValue={(newFormat) => {
								updateExtraSpendings({
									...mileage,
									format: newFormat,
									value: round(
										convertToInterval(convertToAnnual(mileage.value, mileage.format), newFormat),
										1,
									),
								});
							}}
						/>
						<ButtonLabelToggle
							states={['km', 'miles']}
							value={mileage.type}
							setValue={(newType) => {
								updateExtraSpendings({
									...mileage,
									type: newType,
									value: round(
										newType === 'miles' ? mileage.value / 1.60934 : mileage.value * 1.60934,
										1,
									),
								});
							}}
						/>
					</>
				}
				suffix={mileage.type === 'miles' ? 'mi' : 'km'}
				value={mileage.value}
				onChange={(newVal) => {
					updateExtraSpendings({ ...mileage, value: Number(newVal) });
				}}
			/>
			{carPurchase.type !== 'lease' && (
				<NumberInput
					className="mr-4"
					inputClassName="is-light-red"
					label="Maintenance"
					suffix="$/y"
					value={carMaintenance.value}
					title="Avg: $600, new Tesla: $300"
					onChange={(newVal) => {
						updateExtraSpendings({ ...carMaintenance, value: Number(newVal) });
					}}
				/>
			)}
			<NumberInput
				className="mr-4"
				inputClassName="is-light-red"
				label="Insurance"
				suffix="$/y"
				title="Tesla Model 3: $3600; base $0 car: $1500"
				value={carInsurance.value}
				onChange={(newVal) => {
					updateExtraSpendings({ ...carInsurance, value: Number(newVal) });
				}}
			/>
		</div>
	);
}
