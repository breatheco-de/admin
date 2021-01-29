import React, { useState, useEffect } from "react";

import { Alert, AlertTitle } from '@material-ui/lab';

import {
  Card,
  Divider,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { ProfileForm } from "./student-utils/ProfileForm";
import Autocomplete from "./student-utils/Autocomplete";
import Snackbar from '@material-ui/core/Snackbar';

const NewStudent = () => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
  const [showForm, setShowForm] = useState({
    show: false,
    data: {
      first_name:"",
      last_name:"",
      email:"",
      address:"",
      phone:"",
      cohort:""
    }
  });

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
          <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
            {msg.text}
          </Alert>
        </Snackbar> : ""}
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin" },
            { name: "Students", path: "/admin/students" },
            { name: "New Student" },
          ]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Student</h4>
        </div>
        <Divider className="mb-2 flex" />
        <div className="m-3">
          <Alert severity="success">
            <AlertTitle>On Adding a new student</AlertTitle>
            You can search for current users or create a new one
        </Alert>
        </div>
        <Autocomplete button_label={"Add user to academy"} showForm={setShowForm} />
        {showForm.show ? <ProfileForm  initialValues={showForm.data}/> : ""}
      </Card>
    </div>
  );
};


export default NewStudent;