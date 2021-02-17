import React, { useState, useEffect } from "react";
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Card,
  Divider,
  Button
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { ProfileForm } from "./student-utils/ProfileForm";
import Snackbar from '@material-ui/core/Snackbar';
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import {AsyncAutocomplete} from "app/components/Autocomplete";
import bc from "app/services/breathecode";

const filter = createFilterOptions();
const NewStudent = () => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
  const [showForm, setShowForm] = useState({
    show: false,
    data: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone: "",
      cohort: ""
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
        <div className="flex m-4">
        <AsyncAutocomplete
          onChange={(user) => setShowForm({data:{...showForm.data, ...user}, show:true})}
          width={"100%"}
          label="Search Users"
          asyncSearch={(searchTerm) => bc.auth().getAllUsers(searchTerm)}
          debounced={true}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== '') {
                filtered.push({
                    newUser: <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowForm({
                                show: true,
                                data: {
                                    first_name: params.inputValue,
                                }
                            });
                        }}
                    >
                        Invite '{params.inputValue}' to Breathecode
                  </Button>,
                    first_name: params.inputValue
                });
            }
            return filtered;
        }}
          getLabel={option => option.newUser ? option.newUser : `${option.first_name} ${option.last_name}, (${option.email})`}
        />
        </div>
        {showForm.show ? <ProfileForm initialValues={showForm.data} /> : ""}
      </Card>
    </div>
  );
};


export default NewStudent;