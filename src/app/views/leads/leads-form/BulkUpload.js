import React from "react";
import {  Card, Divider } from "@material-ui/core";
import { Breadcrumb } from "../../../../matx";
import { BulkTags } from "../settings-form/BulkTags";
import BulkDragDrop from "../settings-form/BulkDragDrop"



const BulkUpload = () => {
  
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
      <Card elevation={3}>
          <div className="flex p-4">
            <h4 className="m-0">Bulk Upload</h4>
          </div>
          <Divider className="mb-2 flex" />
          <div className="m-3">
          </div>
          <BulkDragDrop 
          />
        </Card>

       
        <div className="mt-4">
          <div >
            <BulkTags
            className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;