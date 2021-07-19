import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Button, Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Breadcrumb } from '../../../../matx';
import StatCard from './StatCard';
import Answers from './Answers';
import GaugeProgressCard from './GuageProgressCard';
import DowndownMenu from '../../../components/DropdownMenu';
import { useDispatch, useSelector } from 'react-redux';
import { getSurveyAnswers, getSurvey } from '../../../redux/actions/SurveyActions';


const options = [
  { label: 'Copy survey public link', value: 'public_link' },
  { label: 'Change survey status', value: 'status' },
];

const Survey = ({match}) => {
  const dispatch = useDispatch();
  const { 
    answers = [], 
    avgCohortScore = 0, 
    mentors = [],
    answered = [], 
    overallScore = 0, 
    survey = {}
   } = useSelector((state) => state.survey);

  useEffect(() => {
    dispatch(getSurveyAnswers({cohort: match.params.cohort}));
    dispatch(getSurvey(match.params.id));
  }, []);

  return (
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
        <h3 className="mt-0 mb-4 font-medium text-28">Survey #{survey?.id}</h3>
        <div className="flex">
          <div
            className="px-3 text-11 py-3px border-radius-4 text-white bg-green"
            style={{ cursor: 'pointer' }}
          >
            PENDING
          </div>
          <div className="px-3 text-11 py-3px border-radius-4 " style={{ cursor: 'pointer' }}>
            Cohort: {match.params.cohort}
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
        <GaugeProgressCard score={overallScore}/>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <StatCard label={'Cohort Score'} score={avgCohortScore}/>
          </Grid>
          <Grid item sm={6} xs={12}>
            <StatCard label={'Academy Score'} score={avgCohortScore}/>
          </Grid>
          {mentors.map((m) => (
            <Grid key={m.name} item sm={6} xs={12}>
              <StatCard label={m.name} score={m.score} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item md={8} xs={12}>
        <Answers answered={answered} answers={answers}/>
      </Grid>
    </Grid>
  </div>
  )
};

Survey.propTypes = {
  match: PropTypes.object
};

export default Survey;
