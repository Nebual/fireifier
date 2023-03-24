import PropTypes from 'prop-types';
import React from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
	Label,
} from 'recharts';

import {
	calcFireTarget,
	calcRetireYears,
	convertToAnnual,
	futureValueOfSeries,
	principleAccum,
	round,
} from './calculations';

SavingsChart.propTypes = {
	annualSavings: PropTypes.number,
	annualExpenses: PropTypes.number,
	withdrawalRate: PropTypes.number,
	chartYears: PropTypes.number,
	returnFloat: PropTypes.number,
	savings: PropTypes.number,
	sumExtraSpendingsOnce: PropTypes.number,
	calcExtraSpendings: PropTypes.func,
	extraSpendingSign: PropTypes.number,
};

export default function SavingsChart({
	chartYears,
	returnFloat,
	savings,
	annualSavings,
	annualExpenses,
	withdrawalRate,
	sumExtraSpendingsOnce,
	calcExtraSpendings,
	extraSpendingSign,
}) {
	const sumExtraSpendingsPostRe = calcExtraSpendings(50);

	const fireTarget = calcFireTarget(annualExpenses, withdrawalRate);
	const fireTargetExtraSpendings = calcFireTarget(annualExpenses + Number(sumExtraSpendingsPostRe), withdrawalRate);
	const retireInYears = calcRetireYears(returnFloat, fireTarget, annualSavings, savings);
	let retireInYearsExtraSpending = calcRetireYears(
		returnFloat,
		fireTargetExtraSpendings,
		annualSavings - calcExtraSpendings(0), // approximation for chartYears
		savings - sumExtraSpendingsOnce,
	);

	const chartData = [
		{
			name: '0',
			saved: Number(savings),
			returns: 0,
			extraSpendings: 0,
			savedOrig: Number(savings),
			balanceOrig: Number(savings),
			savedExtra: 0,
			balanceExtra: 0,
		},
	];
	chartYears = Number(chartYears) || calcGraphYears(Math.max(retireInYearsExtraSpending, retireInYears));
	for (let year = 1; year <= chartYears; year++) {
		const yearExtraSpendings = calcExtraSpendings(year);

		const lastYear = chartData[year - 1];

		const savedOrig = lastYear.savedOrig + annualSavings;
		const balanceOrig = lastYear.balanceOrig * principleAccum(returnFloat, 1) + annualSavings;
		const returnsOrig = balanceOrig - savedOrig;

		const savedExtra = lastYear.savedExtra + yearExtraSpendings;
		const balanceExtra = lastYear.balanceExtra * principleAccum(returnFloat, 1) + yearExtraSpendings;
		const returnsExtra = balanceExtra - savedExtra;

		const sumYear = balanceOrig - balanceExtra;
		const sumLastYear = lastYear.balanceOrig - lastYear.balanceExtra;
		if (sumYear >= fireTargetExtraSpendings && sumLastYear < fireTargetExtraSpendings) {
			retireInYearsExtraSpending = year - 1 + (fireTargetExtraSpendings - sumLastYear) / (sumYear - sumLastYear);
		}

		chartData.push({
			name: `${year}`,
			saved: savedOrig - Math.max(0, savedExtra),
			returns: round(returnsOrig - Math.max(0, returnsExtra), 2),
			extraSpendings: Math.abs(balanceExtra),
			savedOrig,
			balanceOrig,
			savedExtra,
			balanceExtra,
		});
	}
	const cumulativeTotalSpendings = chartData[chartYears - 1].balanceExtra;

	function SavingsTooltip({ active, payload, label }) {
		if (!active) {
			return null;
		}
		const totalAmount = payload[0].value + payload[1].value + (extraSpendingSign >= 0 ? 0 : payload[2].value);
		const total = (
			<li className="recharts-tooltip-item">
				<span className="recharts-tooltip-item-name">Total</span>
				<span className="recharts-tooltip-item-separator">: </span>
				<span className="recharts-tooltip-item-value ml-auto">${round(totalAmount, -1).toLocaleString()}</span>
			</li>
		);
		return (
			<div
				className="recharts-default-tooltip"
				style={{
					margin: 0,
					padding: 10,
					backgroundColor: 'rgb(255, 255, 255)',
					border: '1px solid rgb(204, 204, 204)',
				}}
			>
				<p className="recharts-tooltip-label">After {label} Years</p>
				<ul className="recharts-tooltip-item-list">
					<li className="recharts-tooltip-item">
						<span className="recharts-tooltip-item-name">Principle Savings</span>
						<span className="recharts-tooltip-item-separator">: </span>
						<span className="recharts-tooltip-item-value ml-auto">
							${round(payload[0].value, -1).toLocaleString()}
						</span>
					</li>
					<li className="recharts-tooltip-item">
						<span className="recharts-tooltip-item-name">Earnings</span>
						<span className="recharts-tooltip-item-separator">: </span>
						<span className="recharts-tooltip-item-value ml-auto">
							${round(payload[1].value, -1).toLocaleString()}
						</span>
					</li>
					{extraSpendingSign >= 0 && total}
					{extraSpendingSign !== 0 && (
						<li className="recharts-tooltip-item" style={{ color: payload[2].fill }}>
							<span className="recharts-tooltip-item-name">
								Extra {extraSpendingSign >= 0 ? 'Spendings' : 'Savings'}
							</span>
							<span className="recharts-tooltip-item-separator">: </span>
							<span className="recharts-tooltip-item-value ml-auto">
								${round(payload[2].value, -1).toLocaleString()}
							</span>
						</li>
					)}
					{extraSpendingSign < 0 && total}
					<li className="recharts-tooltip-item">
						Monthly passive income: ${round((totalAmount * withdrawalRate) / 1200, -1).toLocaleString()}
					</li>
				</ul>
			</div>
		);
	}

	const chartRendered = (
		<div style={{ width: '100%', maxWidth: 800, height: 350, marginBottom: '1rem' }}>
			<ResponsiveContainer>
				<AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
					<XAxis dataKey="name">
						<Label value="Year" offset={-2} position="insideBottom" />
					</XAxis>
					<YAxis
						orientation="right"
						tickFormatter={(val) => {
							if (val >= 1000000) {
								return `$${(val / 1000000).toLocaleString()}m`;
							}
							return `$${(val / 1000).toLocaleString()}k`;
						}}
						tickCount={8}
					/>
					<Tooltip content={SavingsTooltip} />
					<CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
					<ReferenceLine y={fireTarget} label="Fire Target" stroke="green" strokeDasharray="3 3" />
					{sumExtraSpendingsPostRe != 0 && (
						<ReferenceLine
							y={fireTargetExtraSpendings}
							label="New Fire Target"
							stroke="orange"
							strokeDasharray="3 3"
						/>
					)}
					<Area type="monotone" dataKey="saved" stroke="#76a9f6" fill="#76a9f6" stackId="1" />
					<Area type="monotone" dataKey="returns" stroke="#387908" fill="#387908" stackId="1" />
					{extraSpendingSign > 0 && (
						<Area type="monotone" dataKey="extraSpendings" stroke="#C0360C" fill="#C0360C" stackId="1" />
					)}
					{extraSpendingSign < 0 && (
						<Area type="monotone" dataKey="extraSpendings" stroke="#8ACB5A" fill="#8ACB5A" stackId="1" />
					)}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);

	return (
		<>
			{extraSpendingSign !== 0 && (
				<div className="has-text-info">
					Extra Annual {extraSpendingSign > 0 ? 'Spending' : 'Savings'}: $
					{Math.abs(round(calcExtraSpendings(0), 0)).toLocaleString()}
					&nbsp;(Total: ${Math.abs(round(cumulativeTotalSpendings, 0)).toLocaleString()}
					{cumulativeTotalSpendings > 0 ? '' : ' Savings'} over {chartYears}y)
				</div>
			)}
			{fireTarget > 0 && (
				<div>
					<span
						title={`Once you have this target invested, you'll be able to withdraw $${(
							(fireTarget * withdrawalRate) /
							100
						).toLocaleString()} per year throughout your retirement.`}
					>
						Fire Target: ${fireTarget.toLocaleString()}
					</span>
					{sumExtraSpendingsPostRe != 0 && (
						<>
							{' | '}
							<span className="has-text-info">
								${round(fireTargetExtraSpendings, 0).toLocaleString()}
							</span>
						</>
					)}
				</div>
			)}
			<div>
				Can retire in {round(retireInYears, 1)} years.
				{extraSpendingSign !== 0 && (
					<>
						{' | '}
						<span className="has-text-info">
							{extraSpendingSign > 0 ? '+' : '-'}
							{round(Math.abs(retireInYears - retireInYearsExtraSpending), 1)} years
						</span>
					</>
				)}
			</div>
			{chartRendered}
		</>
	);
}

function calcGraphYears(retireInYears) {
	if (retireInYears > 50) {
		return 50;
	}
	if (retireInYears > 20) {
		return Math.ceil(retireInYears);
	}
	if (retireInYears >= 14) {
		return 20;
	}
	if (retireInYears >= 9) {
		return 15;
	}
	if (retireInYears >= 4.5) {
		return 10;
	}
	return 5;
}
