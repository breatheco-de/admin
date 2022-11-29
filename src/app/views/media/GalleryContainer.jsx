import React, { Fragment, useState } from 'react';
import {
  Grid,
  TextField,
  Icon,
  Button,
  MenuItem,
  IconButton,
  TablePagination,
  Hidden,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import { uploadFiles, selectMedia } from '../../redux/actions/MediaActions';
import { StyledDropzone } from '../../components/Dropzone';
import GridMediaCard from './GridMediaCard';
import ListMediaCard from './ListMediaCard';
// import SelectedMenu from "../material-kit/menu/SelectedMenu";

const ShopContainer = ({
  orderBy,
  view,
  productList,
  page,
  rowsPerPage,
  toggleSidenav,
  toggleView,
  handleSortChange,
  handleChangePage,
  setRowsPerPage,
  onOpenDialog,
  pagination,
}) => {
  const [upload, setUpload] = useState(false);
  const { selected = [] } = useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();

  const handleSelectedMedia = (value) => {
    const exist = selected.find((m) => m.id === value.id);
    if (exist) dispatch(selectMedia(selected.filter((m) => m.id !== value.id)));
    else dispatch(selectMedia(selected.concat(value)));
  };
  return (
    <>
      <div className="relative h-full w-full">
        <div className="flex items-center justify-between mb-4">
          <Hidden mdUp>
            <Button size="small" variant="contained" color="primary" onClick={toggleSidenav}>
              Filter
            </Button>
          </Hidden>
          <div className="flex items-center justify-end flex-grow">
            {!upload ? (
              <Button
                size="medium"
                variant="contained"
                color="primary"
                className="mt-2 mr-3 float-right"
                onClick={() => setUpload(true)}
              >
                Upload
              </Button>
            ) : (
              <StyledDropzone uploadFiles={uploadFiles} hideZone={() => setUpload(false)} />
            )}
            <TextField
              select
              name="orderBy"
              className="mt-1"
              onChange={handleSortChange}
              value={orderBy}
              InputProps={{
                disableUnderline: true,
              }}
            >
              <MenuItem value="default">Sort by</MenuItem>
              <MenuItem value="created_at">Recents First</MenuItem>
              <MenuItem value="-created_at">Oldests First</MenuItem>
            </TextField>
            <IconButton onClick={() => toggleView('grid')}>
              <Icon color={view === 'grid' ? 'primary' : 'inherit'}>view_comfy</Icon>
            </IconButton>
            <IconButton onClick={() => toggleView('list')}>
              <Icon color={view === 'list' ? 'primary' : 'inherit'}>list</Icon>
            </IconButton>
          </div>
        </div>
        <Grid container spacing={2} direction="row" style={{ alignItems: 'stretch' }}>
          {productList.map((product) => (view === 'grid' ? (
            <Grid item key={product.id} lg={3} md={3} sm={12} xs={12}>
              <GridMediaCard
                media={product}
                onOpenDialog={() => {
                  onOpenDialog(product);
                }}
                key={product.id}
                onSelected={handleSelectedMedia}
                isSelected={selected}
              />
            </Grid>
          ) : (
            <Grid item key={product.id} lg={12} md={12} sm={12} xs={12}>
              <ListMediaCard
                product={product}
                onOpenDialog={() => onOpenDialog(product)}
                key={product.id}
                onSelected={handleSelectedMedia}
                isSelected={selected}
              />
            </Grid>
          )))}
        </Grid>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={pagination.count || 0}
        rowsPerPage={parseInt(rowsPerPage, 10)}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={setRowsPerPage}
      />
    </>
  );
};

export default ShopContainer;
