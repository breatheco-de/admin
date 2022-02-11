import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@material-ui/core";
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import dayjs from 'dayjs';
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

export const WebhookInfo = () => {
  const [items, setItems] = useState([]);
  
  // do not delete, will be used later
  // useEffect(()=>{
  //   const getWebhooks = async () => {
  //     try{
  //       const { data } = await bc.events().getEventbriteWebhook();
  //       console.log(data, 'eventbrite webhooks');
  //     } catch (error){
  //       console.log(error);
  //       return error
  //     }
  //   }
  //   getWebhooks();
  // }, []);

  const columns = [
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
                  {item.created_at ? dayjs(item.created_at).format('MM-DD-YYYY') : '-'}
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
        />
      </Grid>
      <Grid item md={12} className="mt-2">
        <SmartMUIDataTable
          title="All Webhooks"
          columns={columns}
          items={items}
          search={async (querys) => {
            const { data } = await bc.events().getEventbriteWebhook(querys);
            setItems(data.results);
            return data;
          }}
        />
        {/* <Table>
          <TableHead>
            <TableRow>
              <TableCell className="pl-sm-24">#</TableCell>
              <TableCell className="px-0">Action</TableCell>
              <TableCell className="px-0">Status</TableCell>
              <TableCell className="px-0">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="pl-sm-24 capitalize" align="left">
                1
              </TableCell>
              <TableCell className="pl-0 capitalize" align="left">
                order.placed
              </TableCell>
              <TableCell className="pl-0 capitalize" align="left">
                <small className="border-radius-4 px-2 pt-2px text-white bg-warning">
                  Error
                </small>
              </TableCell>
              <TableCell className="pl-0">5 days ago</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-sm-24 capitalize" align="left">
                1
              </TableCell>
              <TableCell className="pl-0 capitalize" align="left">
                order.placed
              </TableCell>
              <TableCell className="pl-0 capitalize" align="left">
                <small className="border-radius-4 px-2 pt-2px text-white bg-error">
                  Error
                </small>
              </TableCell>
              <TableCell className="pl-0">5 days ago</TableCell>
            </TableRow>
          </TableBody>
        </Table> */}
      </Grid>
    </Card>
  );
};
