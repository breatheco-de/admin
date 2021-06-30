import React from 'react';
import {
  IconButton, Icon, Button, Grid, Menu, MenuItem,
} from '@material-ui/core';

const DropdownMenu = ({
  onClose, onSelect, options, children,
}) => {
  const [value, setValue] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = (e) => {
    setOpen(false);
    if (onClose) onClose();
    setAnchorEl(null);
  };

  return (
    <>
      <span onClick={(e) => {
        setOpen(!open);
        setAnchorEl(e.currentTarget);
      }}
      >
        {children}
      </span>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'Pyxis'}
            onClick={() => {
              setValue(option);
              if (onSelect) onSelect(option);
              handleClose();
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;
