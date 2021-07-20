import React from 'react';
import {
  Icon, Button, Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Breadcrumb } from '../../../../matx';
import StatCard from './StatCard';
import Answers from './Answers';
import GaugeProgressCard from './GuageProgressCard';
import DowndownMenu from '../../../components/DropdownMenu';

const results = [
  {
    score: 9,
    title: 'Cohort Score',
  },
  {
    score: 6,
    title: 'Academy Score',
  },
  {
    score: 7,
    imageUrl: '/assets/images/face-4.jpg',
    title: 'Ernesto Milano',
  },
  {
    score: 8,
    imageUrl: '/assets/images/face-3.jpg',
    title: 'Edian Beltran',
  },
];

const options = [
  { label: 'Copy survey public link', value: 'public_link' },
  { label: 'Change survey status', value: 'status' },
];

const Analytics2 = () => (
  <div className="analytics m-sm-30">
    <div className="mb-3">
      <Breadcrumb
        routeSegments={[
          { name: 'Feedback', path: '/feedback/surveys' },
          { name: 'Survey List', path: '/feedback/surveys' },
          { name: 'Single Survey' },
        ]}
      />
    </div>
    <div className="flex flex-wrap justify-between mb-6">
      <div>
        <h3 className="mt-0 mb-4 font-medium text-28">Survey #23</h3>
        <div className="flex">
          <div
            className="px-3 text-11 py-3px border-radius-4 text-white bg-green"
            style={{ cursor: 'pointer' }}
          >
            PENDING
          </div>
          <div className="px-3 text-11 py-3px border-radius-4 " style={{ cursor: 'pointer' }}>
            Cohort: Full Stack PT 23
          </div>
        </div>
      </div>
      <DowndownMenu options={options} icon="more_horiz">
        <Button>
          <Icon>playlist_add</Icon>
          Additional Actions
        </Button>
      </DowndownMenu>
    </div>
    <Grid container spacing={2}>
      <Grid item md={4} xs={12}>
        <Alert severity="warning" className="mb-3">
          <AlertTitle className="m-auto">This survey expires in 10 hours</AlertTitle>
        </Alert>
        <GaugeProgressCard />
        <Grid container spacing={2}>
          {results.map((r) => (
            <Grid key={r.title} item sm={6} xs={12}>
              <StatCard label={r.title} score={r.score} imageUrl={r.imageUrl} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item md={8} xs={12}>
        <Answers />
      </Grid>
    </Grid>
  </div>
);

export default Analytics2;
