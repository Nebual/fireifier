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
	chartYears: PropTypes.number,
	fireTarget: PropTypes.number,
	fireTargetExtraSpendings: PropTypes.number,
	retireInYears: PropTypes.number,
	retireInYearsExtraSpending: PropTypes.number,
	returnFloat: PropTypes.number,
	savings: PropTypes.number,
	sumExtraSpendings: PropTypes.number,
	sumExtraSpendingsPostRe: PropTypes.number,
};

export default function SavingsChart({
	chartYears,
	retireInYearsExtraSpending,
	retireInYears,
	returnFloat,
	savings,
	annualSavings,
	sumExtraSpendings,
	sumExtraSpendingsPostRe,
	fireTarget,
	fireTargetExtraSpendings,
}) {
	function SavingsTooltip({ active, payload, label }) {
		if (!active) {
			return null;
		}
		const total = (
			<li className="recharts-tooltip-item">
				<span className="recharts-tooltip-item-name">Total</span>
				<span className="recharts-tooltip-item-separator">: </span>
				<span className="recharts-tooltip-item-value ml-auto">
					$
					{round(
						payload[0].value + payload[1].value + (sumExtraSpendings >= 0 ? 0 : payload[2].value),
						-1,
					).toLocaleString()}
				</span>
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
					{sumExtraSpendings >= 0 && total}
					{sumExtraSpendings !== 0 && (
						<li className="recharts-tooltip-item" style={{ color: payload[2].fill }}>
							<span className="recharts-tooltip-item-name">
								Extra {sumExtraSpendings >= 0 ? 'Spendings' : 'Savings'}
							</span>
							<span className="recharts-tooltip-item-separator">: </span>
							<span className="recharts-tooltip-item-value ml-auto">
								${round(payload[2].value, -1).toLocaleString()}
							</span>
						</li>
					)}
					{sumExtraSpendings < 0 && total}
				</ul>
			</div>
		);
	}

	return (
		<div style={{ width: '100%', maxWidth: 800, height: 350, marginBottom: '1rem' }}>
			<ResponsiveContainer>
				<AreaChart
					data={[
						...Array(
							Number(chartYears) || calcGraphYears(Math.max(retireInYearsExtraSpending, retireInYears)),
						).keys(),
					].map((i) => {
						const year = i + 1;
						const cumulativeGainFloat = futureValueOfSeries(returnFloat, year);
						const saved = Number(savings) + annualSavings * year;
						const savedLess = sumExtraSpendings * year;
						const returnsLess = sumExtraSpendings * cumulativeGainFloat - savedLess;
						return {
							name: `${year}`,
							saved: saved - Math.max(0, savedLess),
							returns: round(
								Number(savings) * principleAccum(returnFloat, year) +
									annualSavings * cumulativeGainFloat -
									saved -
									Math.max(0, returnsLess),
								2,
							),
							extraSpendings: Math.abs(savedLess + returnsLess),
						};
					})}
					margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
				>
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
					{sumExtraSpendings > 0 && (
						<Area type="monotone" dataKey="extraSpendings" stroke="#C0360C" fill="#C0360C" stackId="1" />
					)}
					{sumExtraSpendings < 0 && (
						<Area type="monotone" dataKey="extraSpendings" stroke="#8ACB5A" fill="#8ACB5A" stackId="1" />
					)}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

function calcGraphYears(retireInYears) {
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
