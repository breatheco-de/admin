import React, { forwardRef } from 'react';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={3} ref={ref} variant="filled" {...props} />;
});

export default Alert;