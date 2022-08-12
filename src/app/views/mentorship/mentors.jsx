import {
  Avatar, Button, Icon,
  IconButton, Tooltip, TableCell,
} from '@material-ui/core';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'bg-secondary text-dark',
  ACTIVE: 'text-white bg-green',
  INNACTIVE: 'text-white bg-error',
};


const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Mentors = () => {
  const [mentorList, setMentorList] = useState([]);

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const mentor = mentorList[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={mentor.user?.profile?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{name(mentor.user)}</h5>
                <small className="text-muted">{mentor?.services.map(s => s.name).join(", ")}</small>
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
          const item = mentorList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${statusColors[item.status]}`}>
                  {item.status.toUpperCase()}
                </small>
                {item.status === 'INVITED' && (
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
      label: 'Book & Meet links',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "300px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const _mentor = mentorList[dataIndex];
          const book = `https://s.4geeks.com/mentor/${_mentor.slug}`
          const meet = `https://s.4geeks.com/mentor/meet/${_mentor.slug}`
          return (
            <>
              <Tooltip title={book}>
                <small
                  className='underline pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(book);
                    toast.success('Copied to the clipboard', toastOption);
                  }}
                >
                  Book: {book.substring(0, 40)}
                  {book.length > 40 && "..."}
                </small>
              </Tooltip>
              <br></br>
              <Tooltip title={meet}>
                <small
                  className='underline pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(meet);
                    toast.success('Copied to the clipboard', toastOption);
                  }}
                >
                  Meet: {meet.substring(0, 40)}
                  {meet.length > 40 && "..."}
                </small>
              </Tooltip>
            </>
          )
        }
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = mentorList[dataIndex];
          //! TODO REVERT THIS BEFORE PUSHING
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/mentors/${item.id}`}>
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
            <Breadcrumb routeSegments={[{ name: 'Mentorship', path: '/mentors' }, { name: 'Mentor' }]} />
          </div>

          <div className="">
            <Link to="/mentors/new">
              <Button variant="contained" color="primary">
                Add new Mentor
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Mentors"
          columns={columns}
          selectableRows={true}
          items={mentorList}
          view="?"
          singlePage=""
          historyReplace="/mentors"
          search={async (querys) => {
            const { data } = await bc.mentorship().getAcademyMentors(querys);
            setMentorList(data.results);
            return data;
          }}
          deleting={async (querys) => {
            // const { status } = await bc
            //   .admissions()
            //   .deleteStaffBulk(querys);
            // return status;
          }}
        />
      </div>
    </div>
  );
};

export default Mentors;
