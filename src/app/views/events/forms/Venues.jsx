import React, { useState, useEffect } from "react";
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
import dayjs from 'dayjs';
import bc from "../../../services/breathecode";

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Venues = ({ className }) => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    bc.events()
      .getAcademyVenues()
      .then(({ data }) => {
        setVenues(data);
        setIsLoading(false);
      })
      .catch((error) => {
        return error;
      });
  }, []);

  const styles = {
    textAlign: "center",
    width: "100%",
  };

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Your venues</h4>
        <IconButton>
          <Icon>sync</Icon>
        </IconButton>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
        The following venues were found in your eventbrite organization
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="pl-sm-24">#</TableCell>
              <TableCell className="px-0">Name</TableCell>
              <TableCell className="px-0">City</TableCell>
              <TableCell className="px-0">Updated At</TableCell>
            </TableRow>
          </TableHead>
          {!isLoading ? (
            <TableBody>
              {venues.map((venue, i) => (
                <TableRow>
                  <TableCell className="pl-sm-24 capitalize" align="left">
                    {i + 1}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {venue.title}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {venue.city}
                  </TableCell>
                  <TableCell className="pl-0">{dayjs(venue.updated_at).fromNow(true)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Box sx={{ display: "flex", width:'100%' }}>
              <CircularProgress />
            </Box>
          )}
        </Table>
        {venues.length === 0 && !isLoading && (
          <p style={styles}> No Venues yet </p>
        )}
      </Grid>
    </Card>
  );
};

Venues.propTypes = {
  className: PropTypes.string,
};

Venues.defaultProps = {
  className: "",
};
