
export function calcFireTarget(annualExpenses, withdrawalRate) {
	const withdrawalFloat = withdrawalRate / 100;
	return annualExpenses / withdrawalFloat;
}
export function calcRetireYearsBySavings(returnRate, withdrawalRate, savingsRate) {
	const returnFloat = returnRate / 100;
	const savingsFloat = savingsRate / 100;
	const withdrawalFloat = withdrawalRate / 100;
	return (
		Math.log(
			1 +
				(returnFloat * ((1 - savingsFloat) / withdrawalFloat)) /
					savingsFloat,
		) / Math.log(1 + returnFloat)
	);
}
export function calcRetireYears(returnRate, fireTarget, annualSavings) {
	const returnFloat = returnRate / 100;
	return (
		Math.log(
			1 +
				(returnFloat * fireTarget) / annualSavings,
		) / Math.log(1 + returnFloat)
	);
}

export function convertToAnnual(amount, oldFormat, hours = 40) {
	if (oldFormat === 'annual') {
		return amount;
	} else if (oldFormat === 'monthly') {
		return amount * 12;
	} else if (oldFormat === 'daily') {
		return amount * 365;
	} else if (oldFormat === 'hourly') {
		return amount * (52 * hours);
	}
}
export function convertToInterval(annualAmount, newFormat, hours = 40) {
	if (newFormat === 'annual') {
		return annualAmount;
	} else if (newFormat === 'monthly') {
		return annualAmount / 12;
	} else if (newFormat === 'daily') {
		return annualAmount / 365;
	} else if (newFormat === 'hourly') {
		return annualAmount / (52 * hours);
	}
}

export function round(amount, decimals = 2) {
	const m = 10 ** decimals;
	return Math.round(amount * m) / m;
}