/* eslint-disable react/jsx-indent */
import {
  Avatar, Button, Icon,
  IconButton, Tooltip
} from '@material-ui/core';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import bc from '../../../services/breathecode';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};
const name = (user) => {
  // console.log('Name fn user', user);
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const ServiceMentors = ({ serviceId, service }) => {
  const [allServiceMentors, setAllServiceMentors] = useState([]);

  useEffect(() => {
    bc.mentorship().getAcademyMentors()
      .then((payload) => {

        setAllServiceMentors(payload.data.filter((mentor) => mentor.status === 'ACTIVE') || []);
      });
  }, []);
  const statusColors = {
    INVITED: 'text-white bg-error',
    ACTIVE: 'text-white bg-green',
    INNACTIVE: 'text-white bg-error',
  };
  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const serviceMentor = allServiceMentors[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-10">{serviceMentor?.slug}</h5>
                <small className="text-muted">{serviceMentor?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'service',
      label: 'Service(s)',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 py-1 text-10">{allServiceMentors[dataIndex].service.slug}</h5>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const serviceMentor = allServiceMentors[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px${statusColors[serviceMentor.status]}`}>
                  {serviceMentor.status.toUpperCase()}
                </small>
                {serviceMentor.status === 'INVITED' && (
                  <small className="text-muted d-block">Needs to accept invite</small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'booking_url',
      label: 'Booking Link',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <Tooltip title="Copy booking link">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(allServiceMentors[dataIndex].booking_url);
                toast.success('Copied to the clipboard', toastOption);
              }}
            >
              <Icon>assignment</Icon>
            </IconButton>
          </Tooltip>
        ),
      },
    },
    {
      name: 'meeting_url',
      label: 'Meeting Link',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          allServiceMentors[dataIndex].meeting_url
            ? (
              <Tooltip title="Copy booking link">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(allServiceMentors[dataIndex].booking_url);
                    toast.success('Copied to the clipboard', toastOption);
                  }}
                >
                  <Icon>assignment</Icon>
                </IconButton>
              </Tooltip>
            )
            : 'No meeting URL yet.'
        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const serviceMentor = allServiceMentors[dataIndex].user !== null
            ? allServiceMentors[dataIndex]
            : {
              ...allServiceMentors[dataIndex],
              serviceMentor: {
                first_name: '',
                last_name: '',
                services: '',
                booking_url: '',
                meeting_url: '',
              },
            };
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/mentors/staff/${serviceMentor.id}`}>
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
    <SmartMUIDataTable
      title="Active service mentors"
      columns={columns}
      items={allServiceMentors}
      selectableRows={false}
      view="sevice mentors"
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

ServiceMentors.propTypes = {
  service: PropTypes.object,
  serviceID: PropTypes.string,
};

export default ServiceMentors;
