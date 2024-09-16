import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import bc from '../../../services/breathecode';
import {
  Tooltip,
  TableCell,
} from '@material-ui/core';
import SessionDetails from '../session-details/SessionDetails'
import SessionNotes from '../session-details/SessionNotes'
import SessionBill from '../session-details/SessionBill'
import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration)


const statusColors = {
  PENDING: 'bg-secondary text-dark',
  COMPLETED: 'text-white bg-green',
  FAILED: 'text-white bg-error',
  STARTED: 'text-white bg-primary',
};


const MentorSessions = ({ staffId, mentor }) => {
  const [sessions, setSessions] = useState([]);
  const columns = [
    {
      name: 'session',
      label: 'Session',
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
            item && <SessionDetails session={item} />
          );
        },
      },
    },
    {
      name: 'notes',
      label: 'Notes', // column title that will be shown in table
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
            item && <SessionNotes session={item} />
          );
        },
      },
    },
    {
      name: 'duration',
      label: 'Duration', // column title that will be shown in table
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
            <div>
              <small>
                {item?.duration == "none" ? '' : `${item?.duration_string}`}
              </small>
              {item?.extra_time ?
                <small style={{ display: 'block', fontSize: '8px' }} className="text-danger">overtime
                </small> : ''}
            </div>);
        },
      },
    },
    {
      name: 'status',
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        filterType: "dropdown",
        filterOptions: {
          names: ['COMPLETED', 'FAILED', 'STARTED', 'PENDING']
        },
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
            <div>
              <small style={{borderRadius: '3px'}} className={`p-1 ${statusColors[item.status]}`}>
                {item?.status}
              </small>
            </div>);
        },
      },
    },
  ]
  return (
    <SmartMUIDataTable
      title="Sessions"
      columns={columns}
      items={sessions}
      // selectableRows="multiple"
      view="mentor sessions"
      singlePage=""
      historyReplace=""
      search={async (querys) => {
        const { data } = await bc.mentorship().getSingleMentorSessions({ ...querys, mentor: staffId });
        setSessions(data.results);
        return data;
      }}
    />
  );
};

MentorSessions.propTypes = {
  mentor: PropTypes.object,
  staffId: PropTypes.string,
};

export default MentorSessions;
