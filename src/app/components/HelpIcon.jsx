import React from 'react';
import {
  Icon, IconButton, Tooltip, Menu, MenuItem,
} from '@material-ui/core';
import HelpOutline from '@material-ui/icons/HelpOutline';
// import { Link } from 'react-router-dom';

const HelpIcon = ({ message, link }) => {

  return (
    <>
      <Tooltip title={message}
        fontSize="small"
        color="primary"
        style={{cursor: link ? 'pointer' : 'auto'}}
        onClick={()=>{
            if(link){
                window.open(link);
            }
        }}
    >
        <HelpOutline />
      </Tooltip>
    </>
  );
};

export default HelpIcon;