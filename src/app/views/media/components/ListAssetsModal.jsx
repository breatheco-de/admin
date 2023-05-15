import React, { useState } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  Icon,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import history from "history.js";
import ReactCountryFlag from "react-country-flag"
import { PickAssetModal } from './PickAssetModal';

export const AssetsList = ({
  assets,
  onAddAsset,
  onClose
}) => {

  const [ assignAsset, setAssignAsset ] = useState(null);


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
          {assets.length > 0 ? <>Pick one asset to open</> : <>No assets found</>}
        </DialogTitle>
        <DialogContent>
            {assets.map(a => <Button className='d-block' onClick={() => history.push(`/media/asset/${a.slug}`)}>
              {a.title} <small className="capitalize ml-2">({a.status})</small>
            </Button>)}
            <Button onClick={() => setAssignAsset(true)} variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">add</Icon>
                <span className="ml-2">Assign keyword to additional asset</span>
            </Button>
        </DialogContent>
      </Dialog>
      {assignAsset && <PickAssetModal onClose={(asset) => onAddAsset(asset) && onClose(false)} />}
    </>
  )
}
