import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import IconButton, { GithubButton } from './IconButton';
import queryString from 'query-string';
import { useLocalStorage } from './hooks';
import NumberInput from './NumberInput'
import { FaCanadianMapleLeaf, FaHourglassStart } from 'react-icons/fa';

export default function AppContainer() {
	return (
		<>
			<nav className="navbar is-spaced">
				<div className="navbar-brand">
					<div className="navbar-item">
						<h1 className="title is-4">Nebmato</h1>
					</div>
					<div className="navbar-item">
						<GithubButton />
					</div>
				</div>
				<div className="navbar-item has-dropdown is-hoverable">
					<a className="navbar-link">Links</a>

					<div className="navbar-dropdown">
						<NavbarItemLink href="https://engaging-data.com/fire-calculator/">
							General Fire Calculator
						</NavbarItemLink>
						<NavbarItemLink href="https://networthify.com/calculator/earlyretirement">
							When can I retire
						</NavbarItemLink>
						<NavbarItemLink href="https://networthify.com/calculator/recurring-charges?price=2800&period=annual&hourlyWage=20&roi=7&withdrawalRate=4&savingsRate=100&workDay=8&daysPerYear=232">
							Recurring Charges
						</NavbarItemLink>
						<NavbarItemLink href="http://mustachecalc.com/#/calcs/vehicle-cost">
							Vehicle Cost
						</NavbarItemLink>
						<NavbarItemLink href="http://mustachecalc.com/#/calcs/savings-from-not-spending">
							Savings from not Spending
						</NavbarItemLink>
						<hr className="navbar-divider" />
						<NavbarItemLink href="https://www.ratehub.ca/mortgage-payment-calculator">
							Mortgage Payment, rates{' '}
							<FaCanadianMapleLeaf className="margin-left-1" />
						</NavbarItemLink>
						<NavbarItemLink href="https://www.ratehub.ca/mortgage-affordability-calculator">
							Mortgage Affordability (given income + Down Payment){' '}
							<FaCanadianMapleLeaf className="margin-left-1" />
						</NavbarItemLink>
					</div>
				</div>
			</nav>
			<SavingsRateCalculator />
		</>
	);
}

function NavbarItemLink({ href, children }) {
	return (
		<a href={href} className="navbar-item">
			{children}
		</a>
	);
}

