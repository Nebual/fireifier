import React from 'react';
import PropTypes from 'prop-types';
import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { useLocalStorage } from './hooks';

FAQ.propTypes = {
	income: PropTypes.number,
};
export default function FAQ({ income }) {
	const [expanded, setExpanded] = useLocalStorage('faqExpanded', true);

	const docsRendered = (
		<div style={{ maxWidth: '60em' }} className="mb-4">
			<p className="mb-2">
				This interactive calculator lets you play with the inputs and help you understand how{' '}
				<i>savings rate</i> and <i>retirement spending</i> strongly determine how long it will take you to save
				up for retirement.
			</p>
			<p className="mb-2">
				When your annual return on investments cover 100% of your expenses, you are Financially Independent. You
				can then consider Retiring Early (FIRE), taking more risks (aka &apos;having F.U. money&apos;), changing
				to a non-profitable but fun job/hobby, studying poetry...
			</p>
			<p className="mb-2">
				All calculations are done on a real basis, i.e. it uses current dollars, which accounts for (but does
				not show) inflation going forward.
			</p>
			<p className="mb-2">
				<strong>Reocurring Charges</strong> feel small and that can be deceiving. The total price you pay
				includes not just the sticker price but also the opportunity cost: the income you could have earned from
				investing that money. You should also consider how much it will cost you to maintain this expense after
				retirement
			</p>
			<div className="mb-2">
				<strong>Investments</strong> can come in many forms (stocks, ETFs, real estate rentals, etc), but a
				great place to start is a low-fee, broad market index fund, such as VGRO (20% bonds, 80% stocks,
				diversified across Canada/US/Europe/Asia) or VEQT (100% stocks). <i>Picking stocks</i> is a job in of
				itself, and a gamble the majority of players statistically lose at. The entire market however, has
				reliably (eventually) always gone up, averaging 8.1%/y for 150 years.
				<p className="mt-2">
					<div className="subtitle is-5 mb-1">How do I invest?</div>
				</p>
				<ol className="pl-6">
					<li>
						A <strong>Robo Advisor</strong>, such as{' '}
						<ExternalLink href="https://wealthsimple.com/invite/7GKP7A">Wealthsimple Invest</ExternalLink>{' '}
						is the most hands-off, &apos;idiot-proof&apos; approach. Functionally similar to buying Whole
						Market ETFs, but easier, nicer UI (great auto-deposit), nice support, at a higher fee
						(0.5-0.7%). Start here!
					</li>
					<li>
						<strong>Whole Market Index ETFs</strong>: let you buy a fraction of every company in a market
						(ie. the US, Canada, International), under the principle that the market overall always goes up,
						and that losers will be offset by winners. 0.1-0.22% fees. eg. VEQT (100% stocks), VGRO (80%
						stocks, 20% bonds).
						<br />
						Can be bought on any stock exchange, such as{' '}
						<ExternalLink href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG">
							Wealthsimple Trade
						</ExternalLink>
						.
					</li>
					<li>
						<strong>Sector Specific Index ETFs</strong>: let you buy a fraction of every company in... Tech!
						or... AI! or... Weed! Compared with Whole Market ETFs, its kinda like gambling &apos;I bet Weed
						stocks will grow more overall than the average company&apos;. That was a good bet for Weed (for
						example) in 2016-2017, but its lost significantly since then. (eg. ROBO, HMMJ)
						<br />
						Can be bought on any stock exchange, such as{' '}
						<ExternalLink href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG">
							Wealthsimple Trade
						</ExternalLink>
						.
					</li>
					<li>
						<strong>Individual stocks</strong> <small>(Apple, Amazon, Fortis, etc)</small>: generally
						considered to be gambling unless (or even if) you&apos;re prepared to do lots of research and
						make stock picking a day job.
						<br />
						Can be bought on WST, but for non-Canadian stocks, you&apos;ll have lower fees on an exchange
						with USD accounts, such as Questrade.
					</li>
					<li>
						<strike>
							<strong>Mutual Funds</strong>
						</strike>
						: Roboadvisors for Boomers. Much higher fees, similar ease of use, statistically worse returns.
					</li>
					<li>
						<ExternalLink href="https://www.highinterestsavings.ca/chart/">
							<strong>HISA</strong> <small>(High Interest Savings Account)</small>
						</ExternalLink>
						: Banks/Credit Unions offer varying interest, usually below inflation, but its better than 0%
						(and can&apos;t lose money), so probably good for an Emergency Fund.{' '}
						<ExternalLink href="https://join.eqbank.ca?code=BENJAMIN6904">EQ Bank</ExternalLink> is often
						the highest.
					</li>
				</ol>
			</div>
			<div className="mb-2">
				<p className="mt-3">
					<div className="subtitle is-5 mb-1">What Account Type do I invest with?</div>
					When you open an investment account, you pick a Type, which affects how you get taxed on any gains.
					They&apos;re kinda Money Folders (like a Paypal/Steam wallet balance), you deposit a chunk into, and
					then decide what to buy with them (stocks, ETFs, etc).
				</p>
				<ol className="pl-6">
					<li>
						<strong>RRSP</strong> <small>(Retirement Savings Plan)</small>: uses pre-tax dollars{' '}
						<small>
							(ie. you get a tax refund for contributions; it effectively lowers your taxed income)
						</small>
						. You have to pay income tax on whatever you withdraw, so if you wait until a year when you have
						no/low other income (eg. retirement, gap year), you can benefit from the difference between
						&lt;what tax you would&apos;ve paid when young&gt; - &lt;lower tax rate when withdrawing&gt;.
						<br />
						You can also withdraw $20,000 tax-free to pay for your own education (Lifelong Learning Plan),
						and you can withdraw $35,000 to pay for your first house (Home Buyers Plan);{' '}
						<small>these are tax-free withdrawals, which you then slowly repay over 10-15 years</small>.
						Other than those two, your money is ideally locked away until you retire.
						<br />
						Contribution Room increases by (Income * 0.18 = ${income * 0.18}) every year, unused room
						accumulates, and withdrawals cannot be recontributed.
						{income >= 75000 && (
							<p className="has-text-success">
								With a high income, start lowering taxes with an RRSP, then TFSA!
							</p>
						)}
					</li>
					<li>
						<strong>TFSA</strong> <small>(Tax-Free Savings Account)</small>: uses after-tax dollars.
						Withdraw anytime, and your get your contribution room back January 1st, so its pretty flexible!
						<br />
						Contribution Room increases by ~5,500 every year - so a 25 year old has ~50,000.
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

function ExternalLink({ href, children }) {
	return (
		<a href={href} target="_blank" rel="noreferrer">
			{children} <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
		</a>
	);
}
