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
  Tooltip,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@material-ui/core";
import SingleDelete from '../../../components/ToolBar/SingleDelete';
import bc from "../../../services/breathecode";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

export const Organizers = ({ className }) => {
  const [toDelete, setToDelete] = useState(null);

  const [organizers, setOrganizers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    bc.events()
      .getAcademyEventOrganizationOrganizer()
      .then(({ data }) => {
        setOrganizers(data.sort((a,b)=>{
          if ( a.created_at > b.created_at ){
            return -1;
          }
          if ( a.created_at < b.created_at ){
            return 1;
          }
          return 0;
        }));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return error
      });
  }, []);

  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  const disconectOrg = (organizer) => {

    const pos = organizers.map((e) => { return e.id; }).indexOf(organizer.id);

    let itemsCopy = [...organizers];

    itemsCopy.splice(pos,1);
    setOrganizers([...itemsCopy]);

    return bc.events()
              .deleteAcademyEventOrganizationOrganizer(organizer.id);
  }

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Organization Organizers</h4>
      </div>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
      The following organizers/academies are using your organization API
      credentials to publish and async events, you can click on the trash can
      icon on the ones you want to disconect
      </Grid>
      <Grid item md={12} className="mt-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="px-0">Organizer</TableCell>
              <TableCell className="px-0">Academy</TableCell>
              <TableCell className="px-0">Created</TableCell>
              <TableCell className="px-0"></TableCell>
            </TableRow>
          </TableHead>
          {!isLoading ? (
            <TableBody>
              {organizers.map((organizer) => (
                <TableRow key={organizer.id}>
                  <TableCell className="pl-0 capitalize" align="left">
                    {organizer.name}
                  </TableCell>
                  <TableCell className="pl-0 capitalize" align="left">
                    {organizer.academy?.name || <span className="text-error">No academy connected</span>}
                  </TableCell>
                  <TableCell className="pl-0">{`${dayjs(
                    organizer.created_at
                  ).fromNow(true)} ago`}</TableCell>
                  <TableCell className="pl-0">
                    <div className="flex items-center">
                      <div className="flex-grow" />
                        {organizer.academy ?
                        <Tooltip title="Disconect organizer from it's current academy">
                        <IconButton
                          onClick={() => {
                            setToDelete(organizer);
                            // setOpenDialog(true);
                          }}
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Connect organizer to another academy">
                        <IconButton>
                          <Icon>add</Icon>
                        </IconButton></Tooltip>
                        }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Box sx={{ display: "flex", width: "100%" }}>
              <CircularProgress />
            </Box>
          )}
        </Table>
        {organizers.length === 0 && !isLoading && (
          <p style={styles}> No Organizers yet </p>
        )}
      </Grid>
      {toDelete && (
        <SingleDelete
          deleting={() => {
            disconectOrg(toDelete);
          }}
          onClose={setToDelete}
          message="Are you sure you want to disconnect this organizer"
        />
      )}
    </Card>
  );
};

Organizers.propTypes = {
  className: PropTypes.string,
};

Organizers.defaultProps = {
  className: "",
};
