/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { Fragment, useState, useEffect } from 'react';
import {
  Grid, Card, TextField, Button,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import DoughnutChart from '../charts/echarts/Doughnut';
import ModifiedAreaChart from './shared/ModifiedAreaChart';
import StatCards from './shared/StatCards';
import { getSession } from '../../redux/actions/SessionActions';
import BC from '../../services/breathecode';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  button: {
    marginLeft: '1rem',
    padding: '0rem',
  },
}));

const Analytics = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [params, setParams] = useState({
    start: dayjs().subtract(30, 'day'),
    end: dayjs(),
    delta: 30,
  });
  const [leads, setLeads] = useState({
    series: [34, 45, 31, 45, 31, 43, 26, 43, 31, 45, 33, 40],
    xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    total: 123,
    max: 60,
    min: 0,
  });
  const [checkins, setCheckins] = useState([]);
  const [admissionsReport, setAdmissionsReport] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [donutLeads, setDonutLeads] = useState({
    data: [
      {
        value: 65,
        name: 'Google',
      },
      {
        value: 20,
        name: 'Facebook',
      },
      { value: 15, name: 'Others' },
    ],
  });
  const [renderNewDates, setRenderNewDates] = useState(false);

  useEffect(() => {
    const session = getSession();
    const { academy } = session;
    if (!academy) return null;

    BC.marketing()
      .getLeads({
        start: params.start.format('YYYY-MM-DD'),
        end: params.end.format('YYYY-MM-DD'),
        academy: academy.slug,
        by: 'location,created_at__date,course',
      })
      .then(({ data }) => {
        // console.log('data', data);
        const series = [];
        const xAxis = [];
        let total = 0;
        let max = 0;
        let min = 0;
        console.log('GET_LEADS BY COURSE', data);
        data.forEach((stamp) => {
          series.push(stamp.total_leads);
          xAxis.push(dayjs(stamp.created_at__date).format('MM-DD'));
          total += stamp.total_leads;
          if (stamp.total_leads > max) max = stamp.total_leads;
          if (stamp.total_leads < min) min = stamp.total_leads;
        });
        setLeads({
          series, xAxis, total, max, min,
        });
      });

    BC.marketing()
      .getLeads({
        start: params.start.format('YYYY-MM-DD'),
        end: params.end.format('YYYY-MM-DD'),
        academy: academy.slug,
        by: 'utm_source',
      })
      .then(({ data }) => {
        console.log('GET_LEADS BY UTM_SOURCE', data);
        const arrData = [];
        data.forEach((stamp) => {
          arrData.push({ name: stamp.utm_source, value: stamp.total_leads });
        });
        setDonutLeads({ data: arrData });
      });

    BC.events()
      .getCheckins({
        start: params.start.format('YYYY-MM-DD'),
        end: params.end.format('YYYY-MM-DD'),
      })
      .then((res) => {
        console.log('GET EVENTS', res);
        if (res !== undefined && res.data !== undefined) {
          setCheckins(res.data);
        } else setCheckins([]);
      });

    BC.feedback()
      .getAnswers({
        status: 'ANSWERED',
      })
      .then(({ data }) => {
        console.log('GET ANSWERS', data);
        setFeedback(data.filter((a) => a.score));
      }).catch((err) => {
        // console.log('DATA:::::::', err);
      });

    BC.admissions().getReport({
      start: params.start.format('YYYY-MM-DD'),
      end: params.end.format('YYYY-MM-DD'),
    })
      .then(({ data }) => {
        console.log('GET REPORT', data);
        setAdmissionsReport(data);
      }).catch((err) => {
        console.log('Admissions Report Error', err);
      });
  }, [renderNewDates]);

  return (
    <>
      <div className="pb-24 pt-7 px-8 bg-primary">
        <div className="card-title capitalize text-white mb-4 mx-5 text-white-secondary ">
          Dashboard ranging from
          <TextField
            className="ml-1"
            name="kickoff_date"
            size="small"
            type="date"
            value={params.start.format('YYYY-MM-DD')}
            onChange={(v) => setParams({ ...params, start: dayjs(v.target.value, 'YYYY-MM-DD') })}
          />
          to
          <TextField
            className="ml-1"
            name="kickoff_date"
            size="small"
            type="date"
            value={params.end.format('YYYY-MM-DD')}
            onChange={(v) => setParams({ ...params, end: dayjs(v.target.value, 'YYYY-MM-DD') })}
          />
          <Button
            color="success"
            variant="contained"
            size="small"
            className={classes.button}
            onClick={() => setRenderNewDates(!renderNewDates)}
          >
            Apply
          </Button>
        </div>
        <ModifiedAreaChart
          height="280px"
          option={{
            yAxis: {
              type: 'value',
              min: 0,
              max: leads.max,
            },
            series: [
              {
                data: leads.series,
                type: 'line',
              },
            ],
            xAxis: {
              data: leads.xAxis,
            },
          }}
        />
      </div>

      <div className="analytics m-sm-30 mt--18">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards
              metrics={[
                { label: 'Total Leads', value: leads.total, icon: 'group' },
                { label: 'Total Reviews', value: 'No reviews yet', icon: 'star' },
                {
                  label: 'Net Promoter Score',
                  icon: 'tag_faces',
                  value:
                    feedback.length === 0
                      ? 'No feedback yet'
                      : feedback.reduce(
                        (total, current) => (
                          current.score
                            ? total + parseInt(current.score, 10)
                            : total),
                        0,
                      ) / feedback.length,
                },
                { label: 'Event Tickets', value: 11, icon: 'group' },
                { label: 'Active Students', value: `${admissionsReport?.students?.active} from ${admissionsReport?.students?.total} total`, icon: 'group' },
                { label: 'Graduates', value: `${admissionsReport?.students?.graduated} with ${admissionsReport?.students?.dropped} drops`, icon: 'group' },
                { label: 'Teachers', value: `${admissionsReport?.teachers?.active.main}`, icon: 'group' },
                { label: 'Assistants', value: `${admissionsReport?.teachers?.active.assistant}`, icon: 'group' },
              ]}
            />

            {/* Top Selling Products */}
            {/* <TopSellingTable /> */}

            {/* <StatCards2 /> */}

            {/* <h4 className="card-title text-muted mb-4">Ongoing Projects</h4> */}
            {/* <RowCards /> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card className="px-6 py-4 mb-6">
              <div className="card-title">Lead Sources</div>
              <DoughnutChart
                height="300px"
                option={{ series: [{ name: 'Lead Sources', data: donutLeads.data }] }}
                color={[
                  theme.palette.primary.dark,
                  theme.palette.primary.main,
                  theme.palette.primary.light,
                ]}
              />
            </Card>

            {/* <UpgradeCard /> */}

            {/* <Campaigns /> */}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Analytics;
