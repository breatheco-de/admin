import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from '@material-ui/core';
import dayjs from 'dayjs';
import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Automations = ({ className }) => {
  const [automations, setAutomations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    bc.marketing()
      .getAcademyAutomations()
      .then(({ data }) => {
        setAutomations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        return error
      });
  }, []);

  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Your automations</h4>
      </div>
      <Divider className="flex" />
      <Grid item md={12}>
        The following automations were found in active campaign
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="px-0">Name</TableCell>
              <TableCell className="px-0">Stage</TableCell>
            </TableRow>
          </TableHead>
          {!isLoading ? (
            <TableBody>
              {automations.map((auto) => (
                <TableRow>
                  <TableCell className="pl-0 capitalize" align="left">
                    {auto.name || auto.slug} ({auto.id})
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {auto.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Box sx={{ display: 'flex', width: '100%' }}>
              <CircularProgress />
            </Box>
          )}
        </Table>
        {automations.length === 0 && !isLoading && (
          <p style={styles}> No Automations yet </p>
        )}
      </Grid>
    </Card>
  );
};

Automations.propTypes = {
  className: PropTypes.string,
};

Automations.defaultProps = {
  className: '',
};
