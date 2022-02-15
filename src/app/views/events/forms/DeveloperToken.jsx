import React from "react";
import { Card, Divider, CircularProgress, Box } from "@material-ui/core";
import { ResetToken } from "./ResetToken";

const DeveloperTokenCard = ({
  organization,
  isCreating,
  loadingOrganization,
}) => {

  const docLink = 'https://documenter.getpostman.com/view/2432393/T1LPC6ef#be79b6fe-7626-4c33-b5f9-4565479852eb'
  
  const Loader = () => (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CircularProgress />
    </Box>
  );

  if (loadingOrganization) return <Loader />;

  return (
    <Card elevation={3}>
      <div className="flex p-4">
        <h4 className="m-0">Academy developer token</h4>
      </div>
      <Divider className="mb-2 flex" />
      <div className="m-3">
        <p>
          Use this academy id or token to interact with the API or retrieve
          students, cohorts and more. You can also use this information for your
          Zappier integrations. 
          <a href={docLink} target="_blank" style={{color:'rgb(17, 82, 147)'}}>
            Click here to read the API documentation
          </a>
        </p>
      </div>
      <ResetToken initialValues={organization} isCreating={isCreating} />
    </Card>
  );
};

export default DeveloperTokenCard;
