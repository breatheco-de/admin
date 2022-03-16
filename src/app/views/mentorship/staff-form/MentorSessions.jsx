/* eslint-disable react/jsx-indent */
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import {
  Tooltip,
  TableCell,
} from '@material-ui/core';
// toast.configure();
// const toastOption = {
//   position: toast.POSITION.BOTTOM_RIGHT,
//   autoClose: 8000,
// };
const statusColors = {
  PENDING: 'bg-secondary text-dark',
  COMPLETED: 'text-white bg-green',
  FAILED: 'text-white bg-error',
  STARTED: 'text-white bg-primary',
};


const MentorSessions = ({ staffId, mentor }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    bc.mentorship().getSingleMentorSessions({ mentor: staffId })
      .then((payload) => {
        setSessions(payload.data || []);
      });
  }, []);

  const columns = [
    {
      name: 'service', // field name in the row object
      label: 'Service', // column title that will be shown in table
      options: {
        selectableRows: false, // 'single' || 'multiple'
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
              <div className="ml-0">
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
            <TableCell key={index} style={{ width: "150px", padding: "10px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="ml-0">
                <p className="my-0 text-15">{`${item?.mentor.user?.first_name}`}</p>
                <p className="my-0 text-15">{`${item?.mentor.user?.last_name}`}</p>
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
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="ml-0">
                <p className="my-0 text-15">{`${item?.mentee?.first_name}`}</p>
                <p className="my-0 text-15">{` ${item?.mentee?.last_name}`}</p>
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
            <TableCell key={index} style={{ width: "150px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <Tooltip title={item?.summary || 'No summary provided'}>
              <div className="flex items-center" style={{ width: '150px' }}>
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
    <SmartMUIDataTable
      title="All Sessions"
      columns={columns}
      items={sessions}
      selectableRows={false}
      view="mentor sessions"
      singlePage=""
      historyReplace="/admin/syllabus"
      search={async (querys) => {
        const { data } = await bc.mentorship().getSingleMentorSessions({ mentor: staffId });
        setSessions(data.results || data);
        return data;
      }}
      deleting={async (querys) => {
        const { status } = await bc
          .admissions()
          .deleteStaffBulk(querys);
        return status;
      }}
    />
  );
};

MentorSessions.propTypes = {
  mentor: PropTypes.object,
  staffId: PropTypes.string,
};

export default MentorSessions;
