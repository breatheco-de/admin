import React, { useEffect, useState } from "react";
import { Grid, Card, Divider } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import bc from "../../services/breathecode";
import { WebhookInfo } from "./forms/WebhookInfo";
import { Organizer } from "./forms/Organizer";
import { Organizers } from "./forms/Organizers";
import EventbriteCard from "./forms/EventbriteCard";
import { Venues } from "./forms/Venues";
import { MatxLoading } from 'matx';

const EventSettings = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false);
  const [status, setStatus] = useState({ color: "success", message: "" });
  const [organizer, setOrganizer] = useState([]);
  const [organization, setOrganization] = useState({
    id: "",
    eventbrite_key: "",
    eventbrite_id: "",
    status: "",
    sync_desc: "",
    sync_status: "",
    detail: "",
  });

  const verifyOrganization = (data) => {
    try {
      if (data.detail === "Organization not found for this academy" || !data) {
        setStatus({
          color: "error",
          message: "The academy has not organization configured",
        });
        setIsLoadingOrganization(false);
        organization.detail = "Organization not found for this academy";
        setIsCreating(true);
        return;
      } else if (data.eventbrite_key === "" && data.eventbrite_id === "") {
        setStatus({
          color: "error",
          message: "The academy has not organization configured",
        });
      } else {
        let colors = {
          ERROR: "error",
          PENDING: "warning",
          WARNING: "warning",
          PERSISTED: "success",
          SYNCHED: "success",
        };
        setStatus({
          color: colors[data.sync_status],
          message: data.sync_status,
        });
      }

      setOrganization({ ...data });
      setIsLoadingOrganization(false);
    } catch (error) {
      setIsLoadingOrganization(false);
      return error;
    }
  };

  useEffect(() => {
    setIsLoadingOrganization(true);

    Promise.all([
      bc.events().getAcademyEventOrganization(),
      bc.events().getAcademyEventOrganizer(),
    ]).then((values) => {

      const { data: dataOrganization } = values[0];
      verifyOrganization(dataOrganization);

      const { data: dataOrganizer } = values[1];
      setOrganizer(dataOrganizer);

    }).catch((err)=>{
      setIsLoadingOrganization(false);
      return err
    });
    
  }, []);

  if(isLoadingOrganization) return <MatxLoading />

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
      {organization.detail === "Organization not found for this academy" &&
      organizer.length > 0 ? (
        <div>
          <Card elevation={3}>
            <div className="flex p-4">
              <h4 className="m-0">Eventbrite integrations</h4>
            </div>
            <Divider className="mb-2 flex" />
            <div className="m-3">
              <p>
                You are connected to eventbrite throughtout another account,
                your academy is an organizer from one or many other organizations,
                here you can find the list of organizations which your academy belong to.
                Please make sure to disconnect from them if you want to create your own 
                Eventbrite API integration with a separate organization and organizer.
              </p>
            </div>
          </Card>
          <Grid container spacing={3} className="mt-4">
            <Grid item md={7} xs={12}>
              <Organizer className="mt-4" organizers={organizer} />
            </Grid>
          </Grid>
        </div>
      ) : (
        <div>
          <EventbriteCard
            isCreating={isCreating}
            loadingOrganization={isLoadingOrganization}
            status={status}
            organization={organization}
          />
          <Grid container spacing={3} className="mt-4">
            <Grid item md={7} xs={12}>
              <WebhookInfo organization={organization} />
            </Grid>
            <Grid item md={5} xs={12}>
              <Organizers className="mt-4" />
              <Venues className="mt-4" />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default EventSettings;
