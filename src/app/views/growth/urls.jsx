import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import { Link } from 'react-router-dom';
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
  Grid
} from '@material-ui/core';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import UrlForm from './short-form/UrlForm';
import UpdateUrl from './short-form/UpdateUrl';
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
      name: 'id', // field name in the row object
      label: 'Id', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const short = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {`${short.id}`}
              </h5>
              <small className="text-muted">{short?.slug || short.slug}</small>
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
            {items[dataIndex].slug
              ? items[dataIndex].slug
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
                  const resp = await bc.marketing().getAcademyShort(item);
                  
                  console.log("This is RESP####", resp.data[0].destination)
                  
                  if (resp.headers['content-type'] == 'application/json') {
                    if (resp.status === 404) {
                      setOpenDialog({
                        open: true,
                        msg: 'An error has occurred, the URL does not work correctly. Contact the marketing department to verify that the address is still in use.',
                        onSuccess: () => {
                          window.open(resp.data[0].destination, '_blank');
                        },
                      });
                    } else if (resp.status === 200) {
                      
                      window.open(resp.data[0].destination, '_blank');
                      
                    }
                  }
                }}
                >
                  <Icon>link</Icon>
                </IconButton>
              </Tooltip>
              )}
              <Tooltip title="Edit URL">
                {/* <Link to={`/growth/newshort/${item.slug}`}> */}
                  <IconButton onClick={async () => {
                    
                    if (item.id) {
                      console.log("This is item####", item.slug)
                      history.push(`/growth/urls/${item.slug}`)
                    }
                    }}>
                    <Icon>edit</Icon>
                  </IconButton>
                {/* </Link> */}
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
            console.log("This is  DATA #### ", data);
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
