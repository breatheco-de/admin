import React from 'react';
import {
  IconButton, InputAdornment, Icon, OutlinedInput,
} from '@material-ui/core';
import MediaDialog from './MediaDialog';

export const MediaInput = ({
  handleChange, value, name, ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <OutlinedInput
        {...rest}
        id="standard-adornment-password"
        value={value}
        onChange={(e) => handleChange(name, e.target.value)}
        style={{ paddingRight: 3 }}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton onClick={() => setOpen(true)} style={{ padding: 5 }}>
              <Icon>collections</Icon>
            </IconButton>
          </InputAdornment>
            )}
      />
      {open ? <MediaDialog openDialog={open} onClose={() => setOpen(false)} setUrl={handleChange} name={name} /> : null}
    </>
  );
};
