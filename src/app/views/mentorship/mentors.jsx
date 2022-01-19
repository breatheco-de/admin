import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import InviteDetails from 'app/components/InviteDetails';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};
const roleColors = {
  admin: 'text-black bg-gray',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Mentors = () => {
  const [userList, setUserList] = useState([]);
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
          const { user } = userList[dataIndex];
          console.log(user);
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{name(user)}</h5>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'service',
      label: 'Service(s)',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{userList[dataIndex].service.slug}</h5>
              <small className="text-muted">{userList[dataIndex].service.name}</small>
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
          const item = userList[dataIndex];
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
      name: 'booking_url',
      label: 'Booking Link',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <Tooltip title="Copy booking link">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(userList[dataIndex].booking_url);
                toast.success('Copied to the clipboard', toastOption);
              }}
            >
              <Icon>assignment</Icon>
            </IconButton>
          </Tooltip>
        ),
      },
    },
    {
      name: 'meeting_url',
      label: 'Meeting Link',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          userList[dataIndex].meeting_url
            ? (
              <Tooltip title="Copy booking link">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(userList[dataIndex].booking_url);
                    toast.success('Copied to the clipboard', toastOption);
                  }}
                >
                  <Icon>assignment</Icon>
                </IconButton>
              </Tooltip>
            )
            : 'No meeting URL yet.'
        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = userList[dataIndex].user !== null
            ? userList[dataIndex]
            : {
              ...userList[dataIndex],
              user: {
                first_name: '',
                last_name: '',
                services: '',
                booking_url: '',
                meeting_url: '',
              },
            };
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/mentors/staff/${item.user.id}`}>
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
            <Breadcrumb routeSegments={[{ name: 'Admin', path: '/' }, { name: 'Staff' }]} />
          </div>

          <div className="">
            <Link to="/admin/staff/new">
              <Button variant="contained" color="primary">
                Add new staff member
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Mentors"
          columns={columns}
          items={userList}
          view="staff?"
          singlePage=""
          historyReplace="/admin/staff"
          search={async (querys) => {
            const { data } = await bc.mentorship().getAcademyMentor(querys);
            console.log('Mentors members');
            setUserList(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc
              .admissions()
              .deleteStaffBulk(querys);
            return status;
          }}
        />
      </div>
    </div>
  );
};

export default Mentors;
