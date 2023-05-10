import React, { useEffect, useState } from "react";
import { Grid, Card, Divider } from "@material-ui/core";
import { Breadcrumb } from "../../../../matx";
import bc from "../../../services/breathecode";
// import BulkActiveCampaignCard from "../settings-form/BulkActiveCampaignCard";
import { Tags } from "../settings-form/Tags";
import { Automations } from "../settings-form/Automations";
// import { MatxLoading } from 'matx';
import AlertAcademyAlias from "app/components/AlertAcademyAlias";
import BulkActiveCampaignCard from "../settings-form/BulkActiveCampaignCard.jsx"

const BulkUpload = () => {
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
    if (ACAcademy.id !== null) setStatus({ message: "What are you uploading? Please drag and drop your CSV file and specify what type of entity you are uploading:" });
  }, [ACAcademy]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Leads", path: '/growth/leads' },
            { name: "Bulk Upload Manager" },
          ]}
        />
      </div>
      <div>
      
        <BulkActiveCampaignCard 
          status={status}
          defaultAcademy={ACAcademy}
          setACAcademy={setACAcademy}
        />
       
        <div className="mt-4">
          <div >
            <Tags className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;