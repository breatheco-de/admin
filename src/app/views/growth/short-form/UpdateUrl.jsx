import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { toast } from 'react-toastify';
import bc from "../../../services/breathecode";

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const UpdateUrl = ({ item, handleClose, updateTable }) => {
  const [url, setUrl] = useState({
    slug: item.slug,
  });

  const prefixInput = "https://4geeks.co/s/";

  const ProfileSchema = Yup.object().shape({
    slug: Yup.string().required("Slug required"),
  });

  const postUrl = async (values) => {

    const { data, status } = await bc.marketing().updateShort(item.slug, {
      ...item,
      ...values,
    });

    if(status >= 200 && status < 300){
      updateTable(data);

      handleClose();

    }

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
                error={errors.slug && touched.slug}
                helperText={touched.slug && errors.slug}
                name="slug"
                size="small"
                type="text"
                variant="outlined"
                value={values.slug}
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
                        onClick={() => {
                          navigator.clipboard.writeText(`${prefixInput}${values.slug}`);
                          toast.success('URL copied successfuly', toastOption);
                        }}
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
                variant="contained"
                onClick={handleClose}
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
