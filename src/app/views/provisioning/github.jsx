import React, { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useSelector } from 'react-redux';
import { Breadcrumb } from "../../../matx";
import bc from "../../services/breathecode";
import { Link } from 'react-router-dom';
import OrganizationUsers from "./github-form/OrganizationUsers";
import GithubOrganization from "./github-form/GithubOrganization";
import { ProvisioningBills } from "./github-form/ProvisioningBills";
import { MatxLoading } from 'matx';

const GithubSettings = () => {
  const { settings } = useSelector(({ layout }) => layout);

  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // };

  useEffect(() => {

    bc.provisioning().getBills().then(_bills => {
      setBills(_bills.data);
    }).catch((err)=>{
      setIsLoading(false);
      return err
    });
    
  }, []);

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
          <Grid item md={5} xs={12}>
          { settings.beta && <GithubOrganization
              // isCreating={isCreating}
              // loadingOrganization={isLoadingOrganization}
              // status={status}
              // organization={organization}
            />}
            <ProvisioningBills className="mt-1"
              // isCreating={isCreating}
              // loadingOrganization={isLoadingOrganization}
              // status={status}
              bills={bills}
            />
          </Grid>
          <Grid item md={7} xs={12}>
            <OrganizationUsers className="mt-4" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GithubSettings;
