import React from "react";
import {
  Icon,
  Slider,
  TextField,
  IconButton,
  InputAdornment,
  Hidden,
} from "@material-ui/core";

const ListTopbar = ({
  viewMode,
  sliderValue,
  handleSldierChange,
  handleInputChange,
  handleViewChange,
}) => {
  let marks = [{ value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }];

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex items-center">
        <TextField
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
        ></TextField>
      </div>

      <div className="flex items-center">
        <Hidden xsDown>
          {viewMode === "grid" && (
            <Slider
              className="w-120 mr-4"
              value={sliderValue}
              min={25}
              step={null}
              marks={marks}
              onChange={handleSldierChange}
              aria-labelledby="continuous-slider"
            />
          )}
          <IconButton
            color={viewMode === "grid" ? "primary" : "default"}
            onClick={() => handleViewChange("grid")}
          >
            <Icon>view_comfy</Icon>
          </IconButton>

          <IconButton
            color={viewMode === "list" ? "primary" : "default"}
            onClick={() => handleViewChange("list")}
          >
            <Icon>list</Icon>
          </IconButton>
        </Hidden>
      </div>
    </div>
  );
};

export default ListTopbar;
