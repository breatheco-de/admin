import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
// eslint-disable-next-line import/no-useless-path-segments
import { EchartTheme } from '../../../matx';

// eslint-disable-next-line react/prop-types
const EchartCreator = ({ height, option }) => {
  const theme = useTheme();

  echarts.registerTheme('echarts-theme', EchartTheme(theme));

  return (
    <ReactEcharts
      style={{ height, width: '100%' }}
      option={option}
      lazyUpdate
      theme="echarts-theme"
    />
  );
};

EchartCreator.prototype = {
  height: PropTypes.string.isRequired,
  option: PropTypes.object.isRequired,
};

export default EchartCreator;
