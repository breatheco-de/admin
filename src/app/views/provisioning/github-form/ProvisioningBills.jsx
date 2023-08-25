import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Button,
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
import { getToken, getSession } from '../../../redux/actions/SessionActions';
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

export const ProvisioningBills = ({ className, bills }) => {

  const token = getToken();
  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  const total_owed = bills.filter(current=> current.status == "DUE").reduce((prev, current) => prev + current.total_amount, 0);

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Provisioning Bills</h4>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
      Your academy ows a total ammount of: ${total_owed}.
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="px-0">Name</TableCell>
              <TableCell className="px-0">Status</TableCell>
              <TableCell className="px-0">Amount</TableCell>
              <TableCell className="px-0"></TableCell>
              <TableCell className="px-0"></TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {bills?.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="pl-0 capitalize" align="left">
                    <p className="m-0 p-0">{bill.title || "No title provided"}</p>
                    <small className="text-muted">{bill.vendor.name}</small>
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {bill.status}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    ${bill.total_amount}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                  <a className="underline pointer blue" href={`${process.env.REACT_APP_API_HOST}/v1/provisioning/bill/${bill.id}/html?token=${token}`} >details</a>
                  </TableCell>
                  <TableCell className="pl-0">
                    {bill.status == "DUE" && <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => window.open(bill.stripe_url)}
                    >
                      Pay
                    </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
        {bills?.length === 0 && (
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
