import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import CertificatesResult from './certificates-utils/CertificatesResults';
// needs multiple differnt prop validations for same variable??
const propTypes = {
  openDialog: PropTypes.number.isRequired,
  setOpenDialog: PropTypes.string.isRequired,
  responseData: PropTypes.string.isRequired,
  isLoading: PropTypes.string.isRequired,
  cohortId: PropTypes.string.isRequired,
};

const propTypesRC = {
  responseData: PropTypes.string.isRequired,
};

export default function ResponseDialog({
  openDialog,
  setOpenDialog,
  responseData,
  isLoading,
  cohortId,
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
            // PROPOSAL:
            // children={<ResponseContent responseData={responseData} isLoading={isLoading} />}
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ResponseContent responseData={responseData} isLoading={isLoading} />
          </DialogContentText>
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

const ResponseContent = ({ responseData }) => {
  const { data } = responseData;

  return <CertificatesResult certificates={data} />;
};

ResponseDialog.propTypes = propTypes;
ResponseContent.propTypes = propTypesRC;
