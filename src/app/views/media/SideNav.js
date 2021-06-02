import React, { Fragment, useState } from "react";
import {
  Card,
  TextField,
  InputAdornment,
  Icon,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Checkbox,
  Button,
  Hidden,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid
} from "@material-ui/core";
import { Formik } from "formik";

const Sidenav = ({
  query,
  categories,
  type,
  categoryList,
  toggleSidenav,
  handleSearch,
  handleTypeChange,
  handleCategoryChange,
  handleClearAllFilter,
  onNewCategory
}) => {
  const [dialog, setDialog] = useState(false)
  return (
    <Fragment>
      <div className="pl-4 flex items-center mb-4 mt-2">
        <TextField
          className="bg-paper flex-grow mr-4"
          size="small"
          margin="none"
          name="query"
          variant="outlined"
          placeholder="Search here..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon fontSize="small">search</Icon>
              </InputAdornment>
            ),
          }}
          fullWidth
        ></TextField>
        <Hidden smUp>
          <Icon onClick={toggleSidenav}>clear</Icon>
        </Hidden>
      </div>
      <div className="px-4">
        <Card elevation={3} className="p-4 mb-4">
          <h5 className="m-0 mb-4">Type</h5>
          <FormControl component="fieldset" className="w-full">
            <RadioGroup
              aria-label="status"
              name="status"
              value={type}
              onChange={handleTypeChange}
            >
              <FormControlLabel
                className="h-32"
                value="image"
                control={<Radio color="secondary" />}
                label="Image"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="video"
                control={<Radio color="secondary" />}
                label="Video"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="pdf"
                control={<Radio color="secondary" />}
                label="PDF"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="all"
                control={<Radio color="secondary" />}
                label="All"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
        </Card>

        <Card elevation={3} className="relative p-4 mb-4">
          <h5 className="m-0 mb-4">Category</h5>
          {categoryList.map((category) => (
            <div
              key={category.slug}
              className="flex items-center justify-between"
            >
              <FormControlLabel
                className="flex-grow"
                name={category.id.toString()}
                onChange={handleCategoryChange}
                control={
                  <Checkbox checked={categories.includes(category.id.toString())} />
                }
                label={<span className="capitalize">{category.name}</span>}
              />
              {/*<small className="badge bg-light-primary text-primary">
                {category.medias}
              </small>*/}
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            className="w-full"
            onClick={() => setDialog(true)}
          >Add Category</Button>
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClearAllFilter}
        >
          Clear All Filteres
        </Button>
      </div>
      {/* DIALOG*/}
      <Dialog
        onClose={() => setDialog(false)}
        open={dialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">New Category</DialogTitle>
        <Formik
          initialValues={{
            name:''
          }}
          onSubmit={(values) => {
            setDialog(false)
            onNewCategory(values)
          }}
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
              <DialogContent className='px-5'>
                <Grid container spacing={2} alignItems="center">
                  <Grid item md={2} sm={4} xs={12}>
                    Category name
                  </Grid>
                  <Grid item md={10} sm={8} xs={12}>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      size="medium"
                      variant="outlined"
                      required
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialog(false)} color="primary">
                  Cancel
                </Button>
                <Button color="primary" type="submit" autoFocus>
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Fragment>
  );
};

export default Sidenav;