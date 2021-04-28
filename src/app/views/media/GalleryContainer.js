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
  onOpenDialog,
  pagination
}) => {
  const [upload, setUpload] = useState(false);
  React.useEffect(()=> {
    console.log(page)
  }, [page])
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
        <Grid container spacing={2} direction="row" style={{alignItems:"stretch"}}>
          {productList.map((product) =>
              view === "grid" ? (
                <Grid item key={product.id} lg={3} md={3} sm={12} xs={12} >
                  <GridMediaCard media={product} onOpenDialog={() =>{console.log(product); onOpenDialog(product)}} key={product.id}></GridMediaCard>
                </Grid>
              ) : (
                <Grid item key={product.id} lg={12} md={12} sm={12} xs={12}>
                  <ListMediaCard product={product} onOpenDialog={()=> onOpenDialog(product)}  key={product.id}></ListMediaCard>
                </Grid>
              )
            )}
        </Grid>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={pagination.count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={setRowsPerPage}
      />
    </Fragment>
  );
};

export default ShopContainer;