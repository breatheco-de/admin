import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
} from "@material-ui/core";
import bc from "../../../services/breathecode";

const UrlForm = ({ initialValues }) => {
  const [url, setUrl] = useState({
    shorten_url: "",
    campaign: "",
    source: "",
    medium: "",
    sync_status: "",
  });

  const ProfileSchema = Yup.object().shape({
    shorten_url: Yup.string().required("Api Key required"),
  });

  useEffect(() => {
    const getUtm = async () => {
      try {
        const { data } = await bc.marketing().getAcademyUtm();

        console.log(data);
      } catch (error) {
        return error;
      }
    };
    getUtm();
  }, []);

  const postUrl = async (values) => {
    console.log("alguien envenenó el abrevadero");
    // if (isCreating) {
    //   // Call POST
    //   const payload = {
    //     eventbrite_id: values.eventbrite_id,
    //     eventbrite_key: values.eventbrite_key,
    //   };
    //   await bc.events().postAcademyEventOrganization(payload);
    // } else {
    //   // Call PUT
    //   await bc.events().putAcademyEventOrganization({ ...values });
    // }
  };

  return (
    <Formik
      initialValues={url}
      validationSchema={ProfileSchema}
      onSubmit={(values) => postUrl(values)}
      enableReinitialize
    >
      {({ values, handleChange, handleSubmit, errors, touched }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={12}>
              <small className="text-muted">Answer details</small>
              <TextField
                fullWidth
                error={errors.shorten_url && touched.shorten_url}
                helperText={touched.shorten_url && errors.shorten_url}
                label="What URL do you want to shorten?"
                name="shorten_url"
                size="small"
                type="text"
                variant="outlined"
                value={values.shorten_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="campaign-label">Campaign</InputLabel>
                <Select
                  labelId="campaign-label"
                  id="campaign"
                  value={values.campaign}
                  fullWidth
                  label="Campaign"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  id="source"
                  value={values.source}
                  fullWidth
                  label="Source"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="medium-label">Medium</InputLabel>
                <Select
                  labelId="medium-label"
                  id="medium"
                  value={values.medium}
                  fullWidth
                  label="Medium"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3} 
            justify="flex-end"
          >
            <Grid item md={4}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                CREATE
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

UrlForm.propTypes = {
  initialValues: PropTypes.object,
};

UrlForm.defaultProps = {
  initialValues: {},
};

export default UrlForm;
