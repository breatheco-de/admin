import React, { useState } from 'react';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
  Avatar,
  Icon,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { Breadcrumb } from '../../../matx';
import bc from '../../services/breathecode';
import InviteDetails from '../../components/InviteDetails';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const Students = () => {
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
          const invite = userList[dataIndex].user !== null
            ? userList[dataIndex]
            : {
              ...userList[dataIndex],
              invite: { first_name: '', last_name: '', imgUrl: '' },
            };

          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={invite.user?.imgUrl} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {invite.user?.first_name || invite.first_name}
                  {' '}
                  {invite.user?.last_name || invite.last_name}
                </h5>
                <small className="text-muted">{invite?.email}</small>
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
              <h5 className="my-0 text-15">
                {dayjs(userList[i].created_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(userList[i].created_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = userList[dataIndex];
          return (
            <div className="MUIDataTableBodyCell-root-326">
              {item.role.name.toUpperCase()}
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
          const item = userList[dataIndex].user !== null
            ? userList[dataIndex]
            : {
              ...userList[dataIndex],
              user: {
                first_name: '', last_name: '', imgUrl: '', id: '',
              },
            };
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <InviteDetails getter={() => bc.auth().getUserInvite(item.id)} />
              <Tooltip title="Resend Invite">
                <IconButton onClick={() => resendInvite(item.id)}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
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
            <Breadcrumb
              routeSegments={[
                { name: 'Admin', path: '/' },
                { name: 'Invites' },
              ]}
            />
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Invites"
          columns={columns}
          items={userList}
          view="invites?"
          singlePage=""
          historyReplace="/admin/invites"
          search={async (querys) => {
            const { data } = await bc.auth().getAcademyInvites({ ...querys, status: 'PENDING' });
            setUserList(data.results || data);
            return data;
          }}
        />
      </div>
    </div>
  );
};

export default Students;
