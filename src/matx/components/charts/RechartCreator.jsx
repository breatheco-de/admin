import React from 'react';
import { ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const RechartCreator = ({ height = '320px', width = '100%', children }) => (
  <div style={{ height, width }}>
    <ResponsiveContainer>{children}</ResponsiveContainer>
  </div>
);

RechartCreator.defaultProps = {
  height: '',
  width: '',
  children: {},
};
RechartCreator.propTypes = {
  height: String,
  width: String,
  children: PropTypes.node,
};

export default RechartCreator;
