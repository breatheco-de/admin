import React from 'react';
import {
  Grid, Card, IconButton, Icon,
} from '@material-ui/core';

const CohortDetailCards = ({ metrics }) => {
  const makeTeacherCard = (item) => (
    <Grid key={item.title} item md={12} lg={12} xs={12}>
      <Card elevation={3} className="p-5 flex-column justify-center ">
        <div className="mb-6px">
          <IconButton className="p-3 bg-light-gray">
            <Icon className="text-muted">{item.icon}</Icon>
          </IconButton>
        </div>
        {item.value
          && item.value.map((teacher) => (
            <p key={teacher} className="mt-1 text-10">
              {teacher}
            </p>
          ))}
        <p className="m-0 text-muted">{item.title}</p>
      </Card>
    </Grid>
  );
  return (
    <Grid container spacing={3}>
      {metrics.map((item) => (item.title === 'Teachers' && item.title.length > 0 ? (
        makeTeacherCard(item)
      ) : (
        <Grid key={item.title} item md={6} lg={6} xs={12}>
          <Card elevation={3} className="p-5 flex-column justify-center items-center min-h-full">
            <div className="mb-6px">
              <IconButton className="p-3 bg-light-gray">
                <Icon className="text-muted">{item.icon}</Icon>
              </IconButton>
            </div>
            <h3 className="mt-1 text-20">{item.value}</h3>
            <p className="m-0 text-muted">{item.title}</p>
          </Card>
        </Grid>
      )))}
    </Grid>
  );
};
export default CohortDetailCards;
