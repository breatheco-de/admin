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
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const statusColors = {
  expired: 'text-white bg-error',
  soon: 'text-white bg-warning',
  ok: 'text-white bg-green',
};
const roleColors = {
  admin: 'text-black bg-gray',
};

const name = (user) => {
  let _name = ""
  if (user && user.first_name && user.first_name !== '') _name = user.first_name;
  if (user && user.last_name && user.last_name !== '') _name += " " + user.last_name;
  if (_name === "") _name = 'No name';
  return _name;
};

const GitpodUsers = () => {
  const [userList, setUserList] = useState([]);
  
  const columns = [
    {
      name: 'github', // field name in the row object
      label: 'Github', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { github_username, user, academy, cohort } = userList.results[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{github_username}</h5>
                <small className="text-muted">{cohort ? cohort.name : academy ? academy.name : "No academy or cohort"}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'user', // field name in the row object
      label: 'User', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { github_username, user } = userList.results[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Link to={`/admissions/students/${user?.id}`}>
                  <h5 className={`my-0 text-15 ${!user ? 'text-error' : ''}`}>{user ? name(user) : "No user found"}</h5>
                </Link>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'expires_at',
      label: 'Expires At',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          let now = dayjs()
          let stage = 'ok'
          let item = userList.results[i]
          if(dayjs(item.expires_at).isBefore(now)) stage = 'expired';
          else if(dayjs(item.expires_at).isBefore(now.add(3,'days'))) stage = 'soon';
          return <div className="flex items-center">
            <div className="ml-3">
              <Tooltip title={item.delete_status}><div>
                  <h5 className="my-0 text-15">{item.expires_at ? dayjs(item.expires_at).format('MM-DD-YYYY') : "Never"}</h5>
                  {item.expires_at && <small className={`p-1 ${statusColors[stage]} pointer`}>{dayjs(item.expires_at).fromNow()}</small>}
                  </div></Tooltip>
            </div>
          </div>
        },
      },
    },
    {
      name: 'assignee_id',
      label: 'Gitpod ID',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = userList.results[dataIndex];
          return (
            <small
              className={`border-radius-4 px-2 pt-2px bg-light`}
            >
              {item.assignee_id}
            </small>
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
          const item = userList.results[dataIndex]
          return (item.academy ? <div className="flex items-center">
              <Tooltip title="Expire immediately">
                <IconButton onClick={() => bc.auth().updateGitpodUser(item.id, { expires_at: dayjs().subtract(1,'day') })}>
                  <Icon>alarm_off</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Extend gitpod license for 2 weeks">
                <IconButton onClick={() => bc.auth().updateGitpodUser(item.id, { expires_at: dayjs().add(14,'day') })}>
                  <Icon>alarm_add</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Recalculate expiration date based on the newest cohort">
                <IconButton onClick={() => bc.auth().updateGitpodUser(item.id, { expires_at: null })}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
            </div>
            :
            <div className="flex items-center">No matching student found</div>
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
            <Breadcrumb routeSegments={[{ name: 'Admin', path: '/' }, { name: 'Gitpod' }]} />
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title={`${userList.count} Gitpod Users`}
          columns={columns}
          items={userList?.results || []}
          view="gitpod?"
          singlePage=""
          historyReplace="/admin/gitpod"
          search={async (querys) => {
            const { data } = await bc.auth().getGitpodUsers(querys);
            setUserList(data);
            return data;
          }}
        />
      </div>
    </div>
  );
};

export default GitpodUsers;
