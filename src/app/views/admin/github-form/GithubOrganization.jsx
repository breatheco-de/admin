import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Card, Divider, CircularProgress, Box, } from "@material-ui/core";
// import { AddEventbriteOrganization } from "./AddEventbriteOrganization";


const GithubOrganization = ({organization, status, isCreating, loadingOrganization}) => {
  
    const Loader = () => (
        <Box sx={{ display: "flex", width: "100%" }}>
            <CircularProgress />
        </Box>
    )
    
    if (loadingOrganization) return <Loader />

  return (
        <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Eventbrite integrations</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">
            {/* <Alert severity={status.color}> */}
            <Alert>
              <AlertTitle>Some message</AlertTitle>
              {/* Please past here you Eventbrite Key to begin the integration */}
            </Alert>
          </div>
          {/* <AddEventbriteOrganization initialValues={organization} isCreating={isCreating} /> */}
        </Card>
  );
};

export default GithubOrganization;