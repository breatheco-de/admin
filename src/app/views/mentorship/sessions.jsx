import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { Tooltip, TableCell } from '@material-ui/core';


const statusColors = {
  PENDING: 'bg-secondary text-dark',
  COMPLETED: 'text-white bg-green',
  FAILED: 'text-white bg-error',
  STARTED: 'text-white bg-primary',
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  const columns = [
    {
      name: 'service', // field name in the row object
      label: 'Service', // column title that will be shown in table
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className="">
                <p className="my-0 text-15">{item?.mentor.service?.slug}</p>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'mentor',
      label: 'Mentor',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="">
                <p className="my-0 text-15">{`${item?.mentor.user?.first_name}  ${item?.mentor.user?.last_name}`}</p>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'mentee',
      label: 'Mentee',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="">
                <p className="my-0 text-15">{`${item?.mentee?.first_name}  ${item?.mentee?.last_name}`}</p>
              </div>
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
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <Tooltip title={item?.summary || 'No summary provided'}>
              <div className="flex items-center">
                <div className={`ml-0 border-radius-4 px-2 pt-2px ${statusColors[item.status]}`}>
                  {item?.status}
                </div>
              </div>
            </Tooltip>
          );
        },
      },
    },
    {
      name: 'started_at',
      label: 'Started At',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className={'ml-0'}>
                {item?.started_at || ''}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'mentor_joined_at',
      label: 'Mentor Joined At',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className={'ml-0'}>
                {item?.mentor_joined_at || ''}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'ended_at',
      label: 'Ended At',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className={'ml-0'}>
                {item?.ended_at || ''}
              </div>
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
            <Breadcrumb routeSegments={[{ name: 'Sessions', path: '/' }, { name: 'All' }]} />
          </div>

        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Sessions"
            columns={columns}
            items={sessions}
            selectableRows={false}
            view="syllabus?"
            singlePage=""
            historyReplace="/admin/syllabus"
            search={async (querys) => {
              const { data } = await bc.mentorship().getAllMentorSessions(querys);
              setSessions(data.results);
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

export default Sessions;
