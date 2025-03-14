import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Button, Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Breadcrumb, MatxLoading } from '../../../../matx';
import StatCard from './StatCard';
import Answers from './Answers';
import GaugeProgressCard from './GuageProgressCard';
import DowndownMenu from '../../../components/DropdownMenu';
import { useDispatch, useSelector } from 'react-redux';
import { getSurveyAnswers, getSurvey, getAnswersBy } from '../../../redux/actions/SurveyActions';
import {CopyDialog} from "../../../components/CopyDialog"

const options = [
  { label: 'Copy survey public link', value: 'public_link' },
  { label: 'Change survey status', value: 'status' },
];

const Survey = ({ match }) => {
  const dispatch = useDispatch();
  const {
    answers = [],
    avgCohortScore = 0,
    avgAcademyScore = 0,
    avgLiveClassScore = 0,
    mentors = [],
    answered = [],
    overallScore = 0,
    survey = {},
    isLoading = false,
    filteredAnswers = []
  } = useSelector((state) => state.survey);
  const [filter, setFilter] = useState('answered');

  const [copyDialog, setCopyDialog] = useState(false);

  useEffect(() => {
    dispatch(getSurveyAnswers({ survey: match.params.id }));
    dispatch(getSurvey(match.params.id));

  }, []);

  const sortBy = (event) => {
    const { target: { value } } = event;
    dispatch(getAnswersBy(value));
    setFilter(value);
  }

  const surveyMentors = survey.scores?.mentors || mentors;
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
      {isLoading ? <MatxLoading /> : <><div className="flex flex-wrap justify-between mb-6">
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">Survey #{survey?.id}</h3>
          <div className="flex">
            <div
              className="px-3 text-11 py-3px border-radius-4 text-white bg-green"
              style={{ cursor: 'pointer' }}
            >
              {survey.status}
            </div>
            <div className="px-3 text-11 py-3px border-radius-4 " style={{ cursor: 'pointer' }}>
              Cohort: {match.params.cohort}
            </div>
          </div>
        </div>
        <DowndownMenu options={options} icon="more_horiz"
          onSelect={({ value }) => {
            if(value==="public_link"){
              setCopyDialog(true);
            }
          }}
        >
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>
        {answered && answered.length > 0 ? <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Alert severity="warning" className="mb-3">
              <AlertTitle className="m-auto">{survey && survey.expired < 0 ? `This survey expires ${Math.round(survey.expired/24)*-1} days ago`: `This survey expires in ${survey.expired} hours`}</AlertTitle>
            </Alert>
            <GaugeProgressCard score={survey.scores?.total || overallScore || 0} />
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <StatCard label={'Cohort Score'} score={survey.scores?.cohort || avgCohortScore || 0} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <StatCard label={'Academy Score'} score={survey.scores?.academy || avgAcademyScore || 0} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <StatCard label={'Live CLass Score'} score={survey.scores?.live_class || avgLiveClassScore || 0} />
              </Grid>
              {surveyMentors.map((m) => (
                <Grid key={m.name} item sm={6} xs={12}>
                  <StatCard label={m.name} score={m.score.toFixed(1)} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item md={8} xs={12}>
            <Answers answered={answered} filteredAnswers={filteredAnswers} sortBy={sortBy} filter={filter} mentors={mentors}/>
          </Grid>
        </Grid>:<Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Alert severity="warning" className="mb-3">
              <AlertTitle className="m-auto">{survey && survey.expired < 0 ? `This survey expired ${Math.round(survey.expired/24)*-1} days ago`: `This survey expires in ${survey.expired} hours`}</AlertTitle>
            </Alert>
            <GaugeProgressCard score={0} />
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <StatCard label={'No score yet'} score={0} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <StatCard label={'No score yet'} score={0} />
              </Grid>
              {mentors.map((m) => (
                <Grid key={m.name} item sm={6} xs={12}>
                  <StatCard label={'No score yet'} score={0} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item md={8} xs={12}>
            <Answers 
            answered={answered} 
            filteredAnswers={filteredAnswers} 
            sortBy={sortBy} filter={filter} 
            mentors={mentors}/>
          </Grid>
        </Grid>
        }
      </>
      }
      <CopyDialog
        title={survey.title}
        label={"URL"}
        value={survey.public_url}
        isOpened={copyDialog}
        onClose={() => setCopyDialog(false)}
      />
    </div>
  )
};

Survey.propTypes = {
  match: PropTypes.object
};

export default Survey;