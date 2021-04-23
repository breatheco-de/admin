import React, { Fragment, useMemo } from "react";
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
import { uploadFiles } from "app/redux/actions/MediaActions";
import {StyledDropzone} from "../../components/Dropzone"
import GridMediaCard from "./GridMediaCard"
import ListMediaCard from "./ListMediaCard"
import * as _ from "lodash";
import { useState } from "react";

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
  onOpenDialog
}) => {
  const [upload, setUpload] = useState(false);
  return (
    <Fragment>
      <div className="relative h-full w-full">
        {!upload ? <Button size="medium" variant="contained" color="primary" className='mt-2' onClick={() => setUpload(true)}>Upload</Button> :
        <StyledDropzone uploadFiles={uploadFiles} hideZone={() => setUpload(false)}/>}
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
                  <GridMediaCard media={product} onOpenDialog={() => onOpenDialog(product.id)}></GridMediaCard>
                </Grid>
              ) : (
                <Grid item key={product.id} lg={12} md={12} sm={12} xs={12}>
                  <ListMediaCard product={product} onOpenDialog={()=> onOpenDialog(product.id)}></ListMediaCard>
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