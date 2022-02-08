import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  Dialog,
  Button,
  Select,
  MenuItem,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { AsyncAutocomplete } from './Autocomplete';
import bc from '../services/breathecode';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const CustomDialog = ({
  open, onClose, formInitialValues, onDelete, title, onSubmit, ...rest
}) => {
  const [category, setCategory] = useState([]);
  const [size, setSize] = useState(0);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    setCategory(formInitialValues.categories);
    return () => {
      setCategory([]);
      formInitialValues.categories = [];
    };
  }, []);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      <Formik
        initialValues={formInitialValues}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
          setCategory([]);
        }}
        enableReinitialize
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
            <DialogTitle id="alert-dialog-title">
              {title}
            </DialogTitle>
            <DialogContent className="px-5">
              <Grid container spacing={2} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  URL
                </Grid>
                <Grid item md={7} sm={4} xs={6}>
                  <TextField
                    label="URL"
                    name="url"
                    size="medium"
                    disabled
                    fullWidth
                    defaultValue={null}
                    value={!values.mime.includes('image') ? values.url : `${process.env.REACT_APP_API_HOST}/v1/media/file/${values.slug}`}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  {!values.mime.includes('image')
                    ? (
                      <Button
                        className="m-3"
                        variant="fillted"
                        fullWidth
                        onClick={() => {
                          navigator.clipboard.writeText(values.url);
                          toast.success('Copied to the clipboard', toastOption);
                        }}
                      >
                        Copy URL
                      </Button>
                    )
                    : (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        variant="filled"
                        fullWidth
                        value={size}
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== 0) {
                            setSize(e.target.value);
                            const query = {};
                            if (e.target.value != 'original') query.width = e.target.value;
                            const url = `${process.env.REACT_APP_API_HOST}/v1/media/file/${values.slug}?${Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')}`;
                            navigator.clipboard.writeText(url);
                            toast.success('Copied to the clipboard', toastOption);

                            // do the first request immediatly to make sure the resize gets done.
                            // if we don't do this, the first time someone calls the URL it will take a long time to load.
                            fetch(url, { redirect: 'manual', method: 'HEAD' })
                              .then((resp) => (resp.status > 399) && toast.warn('The image URL seems to be broken, test it first!', toastOption))
                              .catch((error) => toast.warn('The image URL seems to be broken, test it first!', toastOption));
                          }
                        }}
                      >
                        {[
                          { label: 'Copy URL', value: 0 },
                          { label: '200px (thumb)', value: 200 },
                          { label: '400px', value: 400 },
                          { label: '600px', value: 600 },
                          { label: '800px', value: 800 },
                          { label: 'Original size', value: 'original' },
                        ].map((opt) => <MenuItem key={opt.label} value={opt.value}>{opt.label}</MenuItem>)}
                      </Select>
                    )}
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Mime Type
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Mime"
                    name="mime"
                    fullWidth
                    size="medium"
                    variant="outlined"
                    value={values.mime}
                    disabled
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  File name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    size="medium"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Slug
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Slug"
                    name="slug"
                    fullWidth
                    size="medium"
                    variant="outlined"
                    value={values.slug}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Categories
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    onChange={(category) => { setCategory(category); setFieldValue('categories', category); console.log(category, formInitialValues); }}
                    width="100%"
                    label="Categories"
                    value={category}
                    multiple
                    debounced={false}
                    asyncSearch={() => bc.media().getAllCategories()}
                    getOptionLabel={(option) => `${option.name}`}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" autoFocus onClick={() => setConfirm(true)}>
                Delete file
              </Button>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" type="submit" autoFocus>
                Save
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
      {/* Delete confirm */}
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        {...rest}
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this file?
        </DialogTitle>
        <DialogActions>
          <Button color="secondary" autoFocus onClick={() => { onDelete(); setConfirm(false); onClose(); }}>
            Confirm
          </Button>
          <Button onClick={() => setConfirm(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CustomDialog;
