/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';

const MatxMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const children = React.Children.toArray(props.children);
  const { shouldCloseOnItemClick = true, horizontalPosition = 'left' } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button type="button" className="inline-block" onClick={handleClick}>
        {props.menuButton}
      </button>
      <Menu
        elevation={8}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: horizontalPosition,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: horizontalPosition,
        }}
      >
        {children.map((child, index) => (
          <button
            type="button"
            onClick={shouldCloseOnItemClick ? handleClose : () => {}}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            {child}
          </button>
        ))}
      </Menu>
    </>
  );
};

export default MatxMenu;
