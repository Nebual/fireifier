import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';
import JSONCrush from 'jsoncrush';

import { useUpdateUrl, useUrlState } from './hooks';
import NumberInput from './NumberInput';
import { FaCanadianMapleLeaf, FaGithub, FaCar, FaBicycle, FaPlus } from 'react-icons/fa';
import { convertToAnnual, round } from './calculations';
import ButtonLabelToggle from './ButtonLabelToggle';
import ExtraSpendings from './ExtraSpendings';
import CarSpendings from './CarSpendings';
import BikeSpendings from './BikeSpendings';
const SavingsChart = React.lazy(() => import('./SavingsChart'));

export default function AppContainer() {
	return (
		<>
			<nav className="navbar is-spaced">
				<div className="navbar-brand">
					<div className="navbar-item">
						<h1 className="title is-4">Fireifier</h1>
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
						<NavbarItemLink href="https://www.cfiresim.com">
							cFireSim: investment portfolio simulator
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
							href="https://github.com/Nebual/fireifier"
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

	const [savings, setSavings] = useUrlState('savings', 0);
	const [annualExpenses, setAnnualExpenses] = useUrlState('expenses', 20000);
	const [expenseFormat, setExpenseFormat] = useUrlState('expensesFormat', 'annual');
	const [annualSavings, setAnnualSavings] = useState(() => annualIncome - annualExpenses);
	const [extraSpendings, setExtraSpendings] = useUrlState('extraSpendings', '[]', (s) => {
		try {
			return JSON.parse(JSONCrush.uncrush(s)) || [];
		} catch (e) {
			return [];
		}
	});
	const [savingsRate, setSavingsRate] = useState(() => round((annualSavings / annualIncome) * 100, 2));
	const [returnRate, setReturnRate] = useUrlState('return', 5);
	const [withdrawalRate, setWithdrawalRate] = useUrlState('withdrawal', 4);
	const [showCar, setShowCar] = useUrlState('showCar', false);
	const [showBike, setShowBike] = useUrlState('showBike', false);

	const [chartYears, setChartYears] = useState('');

	const extraSpendingsForCalcs = extraSpendings.filter(
		({ disabled, car, bike }) => !disabled && (showCar || !car) && (showBike || !bike),
	);
	function calcExtraSpendings(year) {
		return extraSpendingsForCalcs
			.filter(
				({ format, years, preRe }) =>
					format !== 'once' && //
					(!years || year <= years) && //
					(!preRe || year < 50),
			)
			.reduce((a, data) => Number(a) + convertToAnnual(Number(data.value), data.format), 0);
	}
	const extraSpendingSign = Math.sign(calcExtraSpendings(0));

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
		savings: Number(savings) !== 0 && savings,
		expenses: Number(annualExpenses) !== 20000 && annualExpenses,
		return: Number(returnRate) !== 5 && returnRate,
		withdrawal: Number(withdrawalRate) !== 4 && withdrawalRate,
		showCar: showCar && 1,
		showBike: showBike && 1,
		extraSpendings:
			extraSpendingSign !== 0 &&
			JSONCrush.crush(
				JSON.stringify(extraSpendings.filter(({ car, bike }) => (!car || showCar) && (!bike || showBike))),
			),
	});
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginLeft: '1rem',
				width: '100%',
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
					help={
						<>
							<a
								className="is-underlined"
								href="https://www.wealthsimple.com/en-ca/tool/tax-calculator"
								target="_blank"
								rel="noreferrer"
							>
								After tax
							</a>{' '}
							(with RRSP contributions)
						</>
					}
				/>
				{incomeFormat === 'hourly' && (
					<NumberInput
						className="ml-4"
						label="Hours/week"
						value={hours}
						onChange={(newValue) => {
							setHours(newValue);
							if (newValue > 0 && hourlyIncome > 0) {
								updateAnnualIncome(hourlyIncome * (52 * newValue));
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
					onClick={() => setExtraSpendings((arr) => [...arr, { value: 0, format: 'monthly' }])}
				>
					<FaPlus />
				</button>
				<button
					type="button"
					className={classNames('button is-small mx-1 mt-4', showCar && 'is-success')}
					onClick={() => setShowCar((s) => !s)}
				>
					<FaCar />
				</button>
				<button
					type="button"
					className={classNames('button is-small mt-4', showBike && 'is-success')}
					onClick={() => setShowBike((s) => !s)}
				>
					<FaBicycle />
				</button>
			</div>
			{showCar && <CarSpendings extraSpendings={extraSpendings} setExtraSpendings={setExtraSpendings} />}
			{showBike && <BikeSpendings extraSpendings={extraSpendings} setExtraSpendings={setExtraSpendings} />}
			<div className="field">
				<NumberInput
					label="Investments Balance"
					labelClassName="is-small"
					value={savings}
					suffix="$"
					onChange={setSavings}
				/>
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
							<NumberInput
								label="Chart Years"
								labelClassName="is-small"
								value={chartYears}
								suffix="Years"
								onChange={setChartYears}
								placeholder="auto "
							/>
						</div>
					</AccordionItemPanel>
				</AccordionItem>
			</Accordion>
			<Suspense fallback={<div>Loading graph...</div>}>
				<SavingsChart
					chartYears={Number(chartYears)}
					savings={Number(savings)}
					annualSavings={Number(annualSavings)}
					annualExpenses={Number(annualExpenses)}
					withdrawalRate={Number(withdrawalRate)}
					returnFloat={Number(returnRate) / 100}
					sumExtraSpendingsOnce={extraSpendingsForCalcs
						.filter(({ format }) => format === 'once')
						.reduce((a, data) => Number(a) + Number(data.value), 0)}
					calcExtraSpendings={calcExtraSpendings}
					extraSpendingSign={extraSpendingSign}
				/>
			</Suspense>
		</div>
	);
}
