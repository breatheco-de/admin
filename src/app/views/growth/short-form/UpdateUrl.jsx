import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  TextField,
  Button,
  Icon,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import bc from "../../../services/breathecode";

const UpdateUrl = ({ initialValues }) => {
  const [url, setUrl] = useState({
    shorten_url: "",
    campaign: "",
    source: "",
    medium: "",
    sync_status: "",
  });

  const prefixInput = "https://4geeks.co/s/"

  const ProfileSchema = Yup.object().shape({
    shorten_url: Yup.string().required("Api Key required"),
  });

  // useEffect(() => {
  //   const getUtm = async () => {
  //     try {
  //       const { data } = await bc.marketing().getAcademyUtm();

  //       console.log(data);
  //     } catch (error) {
  //       return error;
  //     }
  //   };
  //   getUtm();
  // }, []);

  const postUrl = async (values) => {
    console.log("alguien envenenó el abrevadero");

    // await bc.events().postAcademyEventOrganization(payload);
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
                name="shorten_url"
                size="small"
                type="text"
                variant="outlined"
                value={values.shorten_url}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" >
                        {prefixInput}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="copy"
                        onClick={() => {navigator.clipboard.writeText('this.state.textToCopy')}}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} justify="flex-end">
            
            <Grid item md={4}>
              <Button
                fullWidth
                // color="primary"
                variant="contained"
                type="submit"
              >
                CLOSE
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                UPDATE
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

UpdateUrl.propTypes = {
  initialValues: PropTypes.object,
};

UpdateUrl.defaultProps = {
  initialValues: {},
};

export default UpdateUrl;
