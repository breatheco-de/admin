import React, { useState } from 'react';
import {
  Avatar, Icon, IconButton, Button, Tooltip, Chip, TableCell,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../../matx';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import InviteDetails from '../../components/InviteDetails';
import bc from '../../services/breathecode';

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

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Teachers = () => {
  const [items, setItems] = useState([]);

  const resentMemberInvite = (user) => {
    bc.auth()
      .resentMemberInvite(user)
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
              <Avatar className="w-48 h-48" src={user?.profile?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {rest.first_name} {rest.last_name}
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
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (i) => (
          <div>
            <h5 className="my-0 text-15">{dayjs(items[i].created_at).format('MM-DD-YYYY')}</h5>
            <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
            {'  '}
            {dayjs().isBefore(dayjs(items[i].created_at).add(30, 'minutes')) &&
              <Tooltip title="Created less than 30 minutes ago">
                <small className="text-muted text-secondary">RECENT</small>
              </Tooltip>
            }
          </div>
        ),
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }} padding="0">
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div>
              <p className="p-0 my-0">{item.role.name || item.role}</p>
              {item.status != 'INVITED' ?
              <small className={`border-radius-4 px-2 pt-2px${statusColors[item.status]}`}>
                {item.status.toUpperCase()}
              </small>
              :
              <small className="text-muted d-block">Needs to accept invite</small>
              }
            </div>
          );
        },
      },
    },
    {
      name: 'latest_cohorts',
      label: 'Latest Cohorts',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          const maxCohorts = 4;
          return (
            <div>
                {item.cohorts.slice(0,4).map(c => {
                  const msg = dayjs().isBefore(c.ending_date) ? 
                    `Ends on ${dayjs(c.ending_date).format('MM-DD-YYYY')}`
                    :
                    !c.ending_date ? `Never ended` :
                    `Ended ${dayjs(c.ending_date).fromNow()}, on ${dayjs(c.ending_date).format('MM-DD-YYYY')}`;
                  return <Tooltip title={msg}>
                    <div className="chip mr-1 mb-1">
                      <p className='cut-text show-on-hover' style={{ width: "80px"}}>{c.name}</p><small>{c.stage}</small>
                    </div>
                  </Tooltip>
                })}
                { item.cohorts.length > maxCohorts && <span className="mr-1 mb-1">
                      {item.cohorts.length} more...
                    </span>
                }
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
                <IconButton onClick={() => resentMemberInvite(item.id)}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/admin/staff/${item.user.id}`}>
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
            <Breadcrumb routeSegments={[{ name: 'Admissions', path: '/' }, { name: 'Teachers' }]} />
          </div>

          <div className="">
            <Link to="/admin/staff/new">
              <Button variant="contained" color="primary">
                Add new teacher
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="Tearchers and Assistants"
          columns={columns}
          items={items}
          view="teachers?"
          historyReplace="/admissions/teachers"
          singlePage=""
          search={async (querys) => {
            const { data } = await bc.admissions().getAllAcademyTeachers({ ...querys, roles: 'teacher,assistant' });
            setItems(data.results || data);
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

export default Teachers;
