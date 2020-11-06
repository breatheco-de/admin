import React, { Fragment } from "react";
import {
  Grid,
  TextField,
  Icon,
  Button,
  MenuItem,
  IconButton,
  TablePagination,
  Hidden,
} from "@material-ui/core";

import GridProductCard from "./GridProductCard";
import ListProductCard from "./ListProductCard";

import * as _ from "lodash";

const ShopContainer = ({
  orderBy,
  view,
  productList,
  page,
  rowsPerPage,
  toggleSidenav,
  toggleView,
  handleChange,
  handleChangePage,
  setRowsPerPage,
}) => {
  return (
    <Fragment>
      <div className="relative h-full w-full">
        <div className="flex items-center justify-between mb-4">
          <Hidden mdUp>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={toggleSidenav}
            >
              Filter
            </Button>
          </Hidden>
          <div className="flex items-center justify-end flex-grow">
            <TextField
              select
              name="orderBy"
              onChange={handleChange}
              value={orderBy}
              InputProps={{
                disableUnderline: true,
              }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="asc">Lowest Price</MenuItem>
              <MenuItem value="desc">Highest Price</MenuItem>
            </TextField>
            <IconButton onClick={() => toggleView("grid")}>
              <Icon color={view === "grid" ? "primary" : "inherit"}>
                view_comfy
              </Icon>
            </IconButton>
            <IconButton onClick={() => toggleView("list")}>
              <Icon color={view === "list" ? "primary" : "inherit"}>list</Icon>
            </IconButton>
          </div>
        </div>
        <Grid container spacing={2}>
          {_.orderBy(productList, orderBy !== "false" ? "price" : "", orderBy)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) =>
              view === "grid" ? (
                <Grid item key={product.id} lg={4} md={6} sm={12} xs={12}>
                  <GridProductCard product={product}></GridProductCard>
                </Grid>
              ) : (
                <Grid item key={product.id} lg={12} md={12} sm={12} xs={12}>
                  <ListProductCard product={product}></ListProductCard>
                </Grid>
              )
            )}
        </Grid>
      </div>
      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={productList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={setRowsPerPage}
      />
    </Fragment>
  );
};

export default ShopContainer;
