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
  const [items, setItems] = useState([]);

  const [queryFilters, setQueryFilters] = useState({});

  console.log(items);

  const resendInvite = (user) => {
    bc.auth()
      .resendInvite(user)
      .then(({ data }) => console.log(data))
      .catch((error) => console.error(error));
  };

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
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
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
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
              <InviteDetails user={item.id} />
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
          view="student?"
          historyReplace="/admissions/students"
          singlePage=""
          options={{
            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
              <AddBulkToCohort
                selectedRows={selectedRows}
                displayData={displayData}
                setSelectedRows={setSelectedRows}
                items={items}
              />
            ),
          }}
          search={async (querys) => {
            setQueryFilters(querys);
            const { data } = await bc.auth().getAcademyStudents();
            setItems(data);
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
