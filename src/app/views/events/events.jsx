import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
   Icon, IconButton,Button,
} from '@material-ui/core';
import A from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  DRAFT: 'bg-gray',
  STARTED: 'text-white bg-warning',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const EventList = () => {

  const [items, setItems] = useState([]);
  
  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small
                  className={
                    `border-radius-4 px-2 pt-2px ${stageColors[item?.status]}`
                  }
                >
                  {item?.status}
                </small>
                <br />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
    },
    {
      name: 'url',
      label: 'Landing URL',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <A
                className="px-2 pt-2px border-radius-4 text-white bg-green"
                href={items[i].url}
                rel="noopener"
              >
                URL
              </A>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'starting_at',
      label: 'Starting Date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items[i].starting_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items[i].starting_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'ending_at',
      label: 'Ending Date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items[i].ending_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items[i].ending_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow" />
            <Link to={`/events/EditEvent/${items[dataIndex].id}`}>
              <IconButton>
                <Icon>edit</Icon>
              </IconButton>
            </Link>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Event', path: '/' },
                { name: 'Event List' },
              ]}
            />
          </div>

          <div className="">
            <Link
              to="/events/NewEvent"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Add new event
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Events"
            columns={columns}
            items={items}
            view="event?"
            historyReplace="/events/list"
            singlePage=""
            search={async (querys) => {
              const { data } = await bc.events().getAcademyEvents(querys);
              setItems(data.results);
              return data;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventList;
