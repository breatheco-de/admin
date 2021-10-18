import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Icon, IconButton, Button, Chip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import { useQuery } from '../../hooks/useQuery';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  INACTIVE: 'gray',
  PREWORK: 'main',
  STARTED: 'primary',
  FINAL_PROJECT: 'error',
  ENDED: 'dark',
  DELETED: 'gray',
};

const Cohorts = () => {
  const [items, setItems] = useState([]);
  const query = useQuery();

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
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
                  <h5 className="my-0 text-15">{item?.name} </h5>
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
        customBodyRenderLite: (i) => items[i]?.specialty_mode?.name,
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
            <Link to={`/admissions/cohorts/${items[dataIndex].slug}`}>
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
      <div>
        <SmartMUIDataTable
          title="All Cohorts"
          columns={columns}
          items={items}
          view="cohorts?"
          historyReplace="/admissions/cohorts"
          singlePage=""
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
