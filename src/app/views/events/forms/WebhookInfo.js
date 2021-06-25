import React from 'react';
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
} from '@material-ui/core';

export const WebhookInfo = ({ initialValues }) => (
  <Card container className="p-4">
    <div className="flex p-4">
      <h4 className="m-0">Webhook Log</h4>
    </div>
    <Divider className="mb-2 flex" />
    <Grid item md={12}>
      Please add the following URL as an Eventbrite Webhook to start collecting actions like ticket orders, attandancy, etc.
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
      <Table>
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
              <small className={'border-radius-4 px-2 pt-2px ' + 'text-white bg-warning'}>Error</small>
            </TableCell>
            <TableCell className="pl-0">
              5 days ago
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="pl-sm-24 capitalize" align="left">
              1
            </TableCell>
            <TableCell className="pl-0 capitalize" align="left">
              order.placed
            </TableCell>
            <TableCell className="pl-0 capitalize" align="left">
              <small className={'border-radius-4 px-2 pt-2px ' + 'text-white bg-error'}>Error</small>
            </TableCell>
            <TableCell className="pl-0">
              5 days ago
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  </Card>
);
