/* eslint-disable react/prop-types */
import React from 'react';
import {
  // IconButton,
  // Icon,
  // Button,
  // Grid,
  Menu,
  MenuItem,
} from '@material-ui/core';

const DropdownMenu = ({
  onClose, onSelect, options, children,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    setAnchorEl(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          setOpen(!open);
          setAnchorEl(e.currentTarget);
        }}
      >
        {children}
      </button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
