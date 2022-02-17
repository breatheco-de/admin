import React, { useEffect, useState } from "react";
import { Grid, } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import bc from '../../services/breathecode';
import { WebhookInfo } from "./forms/WebhookInfo";
import { Organizers } from "./forms/Organizers";
import EventbriteCard from "./forms/EventbriteCard";
import { Venues } from "./forms/Venues";

const EventSettings = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [loadingOrganization, setIsLoadingOrganization] = useState(false);
  const [status, setStatus] = useState({color:'success', message:''});
  const [organization, setOrganization] = useState({
    id:'',
    eventbrite_key:'',
    eventbrite_id:'',
    status:'',
    sync_desc: '',
    sync_status: '',
  });

  useEffect(() => {
    const getOrganization = async () => {
      try{
        setIsLoadingOrganization(true);
        const { data } = await bc.events().getAcademyEventOrganization();

        if(data.detail === "Organization not found for this academy" || !data){
          setStatus({color:'error', message:'The academy has not organization configured'});
          setIsLoadingOrganization(false);
          setIsCreating(true);
          return
        } else if (data.eventbrite_key === '' && data.eventbrite_id === ''){
          setStatus({color:'error', message:'The academy has not organization configured'});
        } else {
          let colors = {
            "ERROR":  'error',
            "PENDING": 'warning',
            "WARNING": 'warning',
            "PERSISTED":'success',
            "SYNCHED": 'success'
          }
          setStatus({ color: colors[data.sync_status], message:data.sync_status })
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
      <EventbriteCard 
        isCreating={isCreating}
        loadingOrganization={loadingOrganization}
        status={status}
        organization={organization}
      />

      <Grid container spacing={3} className="mt-4">
        <Grid item md={7} xs={12}>
          <WebhookInfo organization={organization}/>
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
