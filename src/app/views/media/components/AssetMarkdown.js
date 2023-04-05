import React, { useState } from "react";
import {
  Grid,
  Divider,
  Card,
  TextField,
  Icon,
  Button,
  IconButton,
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { format } from "date-fns";

// Documentation for the Markdown Composer: https://github.com/RIP21/react-simplemde-editor

const AssetMarkdown = ({ asset, value, onChange }) => {
  const readOnly = !['ARTICLE', 'LESSON'].includes(asset.asset_type);

  const updatedDate = asset.updated_at;
  const lastSynch = asset.last_synch_at;

  const d1 = Date.parse(updatedDate);
  const d2 = Date.parse(lastSynch);
  const diffSeconds = Math.abs((d1 - d2) / 1000);

  return (
    <Card>
      {readOnly && asset.readme_url != null ?
        <Alert severity="warning">
          <AlertTitle>You cannot manually update this asset</AlertTitle>
          This asset is in synch with github, only pulling from the github repository you will be able to update its markdown content.
        </Alert>
        :  diffSeconds > 20 ?
          <Alert severity="warning">
            <AlertTitle>Asset not in sync</AlertTitle>
            The asset is not synched with GitHub, please push your changes.
          </Alert>
          : asset.last_synch_at == null ?
            <Alert severity="warning">
              <AlertTitle>Asset never synched</AlertTitle>
              This asset has never been synched with GitHub, please pull the information from the GitHub repository.
            </Alert>
              : ""
      }

      {typeof (value) !== "string" ?
        <div className="p-4">
          File content its not text-based, you have two possible ways to fix this:
          <ul>
            <li>Change the github source url from where the content is being synched.</li>
            {asset.readme_url &&
              <>
                <li>Don't do anything: Some files like jupyter notebooks cannot be edited here, <a className="underline text-primary" target="_blank" href={`https://colab.research.google.com/github/${asset.readme_url.replace("https://github.com/", "")}`}>you have to use Google Collab.</a></li>
                <li><a target="_blank" className="underline text-primary" href={asset.readme_url}>Go update the file on github</a> and re-sync it</li>
              </>
            }
            <li><span className="underline pointer text-primary" onClick={() => onChange("")}>Click here</span> to reset the file content as a last resort</li>
          </ul>
        </div>
        :
        !readOnly ?
          <SimpleMDE value={value} onChange={c => onChange(c)} />
          :
          <pre className="markdown-preview px-3">{value}</pre>
      }
    </Card>
  );
};

export default AssetMarkdown;