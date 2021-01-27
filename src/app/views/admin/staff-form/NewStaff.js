import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../../../axios";
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { AutocompleteUsers } from "../../../components/AutocompleteUsers";
import { AutocompleteRoles } from "../../../components/AutocompleteRoles";

const NewStaff = () => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const postMember = () => {
    if(user && user !== null && role  && role !== null) {
      axios.post(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/member`, {user: user.id, role:role.slug})
      .then((data) => {
        if(data.status === 201) setMsg({ alert: true, type: "success", text: "Member added successfully" }); 
        else setMsg({ alert: true, type: "success", text: data.statusText });
    })
      .catch(error =>{ 
        console.log(error);
        setMsg({
        alert: true,
        type: "error",
        text: error.detail || "Unknown error, check fields"
      })})
    } else setMsg({
      alert: true,
      type: "error",
      text: "Role and User cannot be empty"
    })
    
  };
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin/staff" },
            { name: "New Staff" },
          ]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a Staff Member</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={initialValues}
          onSubmit={(values) => postMember()}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
          }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  User
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AutocompleteUsers onChange={(user) => setUser(user)} size={"small"} width={"50%"} value={user} asyncSearch={(searchTerm)=> axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?like=${searchTerm}`)}/>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Role
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AutocompleteRoles onChange={(role) => setRole(role)} width={"50%"} size={"small"} value={role}/>
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
        {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
          <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
            {msg.text}
          </Alert>
        </Snackbar> : ""}
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  slug: "",
  certificate: "",
  kickoff_date: ""
};

export default NewStaff;