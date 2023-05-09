import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Card, Divider, CircularProgress, Box, } from "@material-ui/core";
import BulkDragDrop from "./BulkDragDrop"

const BulkActiveCampaignCard = ({defaultAcademy, status, setACAcademy }) => {

    const Loader = () => (
        <Box sx={{ display: "flex", width: "100%" }}>
            <CircularProgress />
        </Box>
    )

    if (!defaultAcademy) return <Loader />

  return (
        <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Bulk Upload</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">
           <p>{status.message}</p>
          </div>
          <BulkDragDrop setACAcademy={setACAcademy} initialValues={defaultAcademy} isCreating={defaultAcademy.id === null} />
        </Card>
  );
};

export default BulkActiveCampaignCard;