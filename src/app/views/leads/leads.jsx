import React, { useState } from 'react';
import { Button } from '@material-ui/core';
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

const Leads = () => {
  const [items, setItems] = useState([]);
  const query = useQuery();

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filterList: query.get('id') !== null ? [query.get('id')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].id}</span>
        ),
      },
    },
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
      name: 'lead_type',
      label: 'Lead Type',
      options: {
        filterList:
          query.get('lead_type') !== null ? [query.get('lead_type')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].lead_type
              ? items[dataIndex].lead_type
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'utm_url',
      label: 'Utm URL',
      options: {
        filterList: query.get('utm_url') !== null ? [query.get('utm_url')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].utm_url
              ? items[dataIndex].utm_url
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'utm_medium',
      label: 'Utm Medium',
      options: {
        filterList:
          query.get('utm_medium') !== null ? [query.get('utm_medium')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].utm_medium
              ? items[dataIndex].utm_medium
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'utm_source',
      label: 'Utm Source',
      options: {
        filter: true,
        filterType: 'multiselect',
        filterList:
          query.get('utm_source') !== null ? [query.get('utm_source')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span
            className={`ellipsis ${
              stageColors[items[dataIndex].utm_source]
            } border-radius-4 px-2 pt-2px text-center`}
          >
            {items[dataIndex].utm_source
              ? items[dataIndex].utm_source
              : '---'}
          </span>
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
        />
      </div>
    </div>
  );
};

export default Leads;
