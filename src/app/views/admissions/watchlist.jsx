import React, { useState } from 'react';
import {
  Avatar, Icon, IconButton, Button, Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Breadcrumb } from '../../../matx';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import InviteDetails from '../../components/InviteDetails';
import bc from '../../services/breathecode';
import AddBulkToCohort from './student-form/student-utils/AddBulkToCohort';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Students = () => {
  const [cohortStudents, setCohortStudents] = useState([]);
  const [count, setCount] = useState('');
  const [queryFilters, setQueryFilters] = useState({});

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex) => {
          const { user, ...rest } = cohortStudents[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.profile?.avatar_url} />
              <div className="ml-3">
                <Link to={`/admissions/students/${user.id}`}>
                  <h5 className="my-0 text-15">
                    {name(user)}
                  </h5>
                </Link>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'cohort',
      label: 'Cohort',
      options: {
        filter: true,
        sortThirdClickReset: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <Link to={`/admissions/cohorts/${cohortStudents[i].cohort.slug}`}>
                <h5 className="my-0 text-15">{cohortStudents[i].cohort.name}</h5>
              </Link>
              <small className="text-muted">Started {dayjs(cohortStudents[i].cohort.kickoff_date).fromNow()}</small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const { cohort, user, watching } = cohortStudents[dataIndex];
          return <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/dashboard/student/${user.id}/cohort/${cohort.id}`}>
                <Tooltip title="Student<>Cohort Report">
                  <IconButton>
                    <Icon fontSize="small">assignment_ind</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title={watching ? "This student is being watched, click to remove it" : "Add this student to the watchlist"}>
                <IconButton
                  onClick={() => {
                    bc.admissions()
                      .updateCohortUserInfo(cohort.id, user.id, {
                        watching: false,
                      })
                      .then((data) => {
                        if (data.status === 200) setCohortStudents(cohortStudents.map(cs => {
                          if(cs.cohort.id === cohort.id && cs.user.id === user.id) cs.watching = !cs.watching;
                          return cs;
                        }));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  {watching ? <Icon fontSize="small" color="secondary">visibility</Icon> : <Icon fontSize="small">visibility_off</Icon>}
                </IconButton>
              </Tooltip>
            </div>
        }
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Admissions', path: '/' }, { name: 'Wachlist' }]} />
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title={`${count} Students on the watch list`}
          columns={columns}
          items={cohortStudents}
          view="watchlist?"
          historyReplace="/admissions/watchlist"
          singlePage=""
          search={async (query) => {
            const { data } = await bc.admissions().getAllUserCohorts({ ...query, watching: true });
            setCohortStudents(data.results);
            setCount(data.count)
            return data;
          }}
          options={{
            print: false,
            viewColumns: false,
            customToolbar: null
          }}
        />
      </div>
    </div>
  );
};

export default Students;
