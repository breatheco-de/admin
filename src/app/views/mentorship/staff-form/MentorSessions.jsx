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

  // useEffect(() => {
  //   bc.mentorship().getSingleMentorSessions({ mentor: staffId })
  //     .then((payload) => {
  //       setSessions(payload.data || []);
  //     });
  // }, []);

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
            <SessionDetails session={item} />
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
            <SessionNotes session={item} />
          );
        },
      },
    },
    {
      name: 'billing',
      label: 'Billing', // column title that will be shown in table
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
            <SessionBill session={item} />
          );
        },
      },
    },
  ]
  return (
    <SmartMUIDataTable
      title="Sessions"
      columns={columns}
      items={sessions}
      selectableRows="multiple"
      view="mentor sessions"
      singlePage=""
      historyReplace="/admin/syllabus"
      search={async (querys) => {
        const { data } = await bc.mentorship().getSingleMentorSessions({ ...querys, mentor: staffId });
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
  );
};

MentorSessions.propTypes = {
  mentor: PropTypes.object,
  staffId: PropTypes.string,
};

export default MentorSessions;
