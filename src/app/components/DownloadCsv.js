import React from "react";
import axios from "../../axios";
import bc from "app/services/breathecode";
import { Icon, IconButton, Tooltip, Menu, MenuItem } from "@material-ui/core";

export const DownloadCsv = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = (data) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadAll = () => {
    (() => {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/v1/certificate`, {
          headers: { Accept: "text/csv" },
          responseType: "blob",
        })
        .then(({ data }) => {
          downloadFile(data);
        })
        .catch((error) => console.log(error));
    })();
    handleClose();
  };
  const handleDownloadSingle = () => {
    (() => {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/v1/certificate?limit=10`, {
          headers: { Accept: "text/csv" },
          responseType: "blob",
        })
        .then(({ data }) => {
          downloadFile(data);
        })
        .catch((error) => console.log(error));
    })();
    handleClose();
  };
  return (
    <>
      <Tooltip title='csv'>
        <IconButton onClick={handleClick}>
          <Icon>cloud_download</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        id='download-csv'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDownloadSingle}>Dowload Current Page</MenuItem>
        <MenuItem onClick={handleDownloadAll}>All</MenuItem>
      </Menu>
    </>
  );
};
