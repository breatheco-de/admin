import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import PropTypes from 'prop-types';
import { MatxLoading } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';
import SyllabusModeDetails from './SyllabusModeDetails';
import axios from '../../../../axios';

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const SyllabusModes = ({ schedules }) => {
  console.log('blablabla');
  return (
    <>
      <Grid container alignItems="flex-end">
        <Grid item xs={8}>
          <h4 className="m-0 font-medium">Available schedules:</h4>
        </Grid>
        <Grid item xs={4} className="text-center">
          <Button color="primary">
            New schedule
          </Button>
        </Grid>
      </Grid>
      <Divider className="mb-6" />
      {schedules.map((v) => <SyllabusModeDetails className="mb-2" key={`schedule-${v.id}`} schedule={v} />)}
      {/* <SyllabusModeDetails className="mb-2" />
      <SyllabusModeDetails className="mb-2" /> */}
    </>
  );
};

SyllabusModes.propTypes = propTypes;
export default SyllabusModes;
