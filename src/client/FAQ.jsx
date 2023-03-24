import React from 'react';
import PropTypes from 'prop-types';
import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';
import { FaCanadianMapleLeaf, FaExternalLinkAlt } from 'react-icons/fa';

import { useLocalStorage } from './hooks';
import { useGlobalContext } from './AppContainer';
import classNames from 'class-names';

FAQ.propTypes = {
	income: PropTypes.number,
};
export default function FAQ({ income }) {
	const defaultExpanded = location.hash.length > 1;
	const [expanded, setExpanded] = useLocalStorage('faqExpanded', defaultExpanded);
	const { canadian } = useGlobalContext();

	React.useEffect(() => {
		if (defaultExpanded) {
			setExpanded(true);
		}
	}, []);

	const docsRendered = (
		<div style={{ maxWidth: '60em' }} className="mb-4">
			<div className="subtitle is-5 mb-1">
				<a id="calculator-docs" href="#calculator-docs">
					Calculator Usage
				</a>
			</div>
			<p className="mb-2">
				This interactive calculator lets you play with the inputs and help you understand how{' '}
				<i>savings rate</i> and <i>retirement spending</i> strongly determine how long it will take you to save
				up for retirement.
			</p>
			<p className="mb-2">
				When your annual return on investments cover 100% of your expenses, you are Financially Independent. You
				can then consider Retiring Early (FIRE), taking more risks at work (aka &apos;having F.U. money&apos;),
				reducing hours, changing to a less-profitable but fun job/hobby, gardening, studying philosophy...
			</p>
			<p className="mb-2">
				All calculations are done on a real basis, i.e. it uses current dollars, which accounts for (but does
				not show) inflation going forward. Hover over inputs to display clarifying tips.
			</p>
			<p className="mb-2">
				<strong>Reocurring Charges</strong> feel small and that can be deceiving. The total price you pay
				includes not just the sticker price but also the opportunity cost: the income you could have earned from
				investing that money. You should also consider how much it will cost to maintain these expenses after
				retirement.{' '}
				<a href="https://www.mrmoneymustache.com/2018/04/10/hacking-hedonic-adaptation/">Hedonic Adaptation</a>{' '}
				means increasing consumption rarely increases happiness longterm, and similarly lowering consumption can
				be done without reducing happiness.
			</p>
			<div className="mb-2">
				<strong>Investments</strong> can come in many forms (stocks, ETFs, real estate rentals, etc), but a
				great place to start is a low-fee, broad market index fund, such as{' '}
				{canadian
					? 'VGRO (20% bonds, 80% stocks, diversified across Canada/US/Europe/Asia) or VEQT (100% stocks)'
					: 'VT (diversified across all US and Global stocks, in all industries)'}{' '}
				. <i>Picking stocks</i> is a job in of itself, and a gamble the majority of players statistically lose
				at. The entire market however, has reliably (eventually) always gone up, averaging 8.1%/y for 150 years.
				<p className="mt-4">
					<div className="subtitle is-5 mb-1">
						<a id="how-do-invest" href="#how-do-invest">
							How do I invest?
						</a>
					</div>
				</p>
				<ol className="pl-4">
					<li>
						A{' '}
						<strong>
							<a id="robo-advisor" href="#robo-advisor">
								Robo Advisor
							</a>
						</strong>
						, such as{' '}
						{canadian ? (
							<ExternalLink href="https://wealthsimple.com/invite/7GKP7A">
								Wealthsimple Invest
							</ExternalLink>
						) : (
							<ExternalLink href="https://www.betterment.com">Betterment</ExternalLink>
						)}{' '}
						is the most hands-off, &apos;idiot-proof&apos; approach. Functionally similar to buying Whole
						Market ETFs, but easier, nicer UI (great auto-deposit), nice support, at a higher fee
						(0.5-0.7%).
						<br />
						Start here!
					</li>
					<li>
						<strong>
							<a id="etfs" href="#etfs">
								Whole Market Index ETFs
							</a>
						</strong>
						: let you buy a fraction of every company in a market (ie. the US, Canada, International), under
						the principle that the market overall always goes up, and that losers will be offset by winners.{' '}
						{canadian
							? '0.1-0.22% fees. eg. VEQT (100% stocks), VGRO (80% stocks, 20% bonds).'
							: '0.08% fees. eg. VT'}
						<br />
						Can be bought on any stock exchange, such as{' '}
						{canadian ? (
							<ExternalLink href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG">
								Wealthsimple Trade
							</ExternalLink>
						) : (
							<ExternalLink href="https://robinhood.com/">Robinhood</ExternalLink>
						)}
						.
					</li>
					<li>
						<strong>Sector Specific Index ETFs</strong>: let you buy a fraction of every company in... Tech!
						or... AI! or... Weed! Compared with Whole Market ETFs, its kinda like gambling &apos;I bet Weed
						stocks will grow more overall than the average company&apos;. That was a good bet for Weed (for
						example) in 2016-2017, but its lost significantly since then. (eg. ROBO, HMMJ)
						<br />
						Can be bought on any stock exchange, such as{' '}
						{canadian ? (
							<ExternalLink href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG">
								Wealthsimple Trade
							</ExternalLink>
						) : (
							<ExternalLink href="https://robinhood.com/">Robinhood</ExternalLink>
						)}
						.
					</li>
					<li>
						<strong>Individual stocks</strong> <small>(Apple, Amazon, Fortis, etc)</small>: generally
						considered to be gambling unless (or even if) you&apos;re prepared to do lots of research and
						make stock picking a day job.
						<br />
						{canadian &&
							"Can be bought on WST, but for non-Canadian stocks, you'll have lower fees on an exchange with USD accounts, such as Questrade."}
					</li>
					<li>
						<strike>
							<strong>Mutual Funds</strong>
						</strike>
						: Roboadvisors for Boomers. Much higher fees, similar ease of use, but by introducing expensive
						&apos;portfolio managers&apos; they have statistically worse returns.
					</li>
					<li>
						{canadian ? (
							<ExternalLink href="https://www.highinterestsavings.ca/chart/">
								<strong>HISA</strong> <small>(High Interest Savings Account)</small>
							</ExternalLink>
						) : (
							<>
								<strong>HISA</strong> <small>(High Interest Savings Account)</small>
							</>
						)}
						: Banks/Credit Unions offer varying interest, usually below inflation, but its better than 0%
						(and can&apos;t lose money), so probably good for an Emergency Fund.{' '}
						{canadian && (
							<>
								<ExternalLink href="https://join.eqbank.ca?code=BENJAMIN6904">EQ Bank</ExternalLink> is
								often the highest.
							</>
						)}
					</li>
					{canadian && (
						<li>
							<strong>Cash ETFs</strong>: An ETF that deposits into major Canadian Bank savings accounts
							at higher (institutional) interest rates, while theoretically being zero risk. These
							won&apos;t outpace inflation in the long term (as stocks will), but earns more than a
							personal HISA would, at the cost of having to wait a few days for withdrawls to process.
							(eg. <a href="https://finance.yahoo.com/quote/CASH.TO/">CASH.TO</a>)
						</li>
					)}
				</ol>
			</div>

			<div className={classNames('mb-2', !canadian && 'hidden')}>
				<p className="mt-4">
					<div className="subtitle is-5 mb-1">
						<a id="account-type" href="#account-type">
							What Account Type do I invest with? <FaCanadianMapleLeaf />
						</a>
					</div>
					When you open an investment account, you pick a Type, which affects how you get taxed on any gains
					(interest, dividends, and capital gains from the share price going up). They&apos;re kinda
					&apos;Money Folders&apos; (like a Paypal/Steam wallet balance), you can deposit money into (to a
					limit), and then decide what to buy with them (stocks, ETFs, etc). Selling keeps the money in that
					account until you Withdraw (to your normal bank account), which may have restrictions. All these
					tax-advantaged account types charge no income taxes on gains inside, which helps compound interest
					grow significantly.
				</p>
				<ol className="pl-4">
					<li>
						<strong>
							<a id="rrsp" href="#rrsp">
								RRSP
							</a>
						</strong>{' '}
						<small>(Retirement Savings Plan)</small>: uses pre-tax dollars{' '}
						<small>
							(ie. you get a tax refund for contributions; it effectively lowers your taxed income).
						</small>
						You have to pay income tax on whatever you withdraw, so if you wait until a year when you have
						no/low other income (eg. retirement, gap year), you can benefit from the difference between
						&lt;what tax you would&apos;ve paid when young&gt; - &lt;lower tax rate when withdrawing&gt;.
						<br />
						You can also withdraw $20,000 tax-free to pay for your own education (
						<ExternalLink href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/lifelong-learning-plan.html">
							Lifelong Learning Plan
						</ExternalLink>
						), and you can withdraw $35,000 to pay for your first house (
						<ExternalLink href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html">
							Home Buyers Plan
						</ExternalLink>
						); <small>these are tax-free withdrawals, which you then slowly repay over 10-15 years</small>.
						Other than those two, your money is ideally locked away until you retire, to maximize growth and
						minimize withdrawl tax.
						<br />
						Contribution Room (the max you can deposit) increases by (Income * 0.18 = ${income * 0.18})
						every year, unused room accumulates, but withdrawals cannot be recontributed (you don&apos;t get
						room back).
						{income >= 75000 && (
							<p className="has-text-success">
								With a high income, start lowering taxes with an RRSP, then TFSA!
							</p>
						)}
					</li>
					<li>
						<strong>
							<a id="tfsa" href="#tfsa">
								TFSA
							</a>
						</strong>{' '}
						<small>(Tax-Free Savings Account)</small>: uses after-tax dollars, withdraw anytime without
						penalty! Very flexible.
						<br />
						<ExternalLink href="https://personalfinancecanada.ca/calculators/tfsa-contribution-room/">
							Contribution Room
						</ExternalLink>{' '}
						(the max you can deposit) accumulates by ~5,500 every year (so a 25 year old who hasn&apos;t
						made deposits has ~50,000 room), deposits use up that room, growth (eg. dividends, stock prices
						going up) inside the TFSA don&apos;t affect that room (so your TFSA balance is likely to end up
						higher than your contribution room!), and withdrawals return contribution room on the next Jan
						1st. Thus, its easier (no tax, can return/undo fairly soon) to withdraw from a TFSA when needed,
						than to access an RRSP or other investment accounts.
						{income < 75000 && (
							<p className="has-text-success">
								With a low income, start with a general purpose TFSA, then RRSP!
							</p>
						)}
					</li>
					<li>
						<strong>RESP</strong> <small>(Education Savings Plan)</small>: like an RRSP, but for your
						child&apos;s education. Government grants augment your contributions.
					</li>
					<li>
						<strong>Non-registered account</strong> <small>(other)</small>: no tax free magic at all,
						you&apos;ll pay income tax on any earnings, but completely flexible. &quot;Capital Gains&quot;
						(ie. the stock&apos;s price went up and you sold, Gaining the difference between Purchase and
						Sale price) are taxed less than normal income (approx half)
					</li>
				</ol>
			</div>

			<div className={classNames('mb-2')}>
				<div className="subtitle is-5 mt-3 mb-1">
					<a id="eli5" href="#eli5">
						Savings Rate Intro
					</a>
				</div>
				<div>
					<div>
						<i>
							<a href="https://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/">
								As soon as you start saving and investing your money, it starts earning money all by
								itself.
							</a>
						</i>
					</div>
					Thus, your time to reach retirement depends on only one factor: <br />
					<i>Your savings rate, as a percentage of your take-home pay.</i>
					<br />
					Savings Rate = How much you take home each year / How much you can live on
					<br />
					Savings Rate = After Tax Income / Expenses
					<br />
					<img className="mt-1" src="/fire_table_5_4.jpg" />
					<h5 className="subtitle is-5 mt-2 mb-1">Example:</h5>
					<div>BC Minimum Wage ($15.65) x 40h = $32552 (before tax) per year.</div>
					<div>
						<a href="https://www.wealthsimple.com/en-ca/tool/tax-calculator/british-columbia">After tax</a>{' '}
						(fully utilizing RRSP contributions) = $28387 net, or $2365/m.
					</div>
					<div>
						Assuming $1200 in rent/utilities, + $600 food/transit/phone/etc, thats $1800 in expenses, which
						is a{' '}
						<a href="/?expenses=21600&income=28387">
							<strong>24%</strong> savings rate, or being FI after 33 years (eg. age 51)
						</a>
						.
					</div>
					<div className="mt-2">
						Getting a raise, or decreasing expenses, can cut years off this target:
						<ul className="pl-4">
							<li>
								- Minimum Wage but dropping to $600 rent ={' '}
								<a href="/?expenses=14400&income=28387">
									<strong>49%</strong> savings rate = FI after 17 years.
								</a>
							</li>
							<li>
								- or instead getting a job paying $21/h (44k salary) with $1800 expenses ={' '}
								<a href="/?expenses=21600&income=37037">
									<strong>42%</strong> savings rate = FI after 21 years.
								</a>
							</li>
							<li>
								- or both (41k salary, $1200 expenses) ={' '}
								<a href="/?expenses=14400&income=37037">
									<strong>61%</strong> savings rate = FI after 12 years.
								</a>
							</li>
						</ul>
					</div>
					<div>
						<div className="subtitle is-6 mt-3 mb-1">
							<a
								id="what-does-living-off-investments-actually-look-like"
								href="#what-does-living-off-investments-actually-look-like"
							>
								What does living off investments actually look like?
							</a>
						</div>
						Every month, you&apos;ll earn some interest/dividends, credited as a balance in your investment
						account (and possibly auto-reinvested). These will likely be less than your full expenses, so
						you&apos;ll additionally sell a tiny portion of your portfolio. You then just withdraw it to
						your regular savings account, like a paycheque, except under your control. At a &quot;safe
						withdrawl rate&quot; of ~4%, the rest of the stocks will continue to gain in value at (in the
						long term) a higher rate than you&apos;re depleting them.
						<br />
						Withdrawls from RRSPs are taxed as income, and selling in taxable (non-registered) accounts will
						incur Capital Gains tax, though if you aren&apos;t working, and are only withdrawing enough for
						low expenses, you&apos;ll pay low or possibly zero tax.
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<Accordion
			allowZeroExpanded={true}
			preExpanded={expanded ? ['faq'] : []}
			onChange={() => {
				setExpanded((s) => !s);
			}}
		>
			<AccordionItem uuid="faq">
				<AccordionItemHeading>
					<AccordionItemButton className="accordion__button is-underlined">Documentation</AccordionItemButton>
				</AccordionItemHeading>
				<AccordionItemPanel>{docsRendered}</AccordionItemPanel>
			</AccordionItem>
		</Accordion>
	);
}

ExternalLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.node,
};
function ExternalLink({ href, children }) {
	return (
		<a href={href} target="_blank" rel="noreferrer">
			{children} <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
		</a>
	);
}
