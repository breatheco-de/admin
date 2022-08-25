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
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { format } from "date-fns";

// Documentation for the Markdown Composer: https://github.com/RIP21/react-simplemde-editor

const AssetMarkdown = ({ asset, value, onChange }) => {

  return (
    <Card>
      {typeof(value) !== "string" ? 
        <div className="p-4">
          File content its not text-based, you have two possible ways to fix this:
          <ul>
            <li>Don't do anything: Some files like jupyter notebooks cannot be edited here, <a class="underline text-primary" target="_blank" href={`https://colab.research.google.com/github/${asset.readme_url.replace("https://github.com/", "")}`}>you have to use Google Collab.</a></li>
            <li>Change the github source url from where the content is being synched.</li>
            <li><a target="_blank" className="underline text-primary" href={asset.readme_url}>Go update the file on github</a> and re-sync it</li>
            <li><span className="underline pointer text-primary" onClick={() => onChange("")}>Click here</span> to reset the file content as a last resort</li>
          </ul>
        </div>
        :
        <SimpleMDE value={value} onChange={c => onChange(c)}  />
      }
    </Card>
  );
};

export default AssetMarkdown;