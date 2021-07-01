import React from 'react';
import { 
  // Grid,
  Card,
  // Avatar
} from '@material-ui/core';

const dinamicBG = (score) => {
  if (score < 7) return 'bg-danger';
  if (score < 8) return 'bg-warning';
  return 'bg-light';
};

const StatCard = ({
  score, imageUrl, label, className,
}) => (
  <Card elevation={3} className={`p-3 flex-column justify-center items-center ${className}`}>
    <h3
      className={`mt-1 text-32 ${dinamicBG(score)}`}
    >
      {score.toLocaleString()}
      /10
    </h3>
    <p className="m-0 text-muted">{label}</p>
  </Card>
);

export default StatCard;
