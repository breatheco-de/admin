import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { 
  FormGroup,
  TextField,
 } from '@material-ui/core';
import SessionDetails from './session-details/SessionDetails'
import SessionNotes from './session-details/SessionNotes'
import SessionBill from './session-details/SessionBill'
import AddServiceInBulk from './mentor-form/mentor-utils/AddServiceInBulk';
import { useQuery } from '../../hooks/useQuery';
import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration)

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const query = useQuery();
  const columns = [
    {
      name: 'started_at,created_at',
      label: 'Session',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <SessionDetails session={item} />
          );
        },
      },
    },
    {
      name: 'student',
      label: 'Notes', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('student') !== null ? [query.get('student')] : [],
        filterType: 'custom',
        sort: false,
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <FormGroup row>
                  <TextField
                    label="Student"
                    value={filterList[index][0] || ''}
                    onChange={event => {
                      filterList[index][0] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                  />
                </FormGroup>
              </div>
            );
          }
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
      name: 'service',
      label: 'Billing', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('service') !== null ? [query.get('service')] : [],
        sort: false,
        filterType: 'custom',
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <FormGroup row>
                  <TextField
                    label="Service"
                    value={filterList[index][0] || ''}
                    onChange={event => {
                      filterList[index][0] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                  />
                </FormGroup>
              </div>
            );
          }
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
        filterList: query.get('mentor') !== null ? [query.get('mentor')] : [],
        sortThirdClickReset: true,
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
            options={{
              print: false,
              viewColumns: false,
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                <AddServiceInBulk
                  selectedRows={selectedRows}
                  displayData={displayData}
                  setSelectedRows={setSelectedRows}
                  items={sessions}
                />
              ),
            }}
            search={async (querys) => {
              const { data } = await bc.mentorship().getAllMentorSessions({ ...querys });
              setSessions(data.results);
              return data;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sessions;
