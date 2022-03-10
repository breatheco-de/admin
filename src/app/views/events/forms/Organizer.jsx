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

export const Organizer = ({ className, organizers }) => {

  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Your Organizers</h4>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
      We found the following organizers for your academy, conect the main academy 
      that owns the organization if you want to disconect from them 
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="pl-sm-24">ID</TableCell>
              <TableCell className="px-0">Organizer</TableCell>
              <TableCell className="px-0">Parent Organization</TableCell>
              <TableCell className="px-0">Academy</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {organizers.map((organizer) => (
                <TableRow key={organizer.id}>
                  <TableCell className="pl-sm-24 capitalize" align="left">
                    {organizer.id}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {organizer.name}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {organizer.organization.name}
                  </TableCell>
                  <TableCell className="pl-0">{organizer.academy.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
        {organizers.length === 0 && !isLoading && (
          <p style={styles}> No Organizers yet </p>
        )}
      </Grid>
    </Card>
  );
};

Organizer.propTypes = {
  className: PropTypes.string,
};

Organizer.defaultProps = {
  className: "",
};