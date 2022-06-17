import React, { useState } from 'react';
import { Button, Tooltip, Chip, IconButton } from '@material-ui/core';
import ArrowUpwardRounded from '@material-ui/icons/ArrowUpwardRounded';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import { Breadcrumb } from 'matx';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from '../../services/breathecode';
import { useQuery } from '../../hooks/useQuery';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  google: 'bg-gray',
  facebook: 'bg-secondary',
  coursereport: 'text-white bg-warning',
  ActiveCampaign: 'text-white bg-error',
  bing: 'text-white bg-green',
};

const statusColors = {
  REQUESTED: 'text-white bg-warning',
  PENDING: 'text-white bg-error',
  DONE: 'text-white bg-green',
  IGNORE: 'light-gray',
};

const defaultBg = 'bg-gray';

const Leads = () => {
  const [items, setItems] = useState([]);
  const query = useQuery();

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const lead = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {`${lead.first_name} ${lead.last_name}`}
              </h5>
              <small className="text-muted">{lead?.email || lead.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'course',
      label: 'Course',
      options: {
        display: false,
        filterList: query.get('course') !== null ? [query.get('course')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].course}</span>
        ),
      },
    },
    {
      name: 'storage_status',
      label: 'Lead Status',
      options: {
        filterList:
          query.get('storage_status') !== null ? [query.get('storage_status')] : [],
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="ml-3">
              <Chip className={statusColors[items[dataIndex]?.storage_status] || defaultBg} size="small" label={items[dataIndex]?.storage_status} />
            </div>
          </div>
        ),
      },
    },
    {
      name: 'utm_url',
      label: 'Utm URL',
      options: {
        filterList: query.get('utm_url') !== null ? [query.get('utm_url')] : [],
        customBodyRenderLite: (dataIndex) => (
          <div>
            {/* <div className="flex items-center flex-column"> */}
            <Tooltip
              title={items[dataIndex].utm_url
                ? items[dataIndex].utm_url
                : '---'}
            >
              <span className="ellipsis">
                {items[dataIndex].utm_url
                  ? items[dataIndex].utm_url
                  : '---'}
              </span>
            </Tooltip>

            {/* </div> */}
            <div className="flex justify-around items-center">
              <small className={`text-muted`}>
                {items[dataIndex].utm_medium
                  ? items[dataIndex].utm_medium
                  : '---'}
              </small>
              <small className={`text-muted`}>
                {items[dataIndex].utm_source
                  ? items[dataIndex].utm_source
                  : '---'}
              </small>
            </div>
          </div>

        ),
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      options: {
        filter: true,
        filterType: 'multiselect',
        filterList: query.get('tags') !== null ? [query.get('tags')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].tags
              ? items[dataIndex].tags
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'created_at',
      label: 'Created At',
      options: {
        filter: true,
        filterList:
          query.get('created_at') !== null ? [query.get('created_at')] : [],
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
  ];

  const SendCRM = ({ ids, setSelectedRows }) => {

    //find the elements in the array
    const positions = ids.map((id) => {
      return items.map((e) => { return e.id; }).indexOf(id);
    });

    let notPending = false;

    //check if all of them are pending
    for (let i = 0; i < positions.length; i++) {
      if (items[positions[i]].storage_status !== 'PENDING') {
        notPending = true;
        break;
      }
    }

    return (
      <div>
        <Tooltip title={!notPending ? "Send to CRM" : "Select Pending leads only"}>
          <IconButton
          // disabled={notPending}
          >
            <ArrowUpwardRounded
              onClick={async () => {
                if (!notPending) {
                  const { data } = await bc.marketing()
                    .bulkSendToCRM(ids);
                  setSelectedRows([]);
                  return data;
                }
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Pages', path: '/leads/list' },
                { name: 'Order List' },
              ]}
            />
          </div>
          <div className="">
            <Link
              to="/growth/sales/new"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Add new lead
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Leads"
          columns={columns}
          items={items}
          view="leads?"
          singlePage=""
          historyReplace="/leads/list"
          search={async (querys) => {
            const { data } = await bc.marketing()
              .getAcademyLeads(querys);
            setItems(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc
              .admissions()
              .deleteLeadsBulk(querys);
            return status;
          }}
          bulkActions={SendCRM}
        />
      </div>
    </div>
  );
};

export default Leads;
