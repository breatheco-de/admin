import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { Tooltip, TableCell } from '@material-ui/core';
import SessionDetails from './session-details/SessionDetails'
import SessionNotes from './session-details/SessionNotes'
import SessionBill from './session-details/SessionBill'
import AddServiceInBulk from './mentor-form/mentor-utils/AddServiceInBulk';
import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration)

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
    {
      name: 'mentor',
      label: 'Mentor',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "50px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const session = sessions[dataIndex];
          return (<>
            <p className="m-0 p-0">{session?.mentor.user.first_name} {session?.mentor.user.last_name}</p>
            <small className="m-0 p-0">{session?.service?.name}</small>
          </>);
        },
      },

    }
  ]
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
            view="sessions?"
            singlePage=""
            historyReplace="/mentors/sessions"
            search={async (querys) => {
              const { data } = await bc.mentorship().getAllMentorSessions({ ...querys });
              setSessions(data.results);
              return data;
            }}
            bulkActions={(props) => (
              <AddServiceInBulk
                items={sessions}
                {...props}
              />
            )}
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
