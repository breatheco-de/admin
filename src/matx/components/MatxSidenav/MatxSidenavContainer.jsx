import React from 'react';
import PropTypes from 'prop-types';

const MatxSidenavContainer = ({ children }) => <div className="relative flex h-full">{children}</div>;

MatxSidenavContainer.defaultProps = {
  children: {},
};
MatxSidenavContainer.propTypes = {
  children: PropTypes.node,
};

export default MatxSidenavContainer;
