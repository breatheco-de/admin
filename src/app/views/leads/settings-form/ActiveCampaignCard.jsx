import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Card, Divider, CircularProgress, Box, } from "@material-ui/core";
import { AddActiveCampaign } from "./AddActiveCampaign";


const ActiveCampaignCard = ({defaultAcademy, status }) => {
  
    const Loader = () => (
        <Box sx={{ display: "flex", width: "100%" }}>
            <CircularProgress />
        </Box>
    )
    
    if (!defaultAcademy) return <Loader />

  return (
        <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Active Campaign Integration</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">
            <Alert severity={status.color}>
              <AlertTitle>{status.message}</AlertTitle>
              {/* Please past here you Eventbrite Key to begin the integration */}
            </Alert>
          </div>
          <AddActiveCampaign initialValues={defaultAcademy} />
        </Card>
  );
};

export default ActiveCampaignCard;