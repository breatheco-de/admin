import React, { useState } from "react";
import { Formik } from "formik";
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import * as Yup from "yup";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumb } from "../../../../matx";
import bc from "../../../services/breathecode";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const slugify = require("slugify");

const Host = () => {
  const { id } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [version, setVersion] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [neverEnd, setNeverEnd] = useState(true);
  const [timeZone, setTimeZone] = useState("");
  const [newCohort, setNewCohort] = useState({
    name: "",
    slug: "",
    language: "",
    ending_date: null,
    never_ends: false,
    remote_available: true,
    time_zone: "",
    is_hidden_on_prework: true,
  });
  const history = useHistory();

  const ProfileSchema = Yup.object().shape({
    slug: Yup.string()
      .required()
      .matches(/^[a-z0-9]+(?:(-|_)[a-z0-9]+)*$/, "Invalid Slug"),
  });

  const createCohort = (event) => {
    setNewCohort({
      ...newCohort,
      [event.target.name]: event.target.value,
    });
  };

  const postCohort = (values) => {
    bc.admissions()
      .addCohort({
        ...values,
        timezone: `${timeZone}`,
        syllabus: `${syllabus.slug}.v${version.version}`,
        schedule: schedule?.id,
      })
      .then((data) => {
        if (data.status === 201) {
          history.push("/admissions/cohorts");
        }
      })
      .catch((error) => console.error(error));
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Events", path: "/events/list" },
            { name: "Edit Host" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Edit Host</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={newCohort}
          onSubmit={(newPostCohort) => postCohort(newPostCohort)}
          enableReinitialize
          validationSchema={ProfileSchema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Cohort Name"
                    data-cy="name"
                    name="name"
                    size="small"
                    variant="outlined"
                    value={newCohort.name}
                    onChange={(e) => {
                      newCohort.slug = slugify(e.target.value).toLowerCase();
                      createCohort(e);
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Slug
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Cohort Slug"
                    data-cy="slug"
                    name="slug"
                    size="small"
                    variant="outlined"
                    value={newCohort.slug}
                    onChange={createCohort}
                    error={errors.slug && touched.slug}
                    helperText={touched.slug && errors.slug}
                  />
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    if (neverEnd == false) {
                      return handleOpen();
                    } else {
                      handleSubmit();
                    }
                  }}
                  color="primary"
                  variant="contained"
                >
                  Create
                </Button>
                <Modal open={open} onClose={handleClose}>
                  <Box
                    style={{ position: "absolute", top: "33%", left: "41%" }}
                    className=" p-6 border-none border-radius-4 w-400 bg-paper "
                  >
                    <div className="modalContent text-center">
                      <h2>Confirm</h2>
                      <p>
                        Are you sure you want to create a cohort that doesn't
                        end? Some functionalities will be limited.
                      </p>

                      <div className="mb-2">
                        <Button
                          variant="outlined"
                          style={{ color: "blue", borderColor: "blue" }}
                          className="rounded mr-4"
                          onClick={handleSubmit}
                        >
                          Yes
                        </Button>

                        <Button
                          variant="outlined"
                          style={{ color: "gold", borderColor: "gold" }}
                          className="rounded "
                          onClick={handleClose}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Host;
