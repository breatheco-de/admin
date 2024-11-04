import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  Tooltip,
  Grid,
  DialogTitle,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { toast } from 'react-toastify';
import { openDialog } from 'app/redux/actions/DialogActions';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};
const roleColors = {
  admin: 'text-black bg-gray',
};

const Syllabus = () => {
  const [list, setList] = useState([]);
  const [exportDialog, setExportDialog] = useState(false);

  const columns = [
    {
      name: 'name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={item?.logo} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{item?.name}</h5>
                <small className="text-muted">{item?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'owner',
      label: 'Owner',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return(
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{item?.academy_owner?.name}</h5>
            </div>
          </div>
        )},
      },
    },
    {
      name: 'private',
      label: 'Private',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              {item?.private? <Tooltip title="This syllabus is not shared with other academies">
                <Icon>lock</Icon>
                {/** <Icon>lock_open</Icon> */}
              </Tooltip> : (
                <p>Not Private</p>
              )}
            </div>
          );
        },
      },
    },
    {
      name: 'duration',
      label: 'Duration',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { duration_in_hours, duration_in_days, week_hours } = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {`${duration_in_hours} hours, ${Math.trunc(duration_in_hours / week_hours) || 0} `
                  + `weeks, ${duration_in_days} days`}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = list[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
                <Tooltip title="Download Syllabus">
                  <IconButton onClick={() => setExportDialog({ item, class_days_per_week: 3 })}>
                  <Icon>download</Icon>
                </IconButton>
              </Tooltip>
              <Link to={`/admissions/syllabus/${item.slug}`}>
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

  const downloadSyllabus = async (_export) => {

      const { data } = await bc.admissions().getSyllabusVersionCSV(_export.item.slug, 'latest', { class_days_per_week: _export.class_days_per_week });
      console.log("csv", data);
      // Create a new Blob object from the response data
      const blob = new Blob([data], { type: 'text/csv' });
  
      // Create a URL for the Blob and create an anchor to download it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${_export.item.slug}_export.csv`; // Set the desired file name
  
      // Append the anchor to the DOM and trigger the click to start the download
      document.body.appendChild(a);
      a.click();
      // Clean up by revoking the Object URL and removing the anchor from the DOM
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true
  }

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Admissions', path: '/' }, { name: 'Syllabus' }]} />
          </div>

          <div className="">
            <Link to="/admissions/syllabus/new">
              <Button variant="contained" color="primary">
                Add new syllabus
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Syllabus"
            columns={columns}
            items={list}
            view="syllabus?"
            singlePage=""
            historyReplace="/admissions/syllabus"
            search={async (querys) => {
              const { data } = await bc.admissions().getAllAcademySyllabus(querys);
              setList(data.results);
              return data;
            }}
            deleting={async (querys) => {
              const { status } = await bc
                .admissions()
                .deleteStaffBulk(querys);
              return status;
            }}
          />
        </div>
      </div>
      <Dialog
        open={exportDialog}
        onClose={() => setExportDialog(false)}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <form className="p-4">
          <DialogTitle id="form-dialog-title">Download Syllabus as CSV</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item md={12} sm={12} xs={10}>
                <TextField
                  label="How many classes per week?"
                  name="class_days_per_week"
                  type="number"
                  size="medium"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    setExportDialog({ ...exportDialog, class_days_per_week: e.target.value });
                  }}
                  value={exportDialog.class_days_per_week}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Grid className="p-2">
            <DialogActions>
              <Button
                className="bg-primary text-white"
                onClick={() => {
                  downloadSyllabus(exportDialog)
                    .then(() => {
                      toast.success('Download Started Successfully', toastOption);
                    })
                    .catch((error) => {
                      console.error('There was an error downloading the CSV!', error);
                      toast.error('There was an error downloading the CSV!');
                    });
                }}
                autoFocus
              >
                Download
              </Button>
              <Button color="danger" variant="contained" onClick={() => setExportDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Grid>
        </form>
      </Dialog>
    </div>
  );
};

export default Syllabus;
