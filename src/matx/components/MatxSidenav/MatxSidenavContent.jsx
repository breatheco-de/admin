import React from 'react';
import PropTypes from 'prop-types';

const MatxSidenavContent = ({ children }) => <div className="relative flex-grow h-full">{children}</div>;

MatxSidenavContent.defaultProps = {
  children: {},
};
MatxSidenavContent.propTypes = {
  children: PropTypes.node,
};

export default MatxSidenavContent;
