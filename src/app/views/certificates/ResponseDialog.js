import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CertificatesResult from './certificates-utils/CertificatesResults';

export default function ResponseDialog({
  openDialog, setOpenDialog, responseData, isLoading, cohortId,
}) {
  const history = useHistory();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClick = () => {
    handleClose();
    history.push(`/certificates/cohort/${cohortId}`);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (openDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialog]);

  return (
    <div>
      <Dialog
        maxWidth="xl"
        fullWidth
        open={openDialog}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Results</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            children={<ResponseContent responseData={responseData} isLoading={isLoading} />}
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClick()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ResponseContent = ({ responseData, isLoading }) => {
  const { data } = responseData;

  return (
    <CertificatesResult certificates={data} />
  );
};