function SavingsRateCalculator() {
	const [annualIncome, setAnnualIncome] = useState(40000);
	const [hourlyIncome, setHourlyIncome] = useState();
	const [incomeFormat, setIncomeFormat] = useState('annual');
	const [hours, setHours] = useState(40);
	const [annualExpenses, setAnnualExpenses] = useState(20000);
	const [expenseFormat, setExpenseFormat] = useState('annual');
	const [annualSavings, setAnnualSavings] = useState(20000);
	const [savingsRate, setSavingsRate] = useState(50);
	const [returnRate, setReturnRate] = useState(5);
	const [withdrawalRate, setWithdrawalRate] = useState(4);

	// N = (-log(1- i * A / P)) / log (1 + i).
	// const interest = returnRate / 100;
	// N represents the number of payments you must make, and i is the interest rate. A is the amount owed and P is the size of each payment

	// const retireInYears = (-Math.log(1 + interest * fireTarget / annualSavings)) / Math.log(1 + interest)
	// const retireInYears = 1;

	const returnFloat = returnRate / 100;
	const savingsFloat = savingsRate / 100;
	const withdrawalFloat = withdrawalRate / 100;
	const retireInYears =
		Math.log(
			1 +
				(returnFloat * ((1 - savingsFloat) / withdrawalFloat)) /
					savingsFloat,
		) / Math.log(1 + returnFloat);

	const fireTarget = annualExpenses / withdrawalFloat;

	function updateAnnualIncome(annualIncome) {
		setAnnualIncome(annualIncome);
		setAnnualSavings(annualIncome - annualExpenses);
		if (annualIncome > 0) {
			setSavingsRate(
				Math.max(
					0,
					((annualIncome - annualExpenses) / annualIncome) * 100,
				),
			);
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginLeft: '1rem',
			}}
		>
			<div className="field is-flex">
				<NumberInput
					className="mb-0"
					label={
						<>
							<ButtonLabelToggle
								states={['annual', 'hourly']}
								value={incomeFormat}
								setValue={setIncomeFormat}
							/>{' '}
							Income
						</>
					}
					labelClassName="is-flex is-align-items-center"
					value={
						incomeFormat === 'annual'
							? annualIncome
							: hourlyIncome ||
							  Math.round((annualIncome / (52 * hours)) * 100) /
									100
					}
					onChange={(newValue) => {
						if (incomeFormat === 'hourly') {
							setHourlyIncome(newValue);
						}
						const annualIncome =
							incomeFormat === 'annual'
								? newValue
								: newValue * (52 * hours);
						updateAnnualIncome(annualIncome);
					}}
					suffix="$"
					help="After tax (+ RRSP contributions)"
				/>
				{incomeFormat === 'hourly' && (
					<NumberInput
						className="ml-4"
						label="Hours"
						value={hours}
						onChange={(newValue) => {
							setHours(newValue);
							if (newValue > 0 && hourlyIncome > 0) {
								updateAnnualIncome(hourlyIncome * (52 * hours));
							}
						}}
					/>
				)}
				{/* todo: allow pre-tax + province? or just link to Wealthsimple? */}
			</div>
			<div className="field is-flex is-align-items-center">
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<NumberInput
						label={
							<>
								<ButtonLabelToggle
									states={['annual', 'monthly']}
									value={expenseFormat}
									setValue={setExpenseFormat}
								/>{' '}
								Expenses
							</>
						}
						labelClassName="is-flex is-align-items-center"
						value={
							expenseFormat === 'annual'
								? annualExpenses
								: Math.round(annualExpenses / 12)
						}
						suffix="$"
						onChange={(newValue) => {
							const annualExpenses =
								expenseFormat === 'annual'
									? newValue
									: newValue * 12;
							setAnnualExpenses(annualExpenses);
							setAnnualSavings(annualIncome - annualExpenses);
							if (annualIncome > 0) {
								const newRate =
									1 - annualExpenses / annualIncome;
								setSavingsRate(Math.max(0, newRate * 100));
							}
						}}
					/>

					<NumberInput
						label="Annual Savings"
						value={annualSavings}
						suffix="$"
						onChange={(value) => {
							setAnnualSavings(value);
							setAnnualExpenses(annualIncome - value);
							if (annualIncome > 0) {
								setSavingsRate(
									Math.max(0, (value / annualIncome) * 100),
								);
							}
						}}
					/>
				</div>
				<div className="padding-x-4">=</div>
				<NumberInput
					label="Savings Rate"
					value={savingsRate}
					suffix="%"
					onChange={(newValue) => {
						setSavingsRate(newValue);
						setAnnualSavings(annualIncome * (newValue / 100));
						setAnnualExpenses(annualIncome * (1 - newValue / 100));
					}}
				/>
			</div>
			<NumberInput
				label="Annual return on investment"
				labelClassName="is-small"
				value={returnRate}
				suffix="%"
				onChange={(newValue) => {
					setReturnRate(newValue);
				}}
				help="After subtracting inflation (eg. 2%) and fees (eg. 0.22%)"
			/>
			<NumberInput
				label="Withdrawal Rate"
				labelClassName="is-small"
				value={withdrawalRate}
				suffix="%"
				onChange={(newValue) => {
					setWithdrawalRate(newValue);
				}}
			/>

			{fireTarget > 0 && <div>Fire Target: ${fireTarget}</div>}
			<div>
				Can retire in {Math.round(retireInYears * 10) / 10} years.
			</div>
		</div>
	);
}

ButtonLabelToggle.propTypes = {
	states: PropTypes.arrayOf(PropTypes.string),
	value: PropTypes.string,
	setValue: PropTypes.func,
};
function ButtonLabelToggle({ states, value, setValue }) {
	return (
		<button
			className="button is-text inline-button is-capitalized"
			type="button"
			onClick={() => {
				setValue((value) => {
					let nextIndex = states.indexOf(value) + 1;
					if (nextIndex >= states.length) {
						nextIndex = 0;
					}
					return states[nextIndex];
				});
			}}
		>
			{value}
		</button>
	);
}
