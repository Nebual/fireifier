export function calcFireTarget(annualExpenses, withdrawalRate) {
	const withdrawalFloat = withdrawalRate / 100;
	return annualExpenses / withdrawalFloat;
}
export function calcRetireYearsBySavings(returnRate, withdrawalRate, savingsRate) {
	const returnFloat = returnRate / 100;
	const savingsFloat = savingsRate / 100;
	const withdrawalFloat = withdrawalRate / 100;
	return (
		Math.log(1 + (returnFloat * ((1 - savingsFloat) / withdrawalFloat)) / savingsFloat) / //
		Math.log(1 + returnFloat)
	);
}
export function calcRetireYears(returnRate, fireTarget, annualSavings, principle) {
	const returnFloat = returnRate / 100;
	return (
		(1 / Math.log(1 + returnFloat)) *
		(Math.log(annualSavings + fireTarget * returnFloat) - //
			Math.log(annualSavings + principle * returnFloat))
	);
}

export function principleAccum(rateFloat, years) {
	// A = P(1 + r/n)^(nt)
	return (1 + rateFloat / 12) ** (12 * years);
}
export function futureValueOfSeries(rateFloat, years) {
	// A = C((1 + r/n)^(nt) - 1) / (r/n)
	return ((1 + rateFloat / 12) ** (12 * years) - 1) / (rateFloat / 12) / 12;
}

export function convertToAnnual(amount, oldFormat, hours = 40) {
	if (oldFormat === 'annual' || oldFormat === 'once') {
		return amount;
	} else if (oldFormat === 'monthly') {
		return amount * 12;
	} else if (oldFormat === 'weekly') {
		return amount * 52;
	} else if (oldFormat === 'daily') {
		return amount * 365;
	} else if (oldFormat === 'hourly') {
		return amount * (52 * hours);
	}
	return 0;
}
export function convertToInterval(annualAmount, newFormat, hours = 40) {
	if (newFormat === 'annual' || newFormat === 'once') {
		return annualAmount;
	} else if (newFormat === 'monthly') {
		return annualAmount / 12;
	} else if (newFormat === 'weekly') {
		return annualAmount / 52;
	} else if (newFormat === 'daily') {
		return annualAmount / 365;
	} else if (newFormat === 'hourly') {
		return annualAmount / (52 * hours);
	}
	return 0;
}

export function round(amount, decimals = 2) {
	const m = 10 ** decimals;
	return Math.round(amount * m) / m;
}
