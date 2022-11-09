import React, { useEffect, useState } from "react";
import { Grid, Card, Divider } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import bc from "../../services/breathecode";
import ActiveCampaignCard from "./settings-form/ActiveCampaignCard";
import { Tags } from "./settings-form/Tags";
import { Automations } from "./settings-form/Automations";
import { MatxLoading } from 'matx';
import AlertAcademyAlias from "app/components/AlertAcademyAlias";

const GrowthSettings = () => {
  const [status, setStatus] = useState({ color: "error", message: "No active campaign integration found" });
  const [ACAcademy, setACAcademy] = useState({
    id: null,
    ac_key: "",
    ac_url: "",
    status: "",
    sync_message: "",
    sync_status: "",
    last_interaction_at: "",
    duplicate_leads_delta_avoidance: "",
  });

  const getAcAcademy = async () => {
    try {
      const res = await bc.marketing().getActiveCampaignAcademy();
      if (res.ok) {
        setACAcademy(res.data);
        // setStatus({ color: "success", message: "Active Campaign Integration" })
      }
    } catch (e){
      console.log(e);
    }
  }

  useEffect(() => {
    getAcAcademy();
  }, []);

  useEffect(() => {
    if (ACAcademy.id !== null) setStatus({ color: "success", message: "Active Campaign Integration" });
  }, [ACAcademy]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Growth", path: "/dashboard" },
            { name: "Settings" },
          ]}
        />
      </div>
      <div>
        <AlertAcademyAlias
        />
        <ActiveCampaignCard
          status={status}
          defaultAcademy={ACAcademy}
          setACAcademy={setACAcademy}
        />
        <Grid container spacing={3} className="mt-4">
          <Grid item md={7} xs={12}>
            <Tags className="mt-4" />
          </Grid>
          <Grid item md={5} xs={12}>
            <Automations />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GrowthSettings;
