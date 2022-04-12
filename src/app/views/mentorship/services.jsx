import React, { useState } from 'react';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
  Icon,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../../matx';
import bc from '../../services/breathecode';

const Services = () => {
  const [serviceList, setServiceList] = useState([]);

  const columns = [
    {
      name: 'Id', // field name in the row object
      label: 'Id', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const singleService = serviceList[dataIndex].user !== null
            ? serviceList[dataIndex]
            : {
              ...serviceList[dataIndex],
              service: {
                id: '', name: '', slug: '', status: '',
              },
            };
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {singleService.id}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const singleService = serviceList[dataIndex];
          return (
            <div className="MUIDataTableBodyCell-root-326">
              {singleService.name}
            </div>
          );
        },
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const singleService = serviceList[dataIndex];
          return (
            <div className="MUIDataTableBodyCell-root-326">
              {singleService.slug}
            </div>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const singleService = serviceList[dataIndex];
          return (
            <small className={`border-radius-4 px-2 pt-2px MUIDataTableBodyCell-root-326 ${singleService.status === 'ACTIVE' ? 'text-white bg-green' : 'text-white bg-error'}`}>
              {singleService.status}
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
          const singleService = serviceList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/mentors/services/${singleService.id}`}>
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
            <Breadcrumb
              routeSegments={[
                { name: 'Services', path: '/mentors/services' },
                { name: 'All' },
              ]}
            />
          </div>
          <div className="">
            <Link to="/mentors/service/new">
              <Button variant="contained" color="primary">
                Create New Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Services"
          columns={columns}
          items={serviceList}
          view="services"
          singlePage=""
          historyReplace="/mentors/services"
          search={async (querys) => {
            const { data } = await bc.mentorship().getAllServices(querys);
            setServiceList(data.results);
            return data;
          }}
        />
      </div>
    </div>
  );
};

export default Services;
