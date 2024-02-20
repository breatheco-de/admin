import React from 'react';
import { Card, IconButton, Icon } from '@material-ui/core';
import Chart from 'react-apexcharts';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  icon: {
    position: 'absolute',
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 18px)',
  },
}));

const GaugeProgressCard = ({ series, valueOptions, bottomMessage, height }) => {
  const classes = useStyles();
  const theme = useTheme();
  const options = {
    chart: {
      // offsetX: 60,
      // offsetY: -20,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        offsetY: 0,
        hollow: {
          margin: 0,
          size: '68%',
        },
        dataLabels: {
          showOn: 'always',
          name: {
            show: false,
          },
          value: {
            color: theme.palette.text.primary,
            fontSize: '24px',
            fontWeight: '600',
            // offsetY: -40,
            offsetY: 38,
            show: true,
            formatter: (val) => `${val * 10}K`,
            ...valueOptions,
          },
        },
        track: {
          background: '#eee',
          strokeWidth: '100%',
        },
      },
    },
    colors: [theme.palette.primary.main, '#eee'],
    stroke: {
      lineCap: 'round',
    },
    responsive: [
      {
        breakpoint: 767,
        options: {
          chart: {
            offsetX: 0,
            offsetY: 0,
          },
        },
      },
    ],
  };

  return (
    <Card elevation={3} className={`h-${height}`}>
      <div className=" px-4 py-3 mb-6 flex justify-between items-center bg-light-gray">
        <span className="font-medium text-muted">STATISTICS</span>
        {/* <IconButton size="small">
          <Icon>more_horiz</Icon>
        </IconButton> */}
      </div>
      <div className="relative">
        <Chart options={options} series={series} type="radialBar" height={200} />
        <Icon className={clsx('text-muted text-36', classes.icon)}>people</Icon>
      </div>
      <h5 className="text-center font-medium mb-4">{bottomMessage}</h5>
      {/* <p className="m-0 text-muted text-center">Close to reach 1000k folowers!</p> */}
    </Card>
  );
};

GaugeProgressCard.propTypes = {
  series: PropTypes.array,
  valueOptions: PropTypes.object,
  bottomMessage: PropTypes.string,
  height: PropTypes.string,
};
GaugeProgressCard.defaultProps = {
  series: [84.2],
  valueOptions: {},
  bottomMessage: '',
  height: 'full',
};

export default GaugeProgressCard;
