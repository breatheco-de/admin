import React, { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Grid, Card, Divider, CircularProgress, Box, } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import { AddEventbriteOrganization } from "./forms/AddEventbriteOrganization";
import bc from '../../services/breathecode';
import { WebhookInfo } from "./forms/WebhookInfo";
import { Organizers } from "./forms/Organizers";
import { Venues } from "./forms/Venues";

const EventSettings = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [loadingOrganization, setIsLoadingOrganization] = useState(false);
  const [status, setStatus] = useState({color:'success', message:''});
  const [organization, setOrganization] = useState({
    eventbrite_key:'',
    eventbrite_id:'',
    status:'',
    sync_desc: '',
    sync_status: '',
  });

  const orangeStatus = ['PENDING', 'WARNING'];

  useEffect(() => {
    const getOrganization = async () => {
      try{
        setIsLoadingOrganization(true);
        const { data } = await bc.events().getAcademyEventOrganization();

        if(!data){
          setStatus({color:'error', message:'The academy has not organization configured'});
          setIsLoadingOrganization(false);
          setIsCreating(true);
          return
        } else if (data.eventbrite_key === '' && data.eventbrite_id === ''){
          setStatus({color:'error', message:'The academy has not organization configured'});
        } else if (data.sync_status === 'ERROR'){
          setStatus({color:'error', message:data.sync_status});
        } else if ( orangeStatus.includes(data.sync_status) ) {
          setStatus({color:'warning', message:data.sync_status});
        } else {
          setStatus({color:'success', message:data.sync_status});
        }

        setOrganization({...data});
        setIsLoadingOrganization(false);

      } catch(error){
        setIsLoadingOrganization(false);
        return error
      }
    }
    getOrganization();
      
  }, []);
  
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
      {!loadingOrganization ? (
        <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Eventbrite integrations</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">
            <Alert severity={status.color}>
              <AlertTitle>{status.message}</AlertTitle>
              {/* Please past here you Eventbrite Key to begin the integration */}
            </Alert>
          </div>
          <AddEventbriteOrganization initialValues={organization} isCreating={isCreating} />
        </Card>
      ) : (
        <Box sx={{ display: "flex", width: "100%" }}>
          <CircularProgress />
        </Box>
      )}

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
