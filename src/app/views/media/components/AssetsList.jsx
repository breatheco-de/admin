import React, { useState } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import history from "history.js";
import ReactCountryFlag from "react-country-flag"

export const AssetsList = ({
  assets,
  onClose
}) => {

  return (
    <>
      <Dialog
        open={true}
        minWidth="400"
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="ml-2" id="alert-dialog-title">
          Open Assets:
        </DialogTitle>
        <DialogContent>
          
          {assets.map(a => <Button onClick={() => history.push(`/media/asset/${a.slug}`)}>
            {a.title} <small className="capitalize ml-2">({a.status})</small>
          </Button>)}
        </DialogContent>
      </Dialog>
    </>
  )
}
