import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { useSelector } from 'react-redux';
import {
  Grow,
  Icon,
  IconButton,
  TextField,
  Button,
  LinearProgress,
  Tooltip,
  Chip,
} from '@material-ui/core';
import bc from '../../services/breathecode';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Breadcrumb, MatxLoading } from '../../../matx';
import { DownloadCsv } from '../../components/DownloadCsv';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  INACTIVE: 'bg-gray',
  PREWORK: 'bg-secondary',
  STARTED: 'text-white bg-warning',
  FINAL_PROJECT: 'text-white bg-error',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const EventList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const { settings } = useSelector(({ layout }) => layout);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    bc.feedback().getSurveys()
      .then(({data}) => {
        setIsLoading(false);
        if (isAlive) setItems(data)
      })
    return () => setIsAlive(false);
  }, [isAlive]);

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: 'cohort', // field name in the row object
      label: 'Cohort', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Link
                  to={`/admissions/cohorts/${item?.cohort?.slug}`}
                  style={{ textDecoration: 'underline' }}
                >
                  <h5 className="my-0 text-15">{item?.cohort?.name}</h5>
                </Link>
                <small className="text-muted">{item?.cohort?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];

          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Chip size="small" label={item?.status} color={stageColors[item?.status]} />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'sent_at',
      label: 'Sent date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items[i].created_at).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'avg_score',
      label: 'Score',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const color = items[i].avg_score > 7
            ? 'text-green'
            : items[i].avg_score < 7
              ? 'text-error'
              : 'text-orange';
          if (items[i].avg_score) {
            return (
              <div className="flex items-center">
                <LinearProgress
                  color="secondary"
                  value={parseInt(items[i].avg_score, 10) * 10}
                  variant="determinate"
                />
                <small className={color}>{items[i].avg_score}</small>
              </div>
            );
          }
          return 'No avg yet';
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: () => (
          <div className="flex items-center">
            <div className="flex-grow" />
            <Tooltip title="Copy survey link">
              <IconButton>
                <Icon>assignment</Icon>
              </IconButton>
            </Tooltip>
            <Link to="/feedback/surveys/1">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Link>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Feedback', path: '/feedback/surveys' },
                { name: 'Survey List' },
              ]}
            />
          </div>

          {settings.beta && (
            <div className="">
              <Link to="/feedback/survey/new" color="primary" className="btn btn-primary">
                <Button variant="contained" color="primary">
                  Add new survey
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title="All Events"
            data={items}
            columns={columns}
            options={{
              customToolbar: () => {
                const singlePageTableCsv = '/v1/feedback/academy/answer';
                const allPagesTableCsv = '/v1/feedback/academy/answer';
                return (
                  <DownloadCsv
                    singlePageTableCsv={singlePageTableCsv}
                    allPagesTableCsv={allPagesTableCsv}
                  />
                );
              },
              download: false,
              filterType: 'textField',
              responsive: 'standard',
              elevation: 0,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customSearchRender: (handleSearch, hideSearch) => (
                <Grow appear in timeout={300}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={({ target: { value } }) => handleSearch(value)}
                    InputProps={{
                      style: {
                        paddingRight: 0,
                      },
                      startAdornment: (
                        <Icon className="mr-2" fontSize="small">
                          search
                        </Icon>
                      ),
                      endAdornment: (
                        <IconButton onClick={hideSearch}>
                          <Icon fontSize="small">clear</Icon>
                        </IconButton>
                      ),
                    }}
                  />
                </Grow>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventList;
