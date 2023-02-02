import React, { useState } from 'react';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import { Breadcrumb } from 'matx';
import dayjs from "dayjs";
import SessionDetails from './session-details/SessionDetails'
import SessionNotes from './session-details/SessionNotes'
import SessionBill from './session-details/SessionBill'
import AddServiceInBulk from './mentor-form/mentor-utils/AddServiceInBulk';
import { useQuery } from '../../hooks/useQuery';
import { AsyncAutocomplete } from '../../components/Autocomplete';
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration)

const Sessions = () => {
  const query = useQuery();
  const [sessions, setSessions] = useState([]);
  const [student, setStudent] = useState(query.get('student') && { slug: query.get('student') });
  const [service, setService] = useState(query.get('service') && { slug: query.get('service') });
  const [mentor, setMentor] = useState(query.get('mentor') && { slug: query.get('mentor') });
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
                <AsyncAutocomplete
                  asyncSearch={(searchTerm) => bc.auth().getAcademyMembers({like: searchTerm, include: 'student'})}
                  size="small"
                  label="Student"
                  debounced
                  value={student}
                  filterOptions={(options) => options}
                  onChange={(newStudent) => {
                    setStudent(newStudent);
                    if (newStudent) filterList[index][0] = newStudent.email;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  getOptionLabel={(option) => `${option.first_name} ${option.last_name}, (${option.email})`}
                />
              </div>
            );
          }
        },
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <SessionNotes key={item.id} session={item} />
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
                <AsyncAutocomplete
                  asyncSearch={(searchTerm) => bc.mentorship().getAllServices({ name: searchTerm })}
                  size="small"
                  label="Service"
                  debounced
                  value={service}
                  filterOptions={(options) => options}
                  onChange={(newService) => {
                    setService(newService);
                    if (newService) filterList[index][0] = newService.slug;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  getOptionLabel={(option) => `${option.name}`}
                />
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
        filterType: 'custom',
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex) => {
          const session = sessions[dataIndex];
          return (<>
            <p className="m-0 p-0">{session?.mentor.user.first_name} {session?.mentor.user.last_name}</p>
            <small className="m-0 p-0">{session?.service?.name}</small>
          </>);
        },
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <AsyncAutocomplete
                  asyncSearch={(searchTerm) => bc.mentorship().getAcademyMentors({ like: searchTerm })}
                  size="small"
                  label="Mentor"
                  debounced
                  value={mentor}
                  filterOptions={(options) => options}
                  onChange={(newMentor) => {
                    setMentor(newMentor);
                    if (newMentor) filterList[index][0] = newMentor.email;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  getOptionLabel={(option) => `${option.user.first_name} ${option.user.last_name}, (${option.email})`}
                />
              </div>
            );
          }
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
              onFilterChipClose: async (index, removedFilter, filterList) => {
                if (index === 1) setStudent(null);
                else if (index === 2) setService(null);
                else if (index === 3) setMentor(null);
                const querys = getParams();
                const { data } = await bc.mentorship().getAllMentorSessions({ ...querys });
                setSessions(data.results);
              },
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
