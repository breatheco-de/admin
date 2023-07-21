import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Icon,
  Divider,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@material-ui/core";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

export const ProvisioningBills = ({ className, bills }) => {

  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Provisioning Bills</h4>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
      The following bills are pending and to be paid.
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="px-0">Name</TableCell>
              <TableCell className="px-0">Status</TableCell>
              <TableCell className="px-0">Amount</TableCell>
              <TableCell className="px-0">Pay</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="pl-0 capitalize" align="left">
                    {bill.name}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {bill.status}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {bill.total_amount}
                  </TableCell>
                  <TableCell className="pl-0">
                    <IconButton
                      onClick={() => {
                        window.open(bill.stripe_url)
                      }}
                    >
                      <Icon>attach_money</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
        {bills.length === 0 && (
          <p style={styles}> No provisioning bills found </p>
        )}
      </Grid>
    </Card>
  );
};

ProvisioningBills.propTypes = {
  className: PropTypes.string,
};

ProvisioningBills.defaultProps = {
  className: "",
};