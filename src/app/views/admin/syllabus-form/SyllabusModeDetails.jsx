import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    Divider,
    Card,
    TextField,
    Icon,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    Dialog,
    Button,
    MenuItem,
    DialogActions,
    IconButton,
  } from '@material-ui/core';
const SyllabusModeDetails = (props) => {
    const {className} = props;
    return <Card className={`p-4 ${className}`}>
        <h5 className="m-0 font-medium pb-4">PartTime Sun-Mon-Wed timeslots:</h5>
        <Grid container alignItems="center">
            <Grid item xs={10}>
            <div className="flex">
                <div className="flex-grow">
                <p className="mt-0 mb-6px text-13">
                    Every <span className="font-medium">WEEK</span> on Tuesdays from 6:00pm to 9:00pm 
                </p>
                </div>
            </div>
            </Grid>
            <Grid item xs={2} className="text-center">
            <div className="flex justify-end items-center">
                <IconButton>
                <Icon fontSize="small">delete</Icon>
                </IconButton>
            </div>
            </Grid>
        </Grid>
        <Grid container alignItems="center">
            <Grid item xs={10}>
            <div className="flex">
                <div className="flex-grow">
                <p className="mt-0 mb-6px text-13">
                    Every <span className="font-medium">WEEK</span> on Tuesdays from 6:00pm to 9:00pm 
                </p>
                </div>
            </div>
            </Grid>
            <Grid item xs={2} className="text-center">
            <div className="flex justify-end items-center">
                <IconButton>
                <Icon fontSize="small">delete</Icon>
                </IconButton>
            </div>
            </Grid>
        </Grid>
        <IconButton>
            <Icon fontSize="small">add_circle</Icon>
        </IconButton>
  </Card>
}
SyllabusModeDetails.propTypes = {
    className: PropTypes.string,
};
export default SyllabusModeDetails;
