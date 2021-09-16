import React, { useState } from 'react';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import {
  Icon,
  IconButton,
  Button,
  Card,
  Tooltip,
  Grid,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  TextField
} from '@material-ui/core';
import A from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Breadcrumb } from '../../../matx';
import { getSession } from "../../redux/actions/SessionActions";
import bc from '../../services/breathecode';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  DRAFT: 'bg-gray',
  STARTED: 'text-white bg-warning',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const EventList = () => {

  const session = getSession();

  const [items, setItems] = useState([]);
  
  const thisURL = `https://breathecode.herokuapp.com/v1/events/ical/events?academy=${session.academy.id}`

  const [openDialog, setOpenDialog] = useState(false);
  const [url, setUrl] = useState('');

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
                <small className={`border-radius-4 px-2 pt-2px ${stageColors[item?.status]}`}>
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
              <h5 className="my-0 text-15">{dayjs(items[i].starting_at).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].starting_at).fromNow()}</small>
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
              <h5 className="my-0 text-15">{dayjs(items[i].ending_at).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].ending_at).fromNow()}</small>
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
    <>
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <Breadcrumb routeSegments={[{ name: 'Event', path: '/' }, { name: 'Event List' }]} />
            </div>

            <div className="">
              <Link to="/events/NewEvent" color="primary" className="btn btn-primary">
                <Button variant="contained" color="primary">
                  Add new event
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <Card className="p-6 mb-5 bg-light-primary box-shadow-none">
            <div className="flex items-center">
              <div>
                <h5 className="mt-0 mb-2 font-medium text-primary">
                  You can add this events to your calendar using this URL:
                </h5>
                <p className="alert-link">
                  {thisURL}
                </p>
              </div>
              <div className="flex-grow" />
              <Tooltip title="Copy link">
                <Button
                  variant="outlined" color="primary"
                  className="text-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(thisURL);
                    toast.success('Calendar link url copied successfuly', toastOption);
                  }}
                  autoFocus
                >
                  Copy
                </Button>
              </Tooltip>
            </div>
          </Card>
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
    </>
  );
};

export default EventList;
