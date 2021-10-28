import React from 'react';
import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const emptyCallback = () => {};
const defaultProps = {
  onOpen: emptyCallback,
  onClose: emptyCallback,
  isOpen: false,
  setIsOpen: emptyCallback,
  cancelText: 'Cancel',
  acceptText: 'Yes',
  title: 'Are you sure you want to delete this resource',
  description: undefined,
  testId: 'confirm-alert',
};

const propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  cancelText: PropTypes.string,
  acceptText: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  testId: PropTypes.string,
};

const ConfirmAlert = ({
  onOpen, onClose, isOpen, setIsOpen, cancelText, acceptText, title, description, testId,
}) => {
  const titleTestId = `${testId}-title`;
  const descriptionTestId = `${testId}-description`;
  const cancelButtonTestId = `${testId}-cancel-button`;
  const acceptButtonTestId = `${testId}-accept-button`;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        onClose();
        setIsOpen(false);
      }}
      aria-labelledby={titleTestId}
      aria-describedby={descriptionTestId}
    >
      <DialogTitle id={titleTestId} data-cy={titleTestId}>
        {title}
      </DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText id={descriptionTestId} data-cy={descriptionTestId}>
            {description}
          </DialogContentText>
        </DialogContent>
      ) : <></>}
      <DialogActions>
        <Button
          data-cy={cancelButtonTestId}
          onClick={() => {
            onClose();
            setIsOpen(false);
          }}
          color="primary"
        >
          {cancelText}
        </Button>
        <Button
          color="primary"
          type="submit"
          autoFocus
          data-cy={acceptButtonTestId}
          onClick={() => {
            console.log(onOpen);
            onOpen();
            setIsOpen(false);
          }}
        >
          {acceptText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmAlert.defaultProps = defaultProps;
ConfirmAlert.propTypes = propTypes;

export default ConfirmAlert;
