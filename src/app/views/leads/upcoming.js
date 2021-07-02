import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'matx';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from '../../services/breathecode';
import { useQuery } from '../../hooks/useQuery';

import { SmartMUIDataTable } from "../../components/SmartDataTable"

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
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page: 0,
  });
  const [querys, setQuerys] = useState({});
  const query = useQuery();
  const history = useHistory();

  const handleLoadingData = () => {
    setIsLoading(true);
    const q = {
      status: "won",
      limit: query.get('limit') !== null ? query.get('limit') : 10,
      offset: query.get('offset') !== null ? query.get('offset') : 0,
    };
    setQuerys(q);
    bc.marketing()
      .getAcademyLeads(q)
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems({ ...data });
        }
      })
      .catch((error) => setIsLoading(false));
    return () => setIsAlive(false);
  };

  useEffect(() => {
    handleLoadingData();
  }, []);

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    bc.marketing()
      .getAcademyLeads({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data, page });
      })
      .catch((error) => {
        setIsLoading(false);
      });
    const q = { ...querys, limit: rowsPerPage, offset: page * rowsPerPage };
    setQuerys(q);
    history.replace(
      `/leads/upcoming?${Object.keys(q)
        .map((key) => `${key}=${q[key]}`)
        .join('&')}`,
    );
  };

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filterList: query.get('id') !== null ? [query.get('id')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items.results[dataIndex].id}</span>
        ),
      },
    },
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const lead = items.results[dataIndex];
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
          <span className="ellipsis">{items.results[dataIndex].course}</span>
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
            {items.results[dataIndex].lead_type
              ? items.results[dataIndex].lead_type
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
            {items.results[dataIndex].utm_url
              ? items.results[dataIndex].utm_url
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
            {items.results[dataIndex].utm_medium
              ? items.results[dataIndex].utm_medium
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
              stageColors[items.results[dataIndex].utm_source]
            } border-radius-4 px-2 pt-2px text-center`}
          >
            {items.results[dataIndex].utm_source
              ? items.results[dataIndex].utm_source
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
            {items.results[dataIndex].tags
              ? items.results[dataIndex].tags
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
                {dayjs(items.results[i].created_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items.results[i].created_at).fromNow()}
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
                { name: 'Pages', path: '/leads/upcoming' },
                { name: 'Order List' },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
        <SmartMUIDataTable
            title="Won leads that are waiting to start"
            columns={columns}
            items={items}
            search={async (querys) => {
              const { data } = await bc.auth().getAcademyLeads(querys);
              setItems(data.results);
              return data;
            }}
            deleting={async (querys) => {
              const { status } = await bc
                .admissions()
                .deleteStudentBulk(querys);
              return status;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Leads;
