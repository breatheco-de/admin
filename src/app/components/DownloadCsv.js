import React from 'react';
import {
  Icon, IconButton, Tooltip, Menu, MenuItem,
} from '@material-ui/core';
export const DownloadCsv = ({ getSinglePageCSV, getAllPagesCSV }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

      
  const downloadFile = (data) => {
    console.log('descargando archivo', data);
    const url = window.URL.createObjectURL(new Blob([data]));
    console.log('url generada', url);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadAll = () => {
    console.log('iniciando descarga', getAllPagesCSV);
    (() => {
      getAllPagesCSV()
        .then((data) => {
          console.log('datos recibidos', data);
          downloadFile(data);
        })
        .catch((error) => console.error('error en getAllPagesCsv',error));
    })();
    handleClose();
  };

  const handleDownloadSingle = () => {
    console.log('iniciando descarga de página actual', getSinglePageCSV);
    (() => {
      getSinglePageCSV()
        .then((data) => {
          console.log('datos recibidos', data);
          downloadFile(data);
        })
        .catch((error) => console.error('error en getSinglePageCSV',error));
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
        <MenuItem onClick={handleDownloadSingle}>Download Current Page</MenuItem>
        <MenuItem onClick={handleDownloadAll}>Download All</MenuItem>
      </Menu>
    </>
  );
};
