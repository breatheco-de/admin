import React from "react";
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Grid,
  Card,
  Divider,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { AddEventbriteOrganization } from "./forms/AddEventbriteOrganization";
import { WebhookInfo } from "./forms/WebhookInfo";
import { Organizers } from "./forms/Organizers";
import { Venues } from "./forms/Venues";

const EventSettings = () => {

    return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin" },
            { name: "Students", path: "/admissions/students" },
            { name: "New Student" },
          ]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Eventbrite integrations</h4>
        </div>
        <Divider className="mb-2 flex" />
        <div className="m-3">
          <Alert severity="success">
            <AlertTitle>To finish your integration</AlertTitle>
              Please past here you Eventbrite Key to begin the integration
        </Alert>
        </div>
        <AddEventbriteOrganization />
      </Card>

      <Grid container spacing={3} className="mt-4">
        <Grid item md={7} xs={12}>
          <WebhookInfo />
        </Grid>
        <Grid item md={5} xs={12}>
          <Organizers className="mt-4" />
          <Venues className="mt-4" />
        </Grid>
      </Grid>
    </div>
  );
};


export default EventSettings;