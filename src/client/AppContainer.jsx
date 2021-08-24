import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton, { GithubButton } from './IconButton';
import queryString from 'query-string';
import { useLocalStorage } from './hooks';
import { FaCanadianMapleLeaf } from 'react-icons/fa';

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
	const [incomeFormat, setIncomeFormat] = useState('annual');
	const [hours, setHours] = useState(40);
	const [annualExpenses, setAnnualExpenses] = useState(20000);
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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginLeft: '1rem',
			}}
		>
			<label className="margin-bottom-1">
				Current
				<ButtonLabelToggle
					states={['annual', 'hourly']}
					value={incomeFormat}
					setValue={setIncomeFormat}
				/>
				income{' '}
				<input
					className="input is-small numeric"
					type="number"
					value={
						incomeFormat === 'annual'
							? annualIncome
							: Math.round((annualIncome / (52 * hours)) * 100) /
							  100
					}
					onChange={(e) => {
						const newValue = e.target.value;
						const annualIncome =
							incomeFormat === 'annual'
								? newValue
								: newValue * (52 * hours);
						setAnnualIncome(annualIncome);
						setAnnualSavings(annualIncome - annualExpenses);
						if (annualIncome > 0) {
							setSavingsRate(
								Math.max(
									0,
									((annualIncome - annualExpenses) /
										annualIncome) *
										100,
								),
							);
						}
					}}
				/>{' '}
				$
			</label>
			<div
				className="margin-bottom-1"
				style={{ display: 'flex', alignItems: 'center' }}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label>
						Current annual expenses{' '}
						<input
							className="input is-small numeric"
							type="number"
							value={annualExpenses}
							onChange={(e) => {
								const newValue = e.target.value;
								setAnnualExpenses(newValue);
								setAnnualSavings(annualIncome - newValue);
								if (annualIncome > 0) {
									setSavingsRate(
										Math.max(
											0,
											(1 - newValue / annualIncome) * 100,
										),
									);
								}
							}}
						/>{' '}
						$
					</label>
					<label>
						Current annual savings{' '}
						<input
							className="input is-small numeric"
							type="number"
							value={annualSavings}
							onChange={(e) => {
								const newValue = e.target.value;
								setAnnualSavings(newValue);
								setAnnualExpenses(annualIncome - newValue);
								if (annualIncome > 0) {
									setSavingsRate(
										Math.max(
											0,
											(newValue / annualIncome) * 100,
										),
									);
								}
							}}
						/>{' '}
						$
					</label>
				</div>
				<label className="numeric-container margin-left-2">
					Savings Rate{' '}
					<input
						className="numeric"
						type="number"
						value={savingsRate}
						onChange={(e) => {
							const newValue = e.target.value;
							setSavingsRate(newValue);
							setAnnualSavings(annualIncome * (newValue / 100));
							setAnnualExpenses(
								annualIncome * (1 - newValue / 100),
							);
						}}
					/>{' '}
					%
				</label>
			</div>
			<div className="margin-top-2 flex-column">
				<label className="margin-bottom-1">
					Annual return on investment{' '}
					<input
						className="input is-small numeric"
						type="number"
						value={returnRate}
						onChange={(newValue) => setReturnRate(newValue)}
					/>{' '}
					%
				</label>
				<label className="margin-bottom-1">
					Withdrawal Rate{' '}
					<input
						className="input is-small numeric"
						type="number"
						value={withdrawalRate}
						onChange={(newValue) => setWithdrawalRate(newValue)}
					/>{' '}
					%
				</label>
			</div>
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
			className="button is-text"
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
