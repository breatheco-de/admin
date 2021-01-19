import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from "../../../../axios";
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button
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
      invite:false,
    }
  });

  const addUserToAcademy = (user_id) => {
    const academy_id = localStorage.getItem("academy_id");
    console.log(user_id)
    axios.post(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/${academy_id}/member`,{ role:"student", user: user_id})
            .then(data => setMsg({ alert: true, type: "success", text: "Added"}))
            .catch(error => {
                console.log(error)
                setMsg({ alert: true, type: "error", text: "Errror"})
            })
  }
  
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
        <Autocomplete button_label={"Add user to academy"} showForm={setShowForm} addUserTo={addUserToAcademy}/>
        {showForm.show ? <ProfileForm  initialValues={showForm.data}/> : ""}
      </Card>
    </div>
  );
};


export default NewStudent;