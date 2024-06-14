import React from 'react';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';

ExternalLink.propTypes = {
	href: PropTypes.string.isRequired,
	className: PropTypes.string,
	children: PropTypes.node,
	noIcon: PropTypes.bool,
};
export default function ExternalLink({ href, className, children, noIcon = false }) {
	return (
		<a href={href} target="_blank" rel="noreferrer" className={className}>
			{children} {!noIcon && <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />}
		</a>
	);
}
