import React from "react";
import { Card, Divider, CircularProgress, Box, } from "@material-ui/core";
import { AddEventbriteOrganization } from "./AddEventbriteOrganization";


const DeveloperTokenCard = ({organization, isCreating, loadingOrganization}) => {
  
    const Loader = () => (
        <Box sx={{ display: "flex", width: "100%" }}>
            <CircularProgress />
        </Box>
    )
    
    if (loadingOrganization) return <Loader />

  return (
        <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Academy developer token</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">

            <p>Use this academy id or token to interact with the API or retrieve students, cohorts and more.
                You can also use this information for your Zappier integrations. Click here to read the API documentation
            </p>
          </div>
          <AddEventbriteOrganization initialValues={organization} isCreating={isCreating} />
        </Card>
  );
};

export default DeveloperTokenCard;