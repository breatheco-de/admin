import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { Link } from 'react-router-dom';
import {
  Icon, IconButton, Tooltip, Chip,
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import bc from '../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  // INACTIVE: 'gray',
  // PREWORK: 'main',
  added: 'primary',
  not_added: 'gray',
  // ENDED: 'dark',
  // DELETED: 'gray',
};

const Leads = () => {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState({ msg: '', open: false, onSuccess: null });
  const history = useHistory();

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Id', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const lead = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {`${lead.first_name} ${lead.last_name}`}
              </h5>
              <small className="text-muted">{lead?.email || lead.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      options: {
        display: false,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].course}</span>
        ),
      },
    },
   
    {
      name: 'slug',
      label: 'Slug',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (dataIndex) => (
          <span
            className="ellipsis"
          >
            {items[dataIndex].course
              ? items[dataIndex].course
              : '---'}
          </span>
        ),
      },
    },
    
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <Chip
              size="small"
              label={item.user ? 'Added' : 'Not added'}
              color={stageColors[item.user ? 'added' : 'not_added']}
            />
          );
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              {item.user == null && (
              <Tooltip title="Open URL">
                <IconButton onClick={async () => {
                  const resp = await bc.auth().getAcademyMember(item.email);
                  if (resp.headers['content-type'] == 'application/json') {
                    if (resp.status === 404) {
                      setOpenDialog({
                        open: true,
                        msg: 'There is no member with this email, would you like to invite it to the academy?',
                        onSuccess: () => {
                          history.push(`/admissions/students/new?data=${btoa(JSON.stringify({
                            email: item.email, first_name: item.first_name, last_name: item.last_name, phone: item.phone,
                          }))}`);
                        },
                      });
                    } else if (resp.status === 200) {
                      setOpenDialog({
                        msg: 'Please choose a cohort for this user',
                        open: true,
                      });
                    }
                  }
                }}
                >
                  <Icon>link</Icon>
                </IconButton>
              </Tooltip>
              )}
              <Tooltip title="Edit URL">
                <IconButton onClick={() => item.user && history.push(`/admissions/students/${item.user.id}`)}>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            </div>
          );
        },
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
                { name: 'Pages', path: '/leads/won' },
                { name: 'Order List' },
              ]}
            />
          </div>
          <div className="">
            <Link
              to="/growth/sales/new"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Add new url
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="URL Shortener"
          columns={columns}
          items={items}
          search={async (querys) => {
            const { data } = await bc.marketing().getAcademyShort(querys);
            setItems(data.results);
            console.log("ESTA ES LA DATA #### ", data)
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc
              .admissions()
              .deleteStudentBulk(querys);
            return status;
          }}
        />
      </div>
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog({ msg: '', open: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {openDialog.msg}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog({ msg: '', open: false })} color="primary">
            Disagree
          </Button>
          <Button color="primary" autoFocus onClick={() => openDialog.onSuccess && openDialog.onSuccess()}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Leads;
