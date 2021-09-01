import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { useUpdateUrl, useUrlState } from './hooks';
import NumberInput from './NumberInput';
import { FaCanadianMapleLeaf, FaGithub } from 'react-icons/fa';
import { calcFireTarget, calcRetireYears, convertToAnnual, round } from './calculations';
import ExtraSpendings from './ExtraSpendings';

export default function AppContainer() {
	return (
		<>
			<nav className="navbar is-spaced is-block-touch">
				<div className="navbar-brand">
					<div className="navbar-item">
						<h1 className="title is-4">Neb&apos;s FIRE Calculator</h1>
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
							Mortgage Payment, rates <FaCanadianMapleLeaf className="ml-1" />
						</NavbarItemLink>
						<NavbarItemLink href="https://www.ratehub.ca/mortgage-affordability-calculator">
							Mortgage Affordability (given income + Down Payment){' '}
							<FaCanadianMapleLeaf className="ml-1" />
						</NavbarItemLink>
						<hr className="navbar-divider" />
						<a
							className="navbar-item"
							href="https://github.com/Nebual/money"
							target="_blank"
							rel="noreferrer"
						>
							<FaGithub className="mr-1" /> Calculator Source Code
						</a>
					</div>
				</div>
			</nav>
			<SavingsRateCalculator />
		</>
	);
}

NavbarItemLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};
function NavbarItemLink({ href, children = '' }) {
	return (
		<a href={href} className="navbar-item">
			{children}
		</a>
	);
}

