import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Button,
  Icon,
  Chip,
  DialogContent,
  IconButton,
  Badge,
  Card,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import history from "history.js";
import bc from 'app/services/breathecode';
import Alert from "../../../components/Alert"
import ReactCountryFlag from "react-country-flag"
import getRepoUrlFromFilePath from "../../../utils/getRepoURL";
import { PickAssetModal } from './PickAssetModal';
import dayjs from 'dayjs';
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

let getStatusColor = (status) => {
  switch(status){
    case "CRITICAL":
      return "bg-danger text-white"
    case "OPERATIONAL":
      return "bg-success text-white"
    default:
      return ""
  }
}

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.grey[500]
  }
});

const dialogStyles = theme => ({
  root: {
    minWidth: "400px",
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, subscriptions, onClick, onAdd } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onAdd && <Button onClick={() => onAdd && onAdd(true)} className={classes.closeButton} variant="text">
        <Icon fontSize="small">add</Icon>
        <span className="ml-2">Add</span>
      </Button>}
    </MuiDialogTitle>
  );
});

const Modal = withStyles(dialogStyles)(({
  subscriptions,
  repo_url,
  autoSync,
  onClose,
  classes
}) => {

  const [ _subs, setSubs ] = useState([])
  const url = getRepoUrlFromFilePath(repo_url);

  const loadSubscriptions = async () => {
    const resp = await bc
      .monitoring()
      .getAllRepoSubscriptions({ repository: url?.repo });
      
    if (resp.status >= 200 && resp.status < 300) {
      setSubs(resp.data);
    }
  };

  const updateSubscription = async (id, payload) => {
    const validStatus = ['DISABLED', 'OPERATIONAL'];
    if(payload && payload.status && !validStatus.includes(payload.status)) throw Error(`Invalid status ${payload.status} for subscription`);

    const resp = await bc.monitoring().updateRepoSubscription(id, { status: payload?.status })
    if(resp.status == 201) {
      loadSubscriptions();
      return true;
    }
  }

  const createSubscription = async (_url) => {
    const resp = await bc.monitoring().createRepoSubscription({ repository: _url })
    if(resp.status == 201) {
      loadSubscriptions();
      return true;
    }
  }

  useEffect(() => {
    if(autoSync && !subscriptions) loadSubscriptions();
    else if(Array.isArray(subscriptions)) setSubs(subscriptions);

  }, [autoSync, subscriptions])

  return (
    <>
      <Dialog
        open={true}
        width="400px"
        className={classes.root}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="ml-2 d-flex" id="alert-dialog-title">
          Repository Subscriptions
        </DialogTitle>
        <DialogContent className='mb-3'>
            {_subs.length == 0 ? 
              !repo_url ? 
              <p>
                This asset is not associated with any repository, please specify the README or JSON file URL on Github.
              </p>
              :
              <p>
                The asset repository does not have any subscription associated with this academy.
                <TextField
                  label="Repository URL"
                  name="url"
                  size="medium"
                  disabled
                  fullWidth
                  margin='normal'
                  variant="outlined"
                  value={repo_url}
                />
                <Button variant="contained" color='primary' fullWidth onClick={() => createSubscription(repo_url)}>Create a subscription for this repo</Button>
              </p>
              :
              _subs.map(s => 
                <Card className='p-4 mb-2'>
                  <h6 className='mb-0'>
                    Subscription {s.id}
                    <Chip
                      className={`ml-1 ${getStatusColor(s.status)}`} size="small"
                      label={s.status}
                    />

                    {['CRITICAL', 'OPERATIONAL'].includes(s.status) ? 
                      <IconButton
                        onClick={() => updateSubscription(s.id, { status: "DISABLED" })}
                      >
                        <Tooltip title={"Click to disable"}>
                          <Icon>delete</Icon>
                        </Tooltip>
                      </IconButton>
                      :
                      <IconButton
                        onClick={() => updateSubscription(s.id, { status: "OPERATIONAL" })}
                      >
                        <Tooltip title={"Click to activate"}>
                          <Icon>add</Icon>
                        </Tooltip>
                      </IconButton>
                    }
                  </h6>
                  {s.status == "CRITICAL" && <small className='d-block'>{s.status_message}</small>}
                  <small className='d-block'>{ s.last_call ? dayjs(s.last_call).fromNow() : "Subscription has never been called by GitHub"}</small>
                  <small className='d-block anchor underline pointer'>
                    <a target="_blank" href={`${repo_url}/settings/hooks/${s.hook_id || ""}`}>{s.repository}</a>
                  </small>
                </Card>
            )}
        </DialogContent>
      </Dialog>
    </>
  )
})


export const RepositorySubscriptionIcon = ({ repo_url }) => {

  const url = getRepoUrlFromFilePath(repo_url);
  const [syncWebhooks, setSyncWebhooks] = useState([]);
  const [openSyncWebhooks, setOpenSyncWebooks] = useState(null);

  const loadWebhooks = async () => {
    
    if(!url?.repo) return false;
    
    const resp = await bc
      .monitoring()
      .getAllRepoSubscriptions({ repository: url.repo });
      
    if (resp.status >= 200 && resp.status < 300) {
      setSyncWebhooks(resp.data);
    }
  };

  useEffect(() => {
    if(repo_url) loadWebhooks();
  }, [repo_url])

  const critical = syncWebhooks.filter(sbs => ['CRITICAL', 'DISABLED'].includes(sbs.status));
  return <>
    {openSyncWebhooks && <Modal 
      subscriptions={syncWebhooks} 
      repo_url={url?.repo}
      onClose={() => setOpenSyncWebooks(false)} 
      autoSync={false} // it will not fetch for subscriptions on its own
    />}
    <IconButton
      onClick={() => setOpenSyncWebooks(true)}
      className={syncWebhooks.length == 0 || critical.length > 0 ? "red" : "green"}
    >
      <Badge color="secondary" badgeContent={critical.length}>
        {syncWebhooks.length == 0 || critical.length > 0 ? 
          <Tooltip title="Not in sync: Updates on github will not be automatically synched on this asset">
            <Icon>sync_disabled</Icon> 
          </Tooltip>
          : 
          <Tooltip title="Synched: Updates on github will automatically update this asset">
            <Icon>sync</Icon>
          </Tooltip>
          }
      </Badge>
    </IconButton>
  </>

}
