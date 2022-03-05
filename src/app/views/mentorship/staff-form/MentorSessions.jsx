/* eslint-disable react/jsx-indent */
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';

// toast.configure();
// const toastOption = {
//   position: toast.POSITION.BOTTOM_RIGHT,
//   autoClose: 8000,
// };

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
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
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
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="ml-3">
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
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-start">
              <div className="ml-3">
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
        customBodyRenderLite: (dataIndex) => {
          const item = sessions[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {item?.status}
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
