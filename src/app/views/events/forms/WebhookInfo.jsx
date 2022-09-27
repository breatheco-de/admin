import React, { useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  Card,
  Tooltip,
} from "@material-ui/core";
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import dayjs from 'dayjs';
import config from 'config.js';
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

export const WebhookInfo = ({ organization }) => {
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
      name: 'action', // field name in the row object
      label: 'Action', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].action,
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {item.status_text !== null ? (
                  <Tooltip title={item.status_text}>
                    <small className={`border-radius-4 px-2 pt-2px${statusColors[value]}`}>
                      {String(value).toUpperCase()}
                    </small>
                  </Tooltip>
                ) : (
                  <small className={`border-radius-4 px-2 pt-2px${statusColors[value]}`}>
                    {String(value).toUpperCase()}
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'created_at',
      label: 'Date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];

          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.updated_at ? `${dayjs(item.updated_at).fromNow(true)} ago` : '-'}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
  ]

  return (
    <Card container className="p-4">
      <div className="flex p-4">
        <h4 className="m-0">Webhook Log</h4>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
        Please add the following URL as an Eventbrite Webhook to start
        collecting actions like ticket orders, attandancy, etc.
      </Grid>
      <Grid item md={12} className="mt-2">
        <TextField
          fullWidth
          label="Webhook URL"
          name="webhook_url"
          size="small"
          type="text"
          variant="outlined"
          value={organization.id !== '' ? 
            `${config.REACT_APP_API_HOST}/eventbrite/webhook/${organization.id}` 
            : 'No organization'
          }
        />
      </Grid>
      <Grid item md={12} className="mt-2">
        <SmartMUIDataTable
          title="All Webhooks"
          columns={columns}
          items={items}
          options={{
            selectableRows: false
          }}
          search={async (querys) => {
            const { data } = await bc.events().getEventbriteWebhook(querys);
            setItems(data.results);
            return data;
          }}
        />
      </Grid>
    </Card>
  );
};
