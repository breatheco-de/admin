import React, { useState, useEffect } from 'react';
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
import { AsyncAutocomplete } from '../../components/Autocomplete';
import axios from '../../../axios';
import { useQuery } from '../../hooks/useQuery';

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
  const query = useQuery();
  const [items, setItems] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const resendInvite = (user) => {
    bc.auth()
      .resendInvite(user)
      .then(({ data }) => console.log(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    let slugs = query.get('cohort');
    if(slugs) {
      const cohortSlugs = slugs.split(',').map((c) => {
        return { slug: c }
      });
      setCohorts(cohortSlugs);
    }
  }, []);

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const { user, ...rest } = items[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {user !== null ? name(user) : `${rest.first_name} ${rest.last_name}`}
                </h5>
                <small className="text-muted">{user?.email || rest.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'created_at',
      label: 'Created At',
      options: {
        filter: false,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items[i].created_at).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
              {'  '}
              {dayjs().isBefore(dayjs(items[i].created_at).add(30, 'minutes')) &&
                <Tooltip title="Created less than 30 minutes ago">
                  <small className="text-muted text-secondary">RECENT</small>
                </Tooltip>
              }
            </div>
          </div>
        ),
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px${statusColors[item.status]}`}>
                  {item.status.toUpperCase()}
                </small>
                {item.status === 'INVITED' && (
                  <small className="text-muted d-block">Needs to accept invite</small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex].user !== null
            ? items[dataIndex]
            : {
              ...items[dataIndex],
              user: {
                first_name: '',
                last_name: '',
                imgUrl: '',
                id: '',
              },
            };
          return item.status === 'INVITED' ? (
            <div className="flex items-center">
              <div className="flex-grow" />
              <InviteDetails getter={() => bc.auth().getMemberInvite(item.id)} />
              <Tooltip title="Resend Invite">
                <IconButton onClick={() => resendInvite(item.id)}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/admissions/students/${item.user.id}`}>
                <Tooltip title="Edit">
                  <IconButton>
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          );
        },
      },
    },
    {
      // This column is to display the filter
      name: 'cohort',
      label: 'cohort',
      options: {
        filter: true,
        filterType: 'custom',
        filterList: query.get('cohort') !== null ? [query.get('cohort')] : [],
        display: false,
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div style={{ width: '150px' }}>
                <AsyncAutocomplete
                  onChange={(newCohort) => {
                    setCohorts(newCohort);
                    console.log('newCohort');
                    console.log(newCohort);
                    const slugs = newCohort.map((i) => i.slug).join(',');
                    if (slugs !== '') filterList[index][0] = slugs;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                    console.log('filterList');
                    console.log(filterList);
                  }}
                  value={cohorts}
                  // name="cohort"
                  // width="30%"
                  size="small"
                  label="Cohort"
                  debounced
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.slug}`}
                  multiple={true}
                  asyncSearch={(searchTerm) => axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort?like${searchTerm}`)}
                />
              </div>
            );
          }
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Admissions', path: '/' }, { name: 'Students' }]} />
          </div>

          <div className="">
            <Link to="/admissions/students/new">
              <Button variant="contained" color="primary">
                Add new student
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Students"
          columns={columns}
          items={items}
          options={{
            print: false,
            viewColumns: false,
            onFilterChipClose: (index, removedFilter, filterList) => {
              setCohorts([]);
            },
          }}
          view="student?"
          historyReplace="/admissions/students"
          singlePage=""
          // options={{
          //   customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
          //     <AddBulkToCohort
          //       selectedRows={selectedRows}
          //       displayData={displayData}
          //       setSelectedRows={setSelectedRows}
          //       items={items}
          //     />
          //   ),
          // }}
          bulkActions={(props) => (
            <AddBulkToCohort
              items={items}
              {...props}
            />
          )}
          search={async (querys) => {
            const { data } = await bc.auth().getAcademyStudents(querys);
            setItems(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc.admissions().deleteStudentBulk(querys);
            return status;
          }}
        />
      </div>
    </div>
  );
};

export default Students;
