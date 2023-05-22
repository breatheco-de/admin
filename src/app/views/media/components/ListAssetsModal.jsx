import React, { useState } from 'react';
import {
  Dialog,
  Button,
  Icon,
  Card,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import history from "history.js";
import Alert from "../../../components/Alert"
import ReactCountryFlag from "react-country-flag"
import { PickAssetModal } from './PickAssetModal';

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
  const { children, classes, onClose, onClick, onAdd } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      <Button onClick={() => onAdd && onAdd(true)} className={classes.closeButton} variant="text">
        <Icon fontSize="small">add</Icon>
        <span className="ml-2">Add</span>
      </Button>
    </MuiDialogTitle>
  );
});

export const AssetsList = withStyles(dialogStyles)(({
  assets,
  cluster,
  onAddAsset,
  onClose,
  classes
}) => {

  const [ assignAsset, setAssignAsset ] = useState(null);
  const [ openDifferent, setOpenDifferent ] = useState(null);

  const sameLanguage = assets.filter(a => a.lang.toLowerCase() == (cluster.lang || a.lang).toLowerCase());
  const differentLanguage = assets.filter(a => a.lang.toLowerCase() != (cluster.lang || a.lang).toLowerCase());

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
        <DialogTitle className="ml-2 d-flex" id="alert-dialog-title" onAdd={() => setAssignAsset(true)}>
          {assets.length > 0 ? <>Pick one asset to open</> : <>No assets found</>}
        </DialogTitle>
        <DialogContent className='mb-3'>
            {sameLanguage.length == 0 ? 
              <p>No assets have been found for this language and cluster.</p>:
            sameLanguage.map(a => <Button className='d-block' onClick={() => history.push(`/media/asset/${a.slug}`)}>
              {a.title} <small className="capitalize ml-2">({a.status})</small>
            </Button>)}
            {differentLanguage.length > 0 && 
              <Alert color="warning">There are {differentLanguage.length} additional assets with this keyword that dont match the cluster language, <span className="underline pointer text-primary" onClick={() => setOpenDifferent(!openDifferent)}>{!openDifferent ? <>click here to show them</>:<>hide them</>}</span>.</Alert>}
            {openDifferent && <Card className="p-2">
                {differentLanguage.map(a => <Button className='d-block' onClick={() => history.push(`/media/asset/${a.slug}`)}>
                <ReactCountryFlag className="text-muted mr-2"
                  countryCode={a.lang?.toUpperCase()} svg
                  style={{
                    fontSize: '10px',
                  }}
                />
                {a.title} <small className="capitalize ml-2">({a.status})</small>
              </Button>)}
              </Card>
            }
        </DialogContent>
      </Dialog>
      {assignAsset && <PickAssetModal onClose={(asset) => onAddAsset(asset) && onClose(false)} />}
    </>
  )
})
