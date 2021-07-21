import React from 'react';
import {
  Grid, Card, IconButton, Icon,
} from '@material-ui/core';

const StudentDetailCard = ({ metrics }) => (
  <Grid container spacing={3}>
    {metrics.map((item, ind) => (
      <Grid key={item.title} item md={6} lg={6} xs={12}>
        <Card elevation={3} className="p-5 flex-column justify-center items-center">
          <div className="mb-6px">
            <IconButton className="p-3 bg-light-gray">
              <Icon className="text-muted">{item.icon}</Icon>
            </IconButton>
          </div>

          <h3 className="mt-1 text-32">{item.value}</h3>
          <p className="m-0 text-muted">{item.title}</p>
        </Card>
      </Grid>
    ))}
  </Grid>
);
export default StudentDetailCard;
