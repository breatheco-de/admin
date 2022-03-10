import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Icon,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
  TableCell,
  CustomColumn,
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

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0 }}
      style={{ padding: 0, display: 'flex', justifyContent: 'flex-end' }}
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
  const [createUrl, setCreateUrl] = useState(false);
  const [updateUrl, setUpdateUrl] = useState({ open: false, item: {} });
  const [utmFiels, setUtmFields] = useState({
    SOURCE: [],
    CAMPAIGN: [],
    MEDIUM: [],
    CONTENT: []
  });

  const addUrl = (url) => {
    setItems([url, ...items]);
  }

  const updateTable = (url) => {
    const pos = items.map((e) => { return e.id; }).indexOf(url.id);

    items[pos].slug = url.slug;
  }

  useEffect(() => {
    const getUtm = async () => {
      try {
        const { data } = await bc.marketing().getAcademyUtm();

        data.map((item) => {
          utmFiels[item.utm_type].push(item);
        });

      } catch (error) {

        return error;
      }
    };
    getUtm();
  }, []);

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
                toast.success('Short URL copied successfuly', toastOption);
              }}>Copy shortened URL</small>
            </div>
          );
        },
      },
    },
    {
      name: 'destination_status',
      label: 'Destination',
      options: {
        filter: true,
        filterType: 'multiselect',
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "300px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div>
              <div>
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
              <Tooltip title={item.destination}>
                <small className="text-muted underline pointer" onClick={() => {
                  navigator.clipboard.writeText(item.destination);
                  toast.success('Original URL copied successfuly', toastOption);
                }}>{item.destination.substring(0, 50)}{item.destination.length > 50 && "..."}</small>
              </Tooltip>
            </div >
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
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "70px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => (
          <span>
            {items[dataIndex].hits}
          </span>
        ),
      },
    },
    {
      name: 'utms',
      label: 'UTMs',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (

            <div className="flex items-center">
              <div className="ml-0">
                <span className={`ellipsis border-radius-4 px-1 text-center bg-gray`}>{item.utm_source}</span>
                <span className={`ellipsis border-radius-4 px-1 text-center bg-gray`}>{item.utm_content}</span>
                <span className={`ellipsis border-radius-4 px-1 text-center bg-gray`}>{item.utm_campaign}</span>
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

              <Tooltip title={item.active ? "Active" : "Blocked (404)"}>
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
              </Tooltip>
              <Tooltip title="Edit URL">
                <IconButton onClick={() => {
                  if (item.id) setUpdateUrl({ open: true, item })
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
    setUpdateUrl({ open: false, item: {} })
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateUrl(true)}
            >
              Add new url
            </Button>
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
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc.marketing().deleteShortsBulk(querys);
            return status;
          }}
        />
      </div>

      {/* ADD AND UPDATE URL DIALOG */}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={createUrl || updateUrl.open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        />
        <Grid md={12}>
          {createUrl ? (
            <UrlForm utmFiels={utmFiels} handleClose={handleClose} addUrl={addUrl} />
          ) : (
            <UpdateUrl item={updateUrl.item} handleClose={handleClose} updateTable={updateTable} />
          )}
        </Grid>
      </Dialog>
      {/* ADD AND UPDATE URL DIALOG */}

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
