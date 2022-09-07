import React from "react";
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
  return (
    <Card>
      {asset.sync_status == 'OK' && 
        <Alert severity="warning">
          <AlertTitle>You cannot manually update this asset</AlertTitle>
          This lesson is in synch with github, only pulling from the github repository you will be able to update its markdown content.
        </Alert>
      }
      {typeof(value) !== "string" ? 
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
        asset.sync_status != 'OK' ?
          <SimpleMDE value={value} onChange={c => onChange(c)}  />
          :
          <pre className="markdown-preview px-3">{value}</pre>
      }
    </Card>
  );
};

export default AssetMarkdown;