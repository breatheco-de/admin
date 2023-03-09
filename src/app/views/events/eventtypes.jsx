import React, { useState } from 'react';
import {
  Icon,
  IconButton,
  Button,
  Card,
Tooltip  ,
Avatar,
  Grid,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import A from '@material-ui/core/Link';
import ReactCountryFlag from "react-country-flag"
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../../matx';
import { getSession } from '../../redux/actions/SessionActions';
import bc from '../../services/breathecode';
import { SmartMUIDataTable } from '../../components/SmartDataTable';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const EventTypeList = () => {
  const session = getSession();

  const [items, setItems] = useState([]);

  const columns = [
    {
      name: 'name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
              <ReactCountryFlag className="text-muted mr-2"
                  countryCode={
                    (item?.lang.toUpperCase() == 'EN' || item?.lang.toUpperCase() == 'US'  ? 'US'
                    : 'ES'
                    )
                  } svg
                  style={{
                    fontSize: '10px',
                  }}
                />
                <h5 className="my-0 text-15">{item?.name}</h5>
                
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'slug', // field name in the row object
      label: 'Slug', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${item?.slug}`}>
                  {item?.slug}
                </small>
                <br />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'description', // field name in the row object
      label: 'Description', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${item?.description}`}>
                  {item?.description}
                </small>
                <br />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'academy', // field name in the row object
      label: 'Academy', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${item?.academy.name}`}>
                  {item?.academy.name}
                </small>
                <br />
              </div>
            </div>
          );
        },
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
            <Link to={`/events/eventype/${items[dataIndex].slug}`}>
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
              <Breadcrumb routeSegments={[{ name: 'Event', path: '/' }, { name: 'Event Types' }]} />
            </div>
            <div className="">
              <Link to="/events/NewEventType" color="primary" className="btn btn-primary">
                <Button variant="contained" color="primary">
                  Add Event Type
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <div className="min-w-750">
            <SmartMUIDataTable
              title="Event Types"
              columns={columns}
              items={items}
              view="event?"
              historyReplace="/events/eventype"
              singlePage=""
              search={async (querys) => {
                const { data } = await bc.events().getAcademyEventType(querys);
                setItems(data);
                return data;
              }}
              deleting={async (querys) => {
                const { status } = await bc.events().deleteAcademyEventTypes(querys);
                return status;
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventTypeList;
