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

import Rating from "@material-ui/lab/Rating";

const ShopSidenav = ({
  query,
  categories,
  brands,
  multilevel,
  categoryList,
  brandList,
  ratingList,
  shipping,
  sliderRange,
  toggleSidenav,
  handleSearch,
  handleMultilevelChange,
  handleSliderChange,
  handleCategoryChange,
  handleBrandChange,
  handleRatingClick,
  handleFreeShippingClick,
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
          <h6 className="m-0 mb-4">Price</h6>
          <FormControl component="fieldset" className="w-full">
            <RadioGroup
              aria-label="status"
              name="status"
              value={multilevel}
              onChange={handleMultilevelChange}
            >
              <FormControlLabel
                className="h-32"
                value="0,10"
                control={<Radio color="secondary" />}
                label="<$10"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="10,100"
                control={<Radio color="secondary" />}
                label="$10-$100"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="100,500"
                control={<Radio color="secondary" />}
                label="$100-$500"
                labelPlacement="end"
              />
              <FormControlLabel
                className="h-32"
                value="500"
                control={<Radio color="secondary" />}
                label=">$500"
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

        <Card elevation={3} className="p-4 mb-4">
          <div className="flex justify-between items-center  mb-4">
            <h5 className="m-0">Slider</h5>
            <span className="text-muted">
              ${sliderRange[0] * 10} - ${sliderRange[1] * 10}
            </span>
          </div>
          <Slider
            value={sliderRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            valueLabelFormat={(x) => x * 10}
          />
        </Card>

        <Card elevation={3} className="relative p-4 mb-4">
          <h5 className="m-0 mb-4">Category</h5>
          {categoryList.map((category) => (
            <div
              key={category.title}
              className="flex items-center justify-between"
            >
              <FormControlLabel
                className="flex-grow"
                name={category.title}
                onChange={handleCategoryChange}
                control={
                  <Checkbox checked={categories.includes(category.title)} />
                }
                label={<span className="capitalize">{category.title}</span>}
              />
              <small className="badge bg-light-primary text-primary">
                {category.product}
              </small>
            </div>
          ))}
        </Card>

        <Card elevation={3} className="relative p-4 mb-4">
          <h5 className="m-0 mb-4">Brands</h5>
          <TextField
            size="small"
            className="mb-4"
            variant="outlined"
            placeholder="Search here..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon fontSize="small">search</Icon>
                </InputAdornment>
              ),
            }}
            fullWidth
          ></TextField>

          {brandList.map((brand) => (
            <div
              key={brand.title}
              className="flex items-center justify-between"
            >
              <FormControlLabel
                className="flex-grow"
                name={brand.title}
                onChange={handleBrandChange}
                control={<Checkbox checked={brands.includes(brand.title)} />}
                label={brand.title}
              />
              <small className="badge bg-light-primary text-primary">
                {brand.product}
              </small>
            </div>
          ))}
        </Card>

        <Card elevation={3} className="relative p-4 mb-4">
          <h5 className="m-0 mb-4">Rating</h5>
          {ratingList.map((rating) => (
            <div
              key={rating.rate}
              value={rating.rate}
              className="flex items-center justify-between cursor-pointer pb-4"
              onClick={() => handleRatingClick(rating.rate)}
            >
              <Rating
                size="small"
                name="half-rating"
                value={rating.rate}
                precision={0.5}
                readOnly={true}
              />
              <small className="badge bg-light-primary text-primary">
                {rating.product}
              </small>
            </div>
          ))}
        </Card>

        <Card
          elevation={3}
          className="relative p-4 mb-4 flex justify-between items-center"
        >
          <h5 className="m-0">Toggle</h5>
          <Fab
            className="px-3 box-shadow-none"
            variant="extended"
            color={shipping ? "primary" : "inherit"}
            size="small"
            onClick={handleFreeShippingClick}
          >
            <small className="mr-4">Free Shipping</small>
            <Icon>add</Icon>
          </Fab>
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

export default ShopSidenav;
