import React, { Fragment } from "react";
import {
  Card,
  TextField,
  InputAdornment,
  Icon,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Slider,
  Checkbox,
  Fab,
  Button,
  Hidden,
} from "@material-ui/core";

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
}) => {
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
                label="Document"
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
              <small className="badge bg-light-primary text-primary">
                {category.medias}
              </small>
            </div>
          ))}
        </Card>
        <Button
          className="w-full"
          variant="contained"
          color="primary"
          onClick={handleClearAllFilter}
        >
          Clear All Filteres
        </Button>
      </div>
    </Fragment>
  );
};

export default Sidenav;