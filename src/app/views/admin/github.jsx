import React, { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useSelector } from 'react-redux';
import { Breadcrumb } from "../../../matx";
import bc from "../../services/breathecode";
import { Link } from 'react-router-dom';
import OrganizationUsers from "./github-form/OrganizationUsers";
import GithubOrganization from "./github-form/GithubOrganization";
import { MatxLoading } from 'matx';

const GithubSettings = () => {
  const { settings } = useSelector(({ layout }) => layout);
  // const [isCreating, setIsCreating] = useState(false);
  // const [isLoadingOrganization, setIsLoadingOrganization] = useState(false);
  // const [status, setStatus] = useState({ color: "success", message: "" });
  // const [organizer, setOrganizer] = useState([]);
  // const [organization, setOrganization] = useState({
  //   id: "",
  //   eventbrite_key: "",
  //   eventbrite_id: "",
  //   status: "",
  //   sync_desc: "",
  //   sync_status: "",
  //   detail: "",
  // });

  // const verifyOrganization = (data) => {
  //   try {
  //     if (data.detail === "Organization not found for this academy" || !data) {
  //       setStatus({
  //         color: "error",
  //         message: "The academy has not organization configured",
  //       });
  //       setIsLoadingOrganization(false);
  //       organization.detail = "Organization not found for this academy";
  //       setIsCreating(true);
  //       return;
  //     } else if (data.eventbrite_key === "" && data.eventbrite_id === "") {
  //       setStatus({
  //         color: "error",
  //         message: "The academy has not organization configured",
  //       });
  //     } else {
  //       let colors = {
  //         ERROR: "error",
  //         PENDING: "warning",
  //         WARNING: "warning",
  //         PERSISTED: "success",
  //         SYNCHED: "success",
  //       };
  //       setStatus({
  //         color: colors[data.sync_status],
  //         message: data.sync_status,
  //       });
  //     }

  //     setOrganization({ ...data });
  //     setIsLoadingOrganization(false);
  //   } catch (error) {
  //     setIsLoadingOrganization(false);
  //     return error;
  //   }
  // };

  // useEffect(() => {
  //   setIsLoadingOrganization(true);

  //   Promise.all([
  //     bc.events().getAcademyEventOrganization(),
  //     bc.events().getAcademyEventOrganizer(),
  //   ]).then((values) => {

  //     const { data: dataOrganization } = values[0];
  //     verifyOrganization(dataOrganization);

  //     const { data: dataOrganizer } = values[1];
  //     setOrganizer(dataOrganizer);

  //   }).catch((err)=>{
  //     setIsLoadingOrganization(false);
  //     return err
  //   });
    
  // }, []);

  // if(isLoadingOrganization) return <MatxLoading />

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin" },
            { name: "Github" },
          ]}
        />
      </div>
      <div>
        <Alert severity="info">
          <AlertTitle>Sync your school students in-or-out of your github organization as they are added or removed from the cohorts, <a className="underline" href="https://4geeks.com/lesson/github-organization-user-sync"  target="_blank">you can read more about it here.</a></AlertTitle>
        </Alert>
        <Grid container spacing={3} className="mt-4">
          { settings.beta && <Grid item md={5} xs={12}>
            <GithubOrganization
              // isCreating={isCreating}
              // loadingOrganization={isLoadingOrganization}
              // status={status}
              // organization={organization}
            />
          </Grid>}
          <Grid item md={7} xs={12}>
            <OrganizationUsers className="mt-4" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GithubSettings;