function SavingsRateCalculator() {
	const [annualIncome, setAnnualIncome] = useUrlState('income', 40000);
	const [incomeFormat, setIncomeFormat] = useUrlState('incomeFormat', 'annual');
	const [hours, setHours] = useUrlState('hours', 40);
	const [hourlyIncome, setHourlyIncome] = useUrlState('income', 40000, (val) => val / (52 * hours));
	const [annualExpenses, setAnnualExpenses] = useUrlState('expenses', 20000);
	const [expenseFormat, setExpenseFormat] = useUrlState('expensesFormat', 'annual');
	const [annualSavings, setAnnualSavings] = useState(() => annualIncome - annualExpenses);
	const [extraSpendings, setExtraSpendings] = useUrlState('extraSpendings', '[]', (s) => {
		try {
			return JSON.parse(s) || [];
		} catch (e) {
			return [];
		}
	});
	const [savingsRate, setSavingsRate] = useState(() => round((annualSavings / annualIncome) * 100, 2));
	const [returnRate, setReturnRate] = useUrlState('return', 5);
	const [withdrawalRate, setWithdrawalRate] = useUrlState('withdrawal', 4);

	// N = (-log(1- i * A / P)) / log (1 + i).
	// const interest = returnRate / 100;
	// N represents the number of payments you must make, and i is the interest rate. A is the amount owed and P is the size of each payment

	// const retireInYears = (-Math.log(1 + interest * fireTarget / annualSavings)) / Math.log(1 + interest)
	// const retireInYears = 1;

	const sumExtraSpendings = extraSpendings.reduce(
		(a, data) => Number(a) + convertToAnnual(Number(data.value), data.format),
		0,
	);
	const sumExtraSpendingsPostRe = extraSpendings
		.filter(({ preRe }) => !preRe)
		.reduce((a, data) => Number(a) + convertToAnnual(Number(data.value), data.format), 0);

	const fireTarget = calcFireTarget(annualExpenses, withdrawalRate);
	const retireInYears = calcRetireYears(returnRate, fireTarget, annualSavings);

	function updateAnnualIncome(annualIncome) {
		setAnnualIncome(annualIncome);
		setAnnualSavings(annualIncome - annualExpenses);
		if (annualIncome > 0) {
			setSavingsRate(Math.max(0, ((annualIncome - annualExpenses) / annualIncome) * 100));
		}
	}

	useUpdateUrl({
		income: Number(annualIncome) !== 40000 && annualIncome,
		incomeFormat: incomeFormat !== 'annual' && incomeFormat,
		hours: Number(hours) !== 40 && hours,
		expenses: Number(annualExpenses) !== 20000 && annualExpenses,
		return: Number(returnRate) !== 5 && returnRate,
		withdrawal: Number(withdrawalRate) !== 4 && withdrawalRate,
		extraSpendings: sumExtraSpendings !== 0 && JSON.stringify(extraSpendings),
	});

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
						incomeFormat === 'annual' ? annualIncome : hourlyIncome || round(annualIncome / (52 * hours), 2)
					}
					onChange={(newValue) => {
						if (incomeFormat === 'hourly') {
							setHourlyIncome(newValue);
						}
						const annualIncome = incomeFormat === 'annual' ? newValue : newValue * (52 * hours);
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
			<div className="is-flex is-align-items-center is-flex-wrap-wrap">
				<div className="field is-flex is-flex-direction-column">
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
						value={expenseFormat === 'annual' ? annualExpenses : Math.round(annualExpenses / 12)}
						suffix="$"
						onChange={(newValue) => {
							const annualExpenses = expenseFormat === 'annual' ? newValue : newValue * 12;
							setAnnualExpenses(annualExpenses);
							setAnnualSavings(annualIncome - annualExpenses);
							if (annualIncome > 0) {
								const newRate = 1 - annualExpenses / annualIncome;
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
								setSavingsRate(Math.max(0, (value / annualIncome) * 100));
							}
						}}
					/>
				</div>
				<div className="px-4">=</div>
				<NumberInput
					label="Savings Rate"
					value={savingsRate}
					className="mr-4"
					suffix="%"
					onChange={(newValue) => {
						setSavingsRate(newValue);
						setAnnualSavings(annualIncome * (newValue / 100));
						setAnnualExpenses(annualIncome * (1 - newValue / 100));
					}}
				/>

				<ExtraSpendings extraSpendings={extraSpendings} setExtraSpendings={setExtraSpendings} />
				<button
					type="button"
					className="button is-small mt-4"
					onClick={() => setExtraSpendings((arr) => [...arr, { value: 0, format: 'daily' }])}
				>
					+
				</button>
			</div>

			<Accordion
				allowZeroExpanded={true}
				preExpanded={Number(returnRate) !== 5 || Number(withdrawalRate) !== 4 ? ['advanced'] : []}
			>
				<AccordionItem uuid="advanced">
					<AccordionItemHeading>
						<AccordionItemButton className="accordion__button is-underlined">
							Advanced Settings
						</AccordionItemButton>
					</AccordionItemHeading>
					<AccordionItemPanel>
						<div className="box is-inline-block">
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
						</div>
					</AccordionItemPanel>
				</AccordionItem>
			</Accordion>

			{sumExtraSpendings != 0 && (
				<div className="has-text-info">
					Extra Annual {sumExtraSpendings > 0 ? 'Spending' : 'Savings'}: ${Math.abs(round(sumExtraSpendings))}
				</div>
			)}
			{fireTarget > 0 && (
				<div>
					Fire Target: ${fireTarget}
					{sumExtraSpendingsPostRe != 0 && (
						<>
							{' | '}
							<span className="has-text-info">
								$
								{round(
									calcFireTarget(
										Number(annualExpenses) + Number(sumExtraSpendingsPostRe),
										withdrawalRate,
									),
								)}
							</span>
						</>
					)}
				</div>
			)}
			<div>
				Can retire in {round(retireInYears, 1)} years.
				{sumExtraSpendings != 0 && (
					<>
						{' | '}
						<span className="has-text-info">
							{sumExtraSpendings > 0 ? '+' : '-'}
							{round(
								Math.abs(
									retireInYears -
										calcRetireYears(
											returnRate,
											calcFireTarget(
												Number(annualExpenses) + Number(sumExtraSpendingsPostRe),
												withdrawalRate,
											),
											Number(annualSavings) - sumExtraSpendings,
										),
								),
								1,
							)}{' '}
							years
						</span>
					</>
				)}
			</div>
		</div>
	);
}

ButtonLabelToggle.propTypes = {
	states: PropTypes.arrayOf(PropTypes.string).isRequired,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	className: PropTypes.string,
};
export function ButtonLabelToggle({ states, value, setValue, className = '' }) {
	return (
		<button
			className={`button is-text inline-button is-capitalized ${className}`}
			type="button"
			onClick={() => {
				let nextIndex = states.indexOf(value) + 1;
				if (nextIndex >= states.length) {
					nextIndex = 0;
				}
				setValue(states[nextIndex]);
			}}
		>
			{value}
		</button>
	);
}
