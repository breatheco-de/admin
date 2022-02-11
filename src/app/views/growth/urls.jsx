import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { Link, useHistory } from 'react-router-dom';
import {
  Icon, 
  IconButton, 
  Tooltip, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Switch,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import UrlForm from './short-form/UrlForm';
import UpdateUrl from './short-form/UpdateUrl';
import bc from '../../services/breathecode';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  NOT_FOUND: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle 
      sx={{ m: 0}} 
      style={{padding:0, display:'flex', justifyContent:'flex-end'}} 
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Icon>close</Icon>
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Leads = () => {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState({ msg: '', open: false, onSuccess: null });
  const [createUrl, setCreateUrl] = useState(true);
  const history = useHistory();

  const columns = [
    {
      name: 'slug', // field name in the row object
      label: 'Slug', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const short = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {short?.slug}
              </h5>
              <small className="text-muted underline pointer" onClick={() => { 
                  navigator.clipboard.writeText(`https://s.4geeks.co/s/${short?.slug}`);
                  toast.success('URL copied successfuly', toastOption);
              }}>https://s.4geeks.co/a/{short?.slug || short.slug}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'destination_status',
      label: 'Destination Status',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {item.destination_status_text !== null ? (
                  <Tooltip title={item.destination_status_text}>
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
      name: 'hits',
      label: 'Hits',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (dataIndex) => (
          <span>
            {items[dataIndex].hits}
          </span>
        ),
      },
    },
    {
      name: 'active',
      label: 'Active',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (

            <div className="flex items-center">
              <div className="ml-0">
                <Switch
                  onChange={async () => {
                    const resp = await bc.marketing().updateShort({
                      ...item,
                      active: !item.active,
                    });
                    if (resp.status === 200) {
                      setItems(items.map((it) => {
                        if (it.id !== item.id) return it;
                        return { ...it, active: !it.active };
                      }));
                    }
                  }}
                  checked={item.active}
                  color="secondary"
                  size="small"
                />
                <small>{item.active ? "Active" : "Blocked (404)"}</small>
              </div>
            </div>
          )
        }
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
              <Tooltip title="Copy Destination URL">
                <IconButton onClick={() => {
                  navigator.clipboard.writeText(item.destination);
                  toast.success('URL copied successfuly', toastOption);
                }}
                >
                  <Icon>link</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit URL">
                  <IconButton onClick={() => {
                    if (item.id) history.push(`/growth/urls/${item.slug}`)
                  }}>
                    <Icon>edit</Icon>
                  </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  const handleClose = () => {
    setCreateUrl(false);
  }
  
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Growth", path: "/Growth" },
                { name: "URL Shortner", path: "/growth/urls" },
              ]}
            />
          </div>
          <div className="">
            <Link
              to="/growth/newshort"
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
      <div className="add-new-url" style={{ marginBottom: "15px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateUrl(true)}
        >
          Create new url
        </Button>
      </div>
      <div>
        <SmartMUIDataTable
          title="URL Shortener"
          columns={columns}
          items={items}
          search={async (querys) => {
            const { data } = await bc.marketing().getAcademyShort(querys);
            setItems(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc.marketing().deleteShortsBulk(querys);
            return status;
          }}
        />
      </div>
      {/* ADD URL DIALOG */}
      {/* <Dialog
        open={createUrl}
        onClose={() => setCreateUrl(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          size="small"
          onClick={() => {
            setCreateUrl(false);
          }}
        >
          <Icon>close</Icon>
        </IconButton>
        <DialogActions>
          <UrlForm />
        </DialogActions>
      </Dialog> */}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={createUrl}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} />
        <Grid md={12}>
          <UrlForm />
        </Grid>
        <Grid md={12}>
          <UpdateUrl />
        </Grid>
      </Dialog>
      {/* ADD URL DIALOG */}
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog({ msg: "", open: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{openDialog.msg}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog({ msg: "", open: false })}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Leads;
