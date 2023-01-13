import React, { useState } from "react";
import {
  TextField,
  Card,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import * as Yup from 'yup';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import BulkUpdateTag from './BulkUpdateTag';
import { useQuery } from '../../../hooks/useQuery';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

const tagTpes = [
  'STRONG',
  'SOFT',
  'DISCOVERY',
  'COHORT',
  'DOWNLOADABLE',
  'EVENT',
  'OTHER'
];

export const Tags = () => {
  const query = useQuery();
  const [items, setItems] = useState([]);
  const [disputeIndex, setDisputeIndex] = useState(null);
  const [disputedReason, setDisputedReason] = useState('');

  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }

  const deleteTime = (disputed_at) => {

    const disputed = new Date(disputed_at);
    const tenDays = disputed.addDays(10);

    if ((tenDays - new Date()) / (1000 * 60 * 60 * 24) > 1) {
      const timeFromNow = dayjs(tenDays).fromNow(true);
      return `Will de deleted in ${timeFromNow}`;
    } else return 'Will be deleted today';
  }

  const ProfileSchema = Yup.object().shape({
    disputedReason: Yup.string().required('Please write the Disputed Reason'),
  });

  const columns = [
    {
      name: 'slug', // field name in the row object
      label: 'slug', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <>
              <div className="text-center">
                <p className="mb-1">{item.slug}</p>
                <small className="text-muted">{item.tag_type}</small>
              </div>
            </>
          );
        },
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        filterType: "dropdown",
        filterList: query.get('status') !== null ? [query.get('status')] : [],
        filterOptions: {
          names: ['APROVED', 'DISPUTED']
        },
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {item.disputed_at ? (
                  <>
                    <Tooltip title={`${item.disputed_reason}. Disputed ${dayjs(item.disputed_at).fromNow()}`}>
                      <small className={`border-radius-4 px-2 pt-2px text-white bg-error`}>
                        DISPUTED
                      </small>
                    </Tooltip>
                    <small className="block text-muted">{deleteTime(item.disputed_at)}</small>
                  </>

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
      label: 'Created At',
      options: {
        filter: false,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.created_at ? dayjs(item.created_at).format('MM-DD-YYYY') : '--'}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'disputed',
      label: '',
      options: {
        filter: false,
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
    {
      name: 'type',
      label: '',
      options: {
        display: 'excluded',
        filter: true,
        filterType: 'dropdown',
        filterList: query.get('type') !== null ? [query.get('type')] : [],
        filterOptions: {
          names: tagTpes,
        },
      },
    },
  ];

  const getTypes = () => {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        resolve(tagTpes);
      }, 500);
    });
  }

  const loadData = async (querys) => {
    const { data } = await bc.marketing().getAcademyTags(querys);
    setItems(data.results || data);
    return data;
  };

  return (
    <Card container className="p-4">
      <SmartMUIDataTable
        title="All Tags"
        columns={columns}
        items={items}
        historyReplace="/growth/settings"
        options={{
          print: false,
          viewColumns: false,
          customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <BulkUpdateTag
              selectedRows={selectedRows}
              displayData={displayData}
              setSelectedRows={setSelectedRows}
              items={items}
              setItems={setItems}
              loadData={loadData}
              asyncSearch={getTypes}
            />
          ),
        }}
        search={loadData}
      />
      <Dialog
        onClose={() => {
          setDisputeIndex(null);
          setDisputedReason('');
        }}
        // fullWidth
        // maxWidth="md"

        open={disputeIndex !== null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
            setDisputedReason('');
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="d-flex justify-content-center mt-0"
            >
              <DialogTitle id="simple-dialog-title">
                Write the dispute reason
                <div className="mt-4">
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
                </div>
              </DialogTitle>
              <DialogActions>
                <Button
                  onClick={() => {
                    setDisputeIndex(null);
                    setDisputedReason('');
                  }}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" autoFocus >
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
