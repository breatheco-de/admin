import React, { useState, useEffect } from "react";
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

const UrlForm = ({ utmFiels }) => {
  const [url, setUrl] = useState({
    destination: "",
  });

  const [utmCampaign, setUtmCampaign] = useState(null);
  const [utmSource, setUtmSource] = useState(null);
  const [utmMedium, setUtmMedium] = useState(null);

  const ProfileSchema = Yup.object().shape({
    destination: Yup.string().required('Please write a URL'),
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

    const payload = {
      ...values,
      slug: new URL(values.destination).pathname,
      utm_campaign: utmCampaign,
      utm_source: utmSource,
      utm_medium: utmMedium,
    };

    await bc.marketing().addNewShort(payload);
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
              {/* <small className="text-muted">Answer details</small> */}
              <TextField
                fullWidth
                error={errors.destination && touched.destination}
                helperText={touched.destination && errors.destination}
                label="What URL do you want to shorten?"
                name="destination"
                size="small"
                type="text"
                variant="outlined"
                value={values.destination}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="campaign-label">Campaign</InputLabel>
                <Select
                  labelId="campaign-label"
                  id="campaign"
                  value={utmCampaign}
                  fullWidth
                  label="Campaign"
                  onChange={(e)=>setUtmCampaign(e.target.value)}
                >
                  {utmFiels.CAMPAIGN.map((field)=> 
                    <MenuItem value={field.slug}>{field.slug}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  id="source"
                  value={utmSource}
                  fullWidth
                  label="Source"
                  // onChange={handleChange}
                  onChange={(e)=>setUtmSource(e.target.value)}
                >
                  {utmFiels.SOURCE.map((field) => (
                    <MenuItem value={field.slug}>{field.slug}</MenuItem>
                  ))}
                  {/* <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="medium-label">Medium</InputLabel>
                <Select
                  labelId="medium-label"
                  id="medium"
                  value={utmMedium}
                  fullWidth
                  label="Medium"
                  // onChange={handleChange}
                  onChange={(e)=>setUtmMedium(e.target.value)}
                  
                >
                  {utmFiels.MEDIUM.map((field) => (
                    <MenuItem value={field.slug}>{field.slug}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} justify="flex-end">
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
