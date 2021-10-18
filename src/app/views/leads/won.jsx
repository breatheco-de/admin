import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
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
      label: 'Name', // column title that will be shown in table
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
      name: 'course',
      label: 'Course',
      options: {
        display: false,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].course}</span>
        ),
      },
    },
    {
      name: 'lead_type',
      label: 'Lead Type',
      options: {
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].lead_type
              ? items[dataIndex].lead_type
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'course',
      label: 'Course',
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
      name: 'expected-cohort',
      label: 'Exp. Cohort',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].ac_expected_cohort}</span>
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
              <Tooltip title="Invite to 4Geeks">
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
                  <Icon>person_add</Icon>
                </IconButton>
              </Tooltip>
              )}
              <Tooltip title="More details">
                <IconButton onClick={() => item.user && history.push(`/admissions/students/${item.user.id}`)}>
                  <Icon>arrow_right_alt</Icon>
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
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="Won leads sorted by creation date"
          columns={columns}
          items={items}
          search={async (querys) => {
            const { data } = await bc.marketing().getAcademyLeads({ deal_status: 'won', ...querys });
            setItems(data.results);
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
