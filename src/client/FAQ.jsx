import React from 'react';


export default function FAQ() {
	return (
		<div style={{maxWidth: '60em'}} className="mb-4">
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
						<a href="https://wealthsimple.com/invite/7GKP7A" target="_blank" rel="noreferrer">
							Wealthsimple Invest
						</a>{' '}
						is the most hands-off, &apos;idiot-proof&apos; approach. Functionally similar to buying Whole
						Market ETFs, but easier, nicer UI (great auto-deposit), nice support, at a higher fee
						(0.5-0.7%). Start here!
					</li>
					<li>
						<strong>Whole Market Index ETFs</strong> - let you buy a fraction of every company in a market
						(ie. the US, Canada, International), under the principle that the market overall always goes up,
						and that losers will be offset by winners. 0.1-0.22% fees. eg. VEQT (100% stocks), VGRO (80%
						stocks, 20% bonds).
						<br />
						Can be bought on any stock exchange, such as{' '}
						<a
							href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG"
							target="_blank"
							rel="noreferrer"
						>
							Wealthsimple Trade
						</a>
						.
					</li>
					<li>
						<strong>Sector Specific Index ETFs</strong> - let you buy a fraction of every company in...
						Tech! or... AI! or... Weed! Compared with Whole Market ETFs, its kinda like gambling &apos;I bet
						Weed stocks will grow more overall than the average company&apos;. That was a good bet for Weed
						(for example) in 2016-2017, but its lost significantly since then. (eg. ROBO, HMMJ)
						<br />
						Can be bought on any stock exchange, such as{' '}
						<a
							href="https://my.wealthsimple.com/app/public/trade-referral-signup?code=2YIQEG"
							target="_blank"
							rel="noreferrer"
						>
							Wealthsimple Trade
						</a>
						.
					</li>
					<li>
						<strong>Individual stocks</strong> (Apple, Amazon, Fortis, etc) - generally considered to be
						gambling unless (or even if) you&apos;re prepared to do lots of research and make stock picking
						a day job.
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
				</ol>
			</div>
		</div>
	);
}
