import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Chip, IconButton, Icon } from '@material-ui/core';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import { Breadcrumb } from 'matx';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import { useQuery } from '../../hooks/useQuery';
import bc from '../../services/breathecode';
import AlertAcademyAlias from 'app/components/AlertAcademyAlias';
import { toast } from "react-toastify";
import InviteDetails from '../../components/InviteDetails';
import DowndownMenu from '../../components/DropdownMenu';

const relativeTime = require('dayjs/plugin/relativeTime');

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

dayjs.extend(relativeTime);

const statusColors = {
  PENDING: 'secondary',
  ACCEPTED: 'primary',
  REJECTED: 'default',
  WAITING_LIST: 'default',
};

const UserInvites = () => {
  const history = useHistory();
  const query = useQuery();
  const [items, setItems] = useState([]);

  const refresh = () => {
    this.setState({});
  };

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const invite = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {invite.user?.first_name || invite.first_name || 'No name'} {invite.user?.last_name || invite.last_name || ''}
              </h5>
              <small className="text-muted">{invite?.email || 'No email'}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        filterList: query.get('role') !== null ? [query.get('role')] : [],
        customBodyRenderLite: (dataIndex) => {
          const invite = items[dataIndex];
          return (
            <span className="ellipsis">
              {invite.role?.name?.toUpperCase() || 'No role'}
            </span>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        filterList: query.get('status') !== null ? [query.get('status')] : [],
        filterType: "dropdown",
        filterOptions: {
          names: ['PENDING', 'ACCEPTED', 'REJECTED', 'WAITING_LIST']
        },
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <Chip 
              color={statusColors[items[dataIndex]?.status]} 
              className="pointer" 
              size="small" 
              label={items[dataIndex]?.status || 'UNKNOWN'} 
            />
          </div>
        ),
      },
    },
    {
      name: 'academy',
      label: 'Academy',
      options: {
        display: false,
        filter: true,
        filterList: query.get('academy') !== null ? [query.get('academy')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].academy?.name || 'No academy'}
          </span>
        ),
      },
    },
    {
      name: 'cohort',
      label: 'Cohort',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].cohort?.name || '---'}
          </span>
        ),
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
              <h5 className="my-0 text-15">
                {dayjs(items[i].created_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items[i].created_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'sent_at',
      label: 'Sent At',
      options: {
        filter: false,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              {items[i].sent_at ? (
                <>
                  <h5 className="my-0 text-15">
                    {dayjs(items[i].sent_at).format('MM-DD-YYYY')}
                  </h5>
                  <small className="text-muted">
                    {dayjs(items[i].sent_at).fromNow()}
                  </small>
                </>
              ) : (
                <span className="text-muted">Not sent</span>
              )}
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
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <InviteDetails getter={() => bc.auth().getUserInvite(items[i].id)} />
            <Tooltip title="Resend Invite">
              <IconButton onClick={() => resendInvite(items[i].id)}>
                <Icon>refresh</Icon>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    },
  ];

  const getUserInvites = async (querys) => {
    const { data } = await bc.auth().getAcademyInvites(querys);
    setItems(data.results || data);
    return data;
  };

  const resendInvite = (inviteId) => {
    bc.auth()
      .resendInvite(inviteId)
      .then(({ data }) => {
        console.log(data);
        toast.success('Invite resent successfully', toastOption);
        getUserInvites({ limit: 10, offset: 0, ...getParams() });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to resend invite', toastOption);
      });
  };

  const BulkActions = ({ ids, setSelectedRows }) => {
    return (
      <div>
        <Tooltip title="Resend Invites">
          <IconButton onClick={async () => {
            try {
              for (const id of ids) {
                await bc.auth().resendInvite(id);
              }
              setSelectedRows([]);
              toast.success(`${ids.length} invites resent successfully`, toastOption);
              getUserInvites({ limit: 10, offset: 0, ...getParams() });
            } catch (error) {
              console.error(error);
              toast.error('Failed to resend invites', toastOption);
            }
          }}>
            <Icon>refresh</Icon>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Growth', path: '/growth' },
                { name: 'Invites & Signups' },
              ]}
            />
          </div>
          <div className="">
            <DowndownMenu
              options={[
                { label: 'Add single invite', value: 'admin/staff/new'},
                { label: 'Bulk invite users', value: 'admin/staff/bulk'}
              ]}
              icon="more_horiz"
              onSelect={({ value }) => {
                const url = `/${value}`;
                history.push(url);
              }}
            >
              <Button variant="contained" color="primary" size="small">
                Add invite
              </Button>
            </DowndownMenu>
          </div>
        </div>
      </div>
      <AlertAcademyAlias />
      <div>
        <SmartMUIDataTable
          title="Invites & Signups"
          columns={columns}
          items={items}
          view="userinvites?"
          singlePage=""
          historyReplace="/growth/invites-signups"
          options={{
            print: false,
            onFilterChipClose: async (index, removedFilter, filterList) => {
              const querys = getParams();
              const { data } = await bc.auth().getAcademyInvites(querys);
              setItems(data.results || data);
            },
          }}
          search={getUserInvites}
          deleting={async (querys) => {
            const { status } = await bc.auth().deleteAcademyInvites(querys);
            return status;
          }}
          bulkActions={BulkActions}
        />
      </div>
    </div>
  );
};

export default UserInvites; 