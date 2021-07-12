import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

const propTypes = {
  certificates: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function CertificatesResult({ certificates }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {certificates.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {`${row.user.first_name} ${row.user.last_name}`}
              </TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.status_text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CertificatesResult.propTypes = propTypes;
