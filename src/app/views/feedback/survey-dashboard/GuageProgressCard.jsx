import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from '@material-ui/core';
import Chart from 'react-apexcharts';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  icon: {
    position: 'absolute',
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 18px)',
  },
}));

const feedback = {
  0: 'This average score is unacceptable, meet with each student and let\'s turn it around ASAP.',
  7: 'We need to work harder to improve this, some of your students are not feeling it.',
  8: 'This cohort has 8/10 score. Not bad, but it can be improved.',
  9: 'Excellent! Students love this cohort, make sure to keep the formula going on.',
  10: 'We are really impressed, hitting 10/10 is an amazing achievement and you should be proud of yourself',
};

const GaugeProgressCard = ({ score }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [color, setColor] = useState(theme.palette.text.primary);
  const options = {
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
            color,
            fontSize: '24px',
            fontWeight: '600',
            offsetY: 38,
            show: true,
            formatter: (val, opt) => `${val / 10}/10`,
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

  useEffect(() => {
    let newColor;
    if (score < 7) newColor = theme.palette.text.error;
    else if (score < 8) newColor = theme.palette.warning;
    else newColor = theme.palette.text.primary;
    setColor(newColor);
  }, [score]);

  return (
    <Card elevation={3} className="mb-3 p-3">
      <div className="relative">
        <Chart options={options} series={[Math.floor(score * 10)]} type="radialBar" height={200} />
        <Icon className={clsx('text-muted text-36', classes.icon)}>
          {score > 8 ? 'mood' : 'mood_bad'}
        </Icon>
      </div>
      <p className="m-0 text-muted text-center">{feedback[score]}</p>
    </Card>
  );
};

GaugeProgressCard.propTypes = {
  score: PropTypes.number,
};

export default GaugeProgressCard;
