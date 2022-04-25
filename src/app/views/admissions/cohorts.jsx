import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Icon, IconButton, Button, Chip, Card, TextField, InputAdornment, Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import { useQuery } from '../../hooks/useQuery';
import { getSession } from '../../redux/actions/SessionActions';
import { toast } from 'react-toastify';

const relativeTime = require('dayjs/plugin/relativeTime');

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

dayjs.extend(relativeTime);

const stageColors = {
  INACTIVE: 'gray',
  PREWORK: 'main',
  STARTED: 'primary',
  ACTIVE: 'primary',
  FINAL_PROJECT: 'error',
  ENDED: 'dark',
  DELETED: 'gray',
};

const Cohorts = () => {
  const session = getSession();

  const [items, setItems] = useState([]);

  const thisURL = `https://breathecode.herokuapp.com/v1/events/ical/cohorts?academy=${session.academy.id}`;
  const query = useQuery();

  const columns = [
    {
      name: 'stage', // field name in the row object
      label: 'Stage', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('stage') !== null ? [query.get('stage')] : [],
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="">
                {dayjs().isAfter(dayjs(item?.ending_date))
                  && !['ENDED', 'DELETED'].includes(item?.stage) ? (
                  <Chip
                    size="small"
                    icon={<Icon fontSize="small">error</Icon>}
                    label="Out of sync"
                    color="secondary"
                  />
                ) : (
                  <Chip size="small" label={item?.stage} color={stageColors[item?.stage]} />
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'slug', // field name in the row object
      label: 'Slug', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('slug') !== null ? [query.get('slug')] : [],
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Link
                  to={`/admissions/cohorts/${item.slug}`}
                  style={{ textDecoration: 'underline' }}
                >
                  <h5 className="my-0 text-15">
                    {item?.name}
                    {' '}
                  </h5>
                </Link>
                <small className="text-muted">{item?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'kickoff_date',
      label: 'Kickoff Date',
      options: {
        filter: true,
        filterList: query.get('kickoff_date') !== null ? [query.get('kickoff_date')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items[i].kickoff_date).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].kickoff_date).fromNow()}</small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'schedule',
      label: 'Schedule',
      options: {
        filter: true,
        filterList: query.get('schedule') !== null ? [query.get('schedule')] : [],
        customBodyRenderLite: (i) => (
          <div>
            <p>{items[i]?.schedule?.name}</p>
            <p>{items[i]?.timezone}</p>
          </div>

        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow" />
            <Link to={`/admissions/cohorts/${items[dataIndex].slug}`} data-cy={`cohort-${items[dataIndex].id}`}>
              <IconButton data-cy={`edit_cohort-${dataIndex}`}>
                <Icon>edit</Icon>
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
              routeSegments={[{ name: 'Admin', path: '/admissions' }, { name: 'Cohorts' }]}
            />
          </div>

          <div className="">
            <Link to="/admissions/cohorts/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary" data-cy="new_cohort_button">
                Add new cohort
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Card className="p-6 mb-5 bg-light-primary box-shadow-none">
        <div className="flex items-center">
          <div style={{ width: '100%' }}>
            <h5 className="mt-0 mb-2 font-medium text-primary">
              Follow the academy cohorts schedule by adding the following link as one of your personal calendars
            </h5>
            <TextField
              fullWidth
              label="Cohort"
              name="cohort"
              size="small"
              type="text"
              variant="outlined"
              value={thisURL}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy link">
                      <Button
                        variant="outlined"
                        color="primary"
                        className="text-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(thisURL);
                          toast.success('Calendar link url copied successfuly', toastOption);
                        }}
                      >
                        Copy
                      </Button>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </Card>
      <div>
        <SmartMUIDataTable
          title="All Cohorts"
          columns={columns}
          items={items}
          view="cohorts?"
          historyReplace="/admissions/cohorts"
          singlePage=""
          tableOptions={{
            print: false,
            viewColumns: false
          }}
          search={async (querys) => {
            const { data } = await bc.admissions().getAllCohorts(querys);
            setItems(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc.admissions().deleteCohortsBulk(querys);
            return status;
          }}
        />
      </div>
    </div>
  );
};

export default Cohorts;
