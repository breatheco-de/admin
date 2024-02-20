import React, { useState } from 'react';
import {
  Icon,
  IconButton,
  Button,
  Card,
  TextField,
  InputAdornment,
  Tooltip,
} from '@material-ui/core';
import { getParams } from '../../components/SmartDataTable';
import DeleteOutlineRounded from '@material-ui/icons/DeleteOutlineRounded';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import A from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../../matx';
import { getSession } from '../../redux/actions/SessionActions';
import bc from '../../services/breathecode';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import BulkAction from '../../components/BulkAction';
import AddBulkToEvents from './forms/AddBulkToEvents';

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

  const thisURL = `https://breathecode.herokuapp.com/v1/events/ical/events?academy=${session.academy.id}`;

  const loadData = async (querys) => {
    const { data } = await bc.events().getAcademyEvents(querys);
    setItems(data.results || data);
    return data;
  }

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
            <Link to={`/events/event/${items[dataIndex].id}`}>
              <IconButton>
                <Icon>arrow_right_alt</Icon>
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
              <div style={{ width: '100%' }}>
                <h5 className="mt-0 mb-2 font-medium text-primary">
                  You can add this events to your calendar using this URL:
                </h5>
                <TextField
                  fullWidth
                  name="events"
                  size="small"
                  type="text"
                  variant="outlined"
                  value={thisURL}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="copy"
                          onClick={() => {
                            navigator.clipboard.writeText(thisURL);
                            toast.success('Calendar link url copied successfuly', toastOption);
                          }}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              {/* <div className="flex-grow" />
              <Tooltip title="Copy link">
                <Button
                  variant="outlined"
                  color="primary"
                  className="text-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(thisURL);
                    toast.success('Calendar link url copied successfuly', toastOption);
                  }}
                  autoFocus
                >
                  Copy
                </Button>
              </Tooltip> */}
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
              search={loadData}
              options={{
                print: false,
                customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                  return (
                    <div className='ml-auto'>
                      <AddBulkToEvents
                        selectedRows={selectedRows}
                        displayData={displayData}
                        setSelectedRows={setSelectedRows}
                        items={items}
                        setItems={setItems}
                        loadData={loadData}
                      />
                      <BulkAction
                        title="Delete event"
                        iconComponent={DeleteOutlineRounded}
                        onConfirm={async (ids) => {
                          const { status } = await bc.events().deleteEventsBulk(ids);
                          loadData({ limit: 10, offset: 0, ...getParams() });
                        }}
                        selectedRows={selectedRows}
                        items={items}
                      />
                    </div>
                  )
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventList;
