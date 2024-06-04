import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Button,
  Icon,
  Chip,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles"
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import history from "history.js";
import bc from 'app/services/breathecode';
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
      {onAdd && <Button onClick={() => onAdd && onAdd(true)} className={classes.closeButton} variant="text">
        <Icon fontSize="small">add</Icon>
        <span className="ml-2">Add</span>
      </Button>}
    </MuiDialogTitle>
  );
});

export const AssetAliases = withStyles(dialogStyles)(({
  asset,
  onClose,
  classes
}) => {

  const [ aliases, setAliases ] = useState([])

  const loadAliases = async () => {
    const resp = await bc.registry().getAllAlias({ asset: asset.slug })
    if(resp.status == 200) {
      setAliases(resp.data)
    }
  }

  const deleteAlias = async (slug) => {
    const resp = await bc.registry().deleteAlias(slug)
    if(resp.status == 204) {
      loadAliases();
    }
  }

  useEffect(() => {
    loadAliases();
  }, [asset])

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
          Asset Aliases
        </DialogTitle>
        <DialogContent className='mb-3'>
            {aliases.length == 0 ? 
              <p>No assets have been found for this language and cluster.</p>
              :
              aliases.map(a => 
              <div className='mb-2'>
                {a.slug}
                {a.slug != asset.slug && <Chip
                className="ml-1" size="small"
                label={"Unlink"}
                icon={<Icon className="pointer" fontSize="small" 
                onClick={() => deleteAlias(a.slug)}
                >delete</Icon>}
                />}
              </div>
            )}
        </DialogContent>
      </Dialog>
    </>
  )
})
