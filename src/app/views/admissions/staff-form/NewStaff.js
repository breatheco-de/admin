import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert, AlertTitle } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../../../axios";
import {
  Grid,
  Card,
  Divider,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import bc from "app/services/breathecode";
const filter = createFilterOptions();
const NewStaff = () => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const postMember = () => {
    if (user !== null && role !== null) {
      let refactor = user.id ? { user: user.id } : { email: user.email, invite: true }
      bc.auth().addAcademyMember({ ...refactor, role: role.slug })
        .then((data) => {
          if (data.status === 201) {
            setMsg({ alert: true, type: "success", text: "Member added successfully" });
            setRole(null);
            setUser(null);
          } else setMsg({ alert: true, type: "success", text: data.statusText });
        })
        .catch(error => {
          console.log(error);
          setMsg({
            alert: true,
            type: "error",
            text: error.detail || "Unknown error, check fields"
          })
        })
    } else setMsg({
      alert: true,
      type: "error",
      text: "Role and User cannot be empty"
    })

  };
  useEffect(() => {
    console.log(user)
  }, [user])
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
        <div className="m-3">
          <Alert severity="success">
            <AlertTitle>On Adding a new staff member</AlertTitle>
              You can search for current users or invite a new member
        </Alert>
        </div>
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
                  <AsyncAutocomplete
                    onChange={(user) => setUser(user)}
                    size={"small"} width={"50%"}
                    value={user}
                    label="User"
                    freeSolo
                    debounced={true}
                    renderOption={option => option.newUser ? option.newUser : `${option.first_name} ${option.last_name}, (${option.email})`}
                    getLabel={option => option.email}
                    asyncSearch={(searchTerm) => bc.auth().getAllUsers(searchTerm)}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      if (params.inputValue !== '') {
                        filtered.push({
                          newUser: <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUser({ email: params.inputValue });
                            }}
                          >
                            Invite '{params.inputValue}' to Breathecode
                          </Button>
                        });
                      }
                      return filtered;
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Role
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    onChange={(role) => setRole(role)}
                    width={"50%"}
                    asyncSearch={() => bc.auth().getRoles()}
                    size={"small"}
                    label="Roles"
                    getLabel={option => `${option.name}`}
                    value={role} />
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