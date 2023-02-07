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

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};
const roleColors = {
  admin: 'text-black bg-gray',
};

const Syllabus = () => {
  const [list, setList] = useState([]);

  const columns = [
    {
      name: 'name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={item?.logo} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{item?.name}</h5>
                <small className="text-muted">{item?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'owner',
      label: 'Owner',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return(
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{item?.academy_owner?.name}</h5>
            </div>
          </div>
        )},
      },
    },
    {
      name: 'private',
      label: 'Private',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              {item?.private? <Tooltip title="This syllabus is not shared with other academies">
                <Icon>lock</Icon>
                {/** <Icon>lock_open</Icon> */}
              </Tooltip> : (
                <p>Not Private</p>
              )}
            </div>
          );
        },
      },
    },
    {
      name: 'duration',
      label: 'Duration',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { duration_in_hours, duration_in_days, week_hours } = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {`${duration_in_hours} hours, ${Math.trunc(duration_in_hours / week_hours) || 0} `
                  + `weeks, ${duration_in_days} days`}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/admissions/syllabus/${item.slug}`}>
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
            <Breadcrumb routeSegments={[{ name: 'Admin', path: '/' }, { name: 'Syllabus' }]} />
          </div>

          <div className="">
            <Link to="/admissions/syllabus/new">
              <Button variant="contained" color="primary">
                Add new syllabus
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Syllabus"
            columns={columns}
            items={list}
            view="syllabus?"
            singlePage=""
            historyReplace="/admin/syllabus"
            search={async (querys) => {
              const { data } = await bc.admissions().getAllAcademySyllabus(querys);
              setList(data.results);
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
    </div>
  );
};

export default Syllabus;
