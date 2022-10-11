import React, { useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  Card,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import * as Yup from 'yup';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import config from '../../../../config.js';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

export const Tags = ({ organization }) => {
  const [items, setItems] = useState([]);
  const [disputeIndex, setDisputeIndex] = useState(null);
  const [disputedReason, setDisputedReason] = useState('');

  const ProfileSchema = Yup.object().shape({
    disputedReason: Yup.string().required('Please write the Disputed Reason'),
  });

  const columns = [
    {
      name: 'slug', // field name in the row object
      label: 'slug', // column title that will be shown in table
      options: {
        filter: false,
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
                {item.disputed_at ? (
                  <Tooltip title={item.disputed_reason}>
                    <small className={`border-radius-4 px-2 pt-2px text-white bg-error`}>
                      DISPUTED
                    </small>
                  </Tooltip>
                ) : (
                  <small className={`border-radius-4 px-2 pt-2px${statusColors[value]}`}>
                    APPROVED
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
        filter: false,
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
    {
      name: 'disputed',
      label: ' ',
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              <div className="flex items-center">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => setDisputeIndex(dataIndex)}
                >
                  Dispute
                </Button>
              </div>
            </>
          );
        },
      },
    },
  ]

  return (
    <Card container className="p-4">
      <SmartMUIDataTable
        title="All Tags"
        columns={columns}
        items={items}
        options={{
          selectableRows: false,
          print: false,
          viewColumns: false,
        }}
        search={async (querys) => {
          const { data } = await bc.marketing().getAcademyTags(querys);
          setItems(data.results || data);
          return data;
        }}
      />
      <Dialog
        onClose={() => {
          setDisputeIndex(null);
        }}
        // fullWidth
        maxWidth="md"

        open={disputeIndex !== null}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">
          Write the dispute reason
        </DialogTitle>
        <Formik
          initialValues={{
            disputedReason,
          }}
          enableReinitialize
          validationSchema={ProfileSchema}
          onSubmit={async (values) => {

            const tag = items[disputeIndex];

            const disputedAt = new Date();
            const data = {
              disputed_reason: disputedReason,
              disputed_at: disputedAt,
            };

            const result = await bc.marketing().updateAcademyTags(tag.slug, data);

            if (result.status >= 200 && result.status < 300) {
              const newItems = items;
              newItems[disputeIndex] = {
                ...newItems[disputeIndex],
                ...data
              };
              setItems(newItems);
            }
            setDisputeIndex(null);
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="d-flex justify-content-center mt-0 p-4"
            >
              <DialogContent>
                <DialogContentText>
                  Disputed Reason:
                </DialogContentText>
                <TextField
                  error={errors.disputedReason && touched.disputedReason}
                  helperText={touched.disputedReason && errors.disputedReason}
                  name="disputedReason"
                  size="small"
                  variant="outlined"
                  value={disputedReason}
                  onChange={(e) => setDisputedReason(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button color="primary" variant="contained" type="submit">
                  Send now
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Card>
  );
};
