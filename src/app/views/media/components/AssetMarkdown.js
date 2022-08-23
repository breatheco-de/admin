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

const AssetMarkdown = ({ value }) => {
  return (
    <Card>
      <SimpleMDE value={value}  />
    </Card>
  );
};

export default AssetMarkdown;