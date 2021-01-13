import React, { useState,useEffect } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import axios from "../../../../axios";
import Snackbar from '@material-ui/core/Snackbar';
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import {ProfileForm} from "./student-utils/ProfileForm";
import Autocomplete from "../cohort-form/cohort-utils/Autocomplete";

const NewStudent = () => {
  
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
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

        <ProfileForm /> 
      </Card>
    </div>
  );
};


export default NewStudent;