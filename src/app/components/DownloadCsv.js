import React from 'react';
import {
  Icon, IconButton, Tooltip, Menu, MenuItem,
} from '@material-ui/core';

export const DownloadCsv = ({ singlePageTableCsv, allPagesTableCsv }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = (data) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadAll = () => {
    (() => {
      allPagesTableCsv()
        .then(( data ) => {
          downloadFile(data);
        })
        .catch((error) => console.log(error));
    })();
    handleClose();
  };
  const handleDownloadSingle = () => {
    (() => {
      singlePageTableCsv()
        .then(( data ) => {
          downloadFile(data);
        })
        .catch((error) => console.log(error));
    })();
    handleClose();
  };
  
  return (
    <>
      <Tooltip title="csv">
        <IconButton onClick={handleClick}>
          <Icon>cloud_download</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        id="download-csv"
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
