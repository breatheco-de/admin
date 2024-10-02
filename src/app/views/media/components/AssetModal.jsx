import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Button,
  Avatar,
  Icon,
  DialogTitle,
  IconButton,
  DialogActions,
  DialogContent,
  Tooltip,
  MenuItem,
} from '@material-ui/core';
import { labels, iconTypes } from "./initBoard"
import { MatxLoading } from "matx";
import TextField from '@material-ui/core/TextField';

import bc from 'app/services/breathecode';

export const AssetModal = ({
  slug,
  asset,
  handleAction,
  onClose
}) => {
  const [data, setData] = useState(asset || null);

  useEffect(async () => {
    if (!asset && slug) {
      const resp = await bc.registry().getAsset(slug)
      if (resp.status === 200) setData(resp.data)
    }
  }, slug);


  const execute = async (action) => {
    const success = await handleAction(action);
    if (success) {
      const resp = await bc.registry().getAsset(slug)
      if (resp.status === 200) setData(resp.data)
    }
  }

  if (!data) return <MatxLoading />

  return (
    <>
      <Dialog
        open={true}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth="md"
      >
        <DialogContent className="pb-0">
          <h3>{data.title}</h3>
          <div className="mb-4 flex flex-wrap">
            <div className="flex relative face-group">
              {!data.author ? <Tooltip title="No one has been assigned to this card, click to assign">
                <IconButton onClick={() => alert("TODO: assign author")}>
                  <Icon>person_add</Icon>
                </IconButton>
              </Tooltip> :
                <Tooltip title={data.author.name} key={data.author.id}><Avatar
                  className="avatar mt-2 ml-2"
                  src={data.author.avatar}
                /></Tooltip>
              }
              <Tooltip title={`Test status is ${data.test_status}, click to test again`}>
                <IconButton onClick={() => execute('test')}>
                  <Icon color={labels[data.test_status.toLowerCase()]}>{data.test_status === "OK" ? 'check_circle' : 'cancel'}</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title={`Sync status is ${data.sync_status}, click to sync again`}>
                <IconButton color={labels[data.sync_status.toLowerCase()]} onClick={() => execute('sync')}>
                  {data.sync_status === "OK" ? <Icon>cloud_done</Icon> : <Icon>cloud_download</Icon>}
                </IconButton>
              </Tooltip>
              <Tooltip title={`Open lesson content`}>
                <IconButton onClick={() => window.open(data.url)}>
                  {data.url && <Icon>exit_to_app</Icon>}
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <p>{data.description}</p>
          {data.seo_keywords && data.seo_keywords.length > 0 && <div className="px-sm-24">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">search</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">SEO Keywords</h6>
            </div>
            <div className="ml-10 mb-4 flex">
              {data.seo_keywords.map(k => <Chip key={k} size="small" label={k} color='gray' className="mr-2" />)}
            </div>
          </div>}
        </DialogContent>
        {/* <DialogActions>
          <Button
            color="primary" tma
            variant="contained"
            autoFocus
            onClick={() => onClose(formData)}
          >
            Save Requirements
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  )
}
