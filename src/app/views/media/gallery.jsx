/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useCallback } from 'react';
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from 'matx';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  getProductList,
  getCategoryList,
  updateFileInfo,
  deleteFile,
  createCategory,
  bulkEditMedia,
  clearSelectedMedia,
} from '../../redux/actions/MediaActions';
import { openDialog, closeDialog } from '../../redux/actions/DialogActions';
import Dialog from '../../components/Dialog';
import SideNav from './SideNav';
import GalleryContainer from './GalleryContainer';
import { useQuery } from '../../hooks/useQuery';
import { BulkEdit } from './BulkEdit';

// Dropzone depency for drag and drop

const Gallery = () => {
  const pgQuery = useQuery();
  const { pagination } = useSelector((state) => state.ecommerce);
  const [open, setOpen] = useState(true);
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    pgQuery.get('limit') !== null ? pgQuery.get('limit') : 10,
  );
  const [orderBy, setOrderBy] = useState('default');
  const [query, setQuery] = useState(pgQuery.get('like') !== null ? pgQuery.get('like') : '');
  const [type, setType] = useState(pgQuery.get('type') !== null ? pgQuery.get('type') : 'all');
  const [categories, setCategories] = useState(
    pgQuery.get('categories') !== null ? [...pgQuery.get('categories').split(',')] : [],
  );
  const [start, setStart] = React.useState(pgQuery.get('start') !== null ? pgQuery.get('start') : '');
  const [end, setEnd] = React.useState(pgQuery.get('end') !== null ? pgQuery.get('end') : '');
  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.ecommerce);
  const { categoryList = [] } = useSelector((state) => state.ecommerce);
  const { selected = [] } = useSelector((state) => state.ecommerce);
  const { refresh } = useSelector((state) => state.ecommerce);
  const history = useHistory();
  const { show, value } = useSelector((state) => state.dialog);

  const toggleSidenav = () => {
    setOpen(!open);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(newPage, rowsPerPage, event.target);
    dispatch(getProductList({ ...pagination, limit: rowsPerPage, offset: newPage * rowsPerPage }));
    const pg = { ...pagination, limit: rowsPerPage, offset: newPage * rowsPerPage };
    history.replace(
      `/media/gallery?${Object.keys(pg)
        .map((key) => `${key}=${pg[key]}`)
        .join('&')}`,
    );
  };

  const toggleView = (view) => setView(view);

  const handleSearch = (query) => {
    setQuery(query);
    search(query);
  };

  const handleSortChange = (e) => {
    if (e.target.value === 'default') {
      delete pagination.sort;
      dispatch(getProductList(pagination));
    } else {
      dispatch(getProductList({ ...pagination, sort: e.target.value }));
      history.replace(
        `/media/gallery?${Object.keys({ ...pagination, sort: e.target.value })
          .map((key) => `${key}=${{ ...pagination, sort: e.target.value }[key]}`)
          .join('&')}`,
      );
    }
    setOrderBy(e.target.value);
  };

  const search = useCallback(
    debounce((query) => {
      if (query === '') {
        delete pagination.like;
        dispatch(getProductList(pagination));
        history.replace(
          `/media/gallery?${Object.keys(pagination)
            .map((key) => `${key}=${pagination[key]}`)
            .join('&')}`,
        );
      } else {
        dispatch(
          getProductList({
            ...pagination,
            like: query,
          }),
        );
        history.replace(
          `/media/gallery?${Object.keys({
            ...pagination,
            like: query,
          })
            .map(
              (key) => `${key}=${
                {
                  ...pagination,
                  like: query,
                }[key]
              }`,
            )
            .join('&')}`,
        );
      }
    }, 300),
    [productList],
  );
  const handleTypeChange = (event, value) => {
    const eventValue = value;
    setType(eventValue);

    if (eventValue === 'all') {
      delete pagination.type;
      dispatch(getProductList(pagination));
      history.replace(
        `/media/gallery?${Object.keys(pagination)
          .map((key) => `${key}=${pagination[key]}`)
          .join('&')}`,
      );
      return;
    }
    dispatch(
      getProductList({
        ...pagination,
        type: eventValue,
      }),
    );
    history.replace(
      `/media/gallery?${Object.keys({ ...pagination, type: eventValue })
        .map((key) => `${key}=${{ ...pagination, type: eventValue }[key]}`)
        .join('&')}`,
    );
  };

  const handleStartChange = (date) => {
    setStart(date);
    dispatch(
      getProductList({
        ...pagination,
        start: date
      }),
    );
    history.replace(
      `/media/gallery?${Object.keys({ ...pagination, start: date })
        .map((key) => `${key}=${{ ...pagination, start: date }[key]}`)
        .join('&')}`,
    );
  }
  const handleEndChange = (date) => {
    setEnd(date);
    dispatch(
      getProductList({
        ...pagination,
        end: date
      }),
    );
    history.replace(
      `/media/gallery?${Object.keys({ ...pagination, end: date })
        .map((key) => `${key}=${{ ...pagination, end: date }[key]}`)
        .join('&')}`,
    );
  }


  const handleCategoryChange = (event) => {
    const { target } = event;
    let tempCategories = [];
    if (target.checked) {
      tempCategories = [...categories, target.name];
      dispatch(
        getProductList({
          ...pagination,
          categories: tempCategories.join(','),
        }),
      );
      history.replace(
        `/media/gallery?${Object.keys({ ...pagination, categories: tempCategories.join(',') })
          .map((key) => `${key}=${{ ...pagination, categories: tempCategories.join(',') }[key]}`)
          .join('&')}`,
      );
    } else {
      tempCategories = categories.filter((item) => item !== target.name);
      if (tempCategories.length < 1) {
        delete pagination.categories;
        dispatch(getProductList(pagination));
        history.replace(
          `/media/gallery?${Object.keys(pagination)
            .map((key) => `${key}=${pagination[key]}`)
            .join('&')}`,
        );
      } else {
        dispatch(
          getProductList({
            ...pagination,
            categories: tempCategories.join(','),
          }),
        );
        history.replace(
          `/media/gallery?${Object.keys({ ...pagination, categories: tempCategories.join(',') })
            .map((key) => `${key}=${{ ...pagination, categories: tempCategories.join(',') }[key]}`)
            .join('&')}`,
        );
      }
    }
    setCategories(tempCategories);
  };
  const handleRowsPerPage = (e) => {
    dispatch(getProductList({ ...pagination, limit: e.target.value }));
    const pg = { ...pagination, limit: e.target.value };
    history.replace(
      `/media/gallery?${Object.keys(pg)
        .map((key) => `${key}=${pg[key]}`)
        .join('&')}`,
    );
    setRowsPerPage(e.target.value);
  };
  const handleClearAllFilter = () => {
    const q = {
      limit: pgQuery.get('limit') !== null ? pgQuery.get('limit') : 10,
      offset: pgQuery.get('offset') !== null ? pgQuery.get('offset') : 0,
    };
    setQuery('');
    setType('all');
    setCategories([]);
    dispatch(getProductList(q));
    history.replace(
      `/media/gallery?${Object.keys(q)
        .map((key) => `${key}=${q[key]}`)
        .join('&')}`,
    );
  };

  const onSubmitBulkEdit = (values) => {
    dispatch(
      bulkEditMedia(
        selected.map((m) => ({
          categories: m.categories
            .filter((c) => !values.includes(c.id.toString()))
            .map((c) => c.id)
            .concat(...values),
          id: m.id,
        })),
      ),
    );
  };

  useEffect(() => {
    const keys = pgQuery.keys();
    const result = {};
    for (const key of keys) {
      result[key] = pgQuery.get(key);
    }
    dispatch(getProductList({ limit: 10, offset: 0, ...result }));
    dispatch(getCategoryList());
  }, [refresh]);

  return (
    <div className="shop m-sm-30">
      <MatxSidenavContainer>
        <Dialog
          title="Edit Media File"
          key={value.id}
          onClose={() => dispatch(closeDialog())}
          open={show}
          formInitialValues={{
            name: value.name,
            slug: value.slug,
            categories: value.categories,
            mime: value.mime,
            url: value.url,
          }}
          onDelete={() => dispatch(deleteFile(value.id))}
          onSubmit={(values) => dispatch(
            updateFileInfo(value.id, {
              ...values,
              categories: values.categories.map((c) => c.id),
            }),
          )}
        />
        <MatxSidenav width="288px" open={open} toggleSidenav={toggleSidenav}>
          {selected.length < 1 ? (
            <SideNav
              query={query}
              categories={categories}
              type={type}
              start={start}
              end={end}
              categoryList={categoryList}
              toggleSidenav={toggleSidenav}
              handleSearch={handleSearch}
              handleStartChange={handleStartChange}
              handleEndChange={handleEndChange}
              handleTypeChange={handleTypeChange}
              handleCategoryChange={handleCategoryChange}
              handleClearAllFilter={handleClearAllFilter}
              onNewCategory={(values) => dispatch(createCategory(values))}
            />
          ) : (
            <BulkEdit
              categoryList={categoryList}
              onClick={onSubmitBulkEdit}
              total={selected.length}
              clear={() => dispatch(clearSelectedMedia())}
            />
          )}
        </MatxSidenav>
        <MatxSidenavContent>
          <GalleryContainer
            orderBy={orderBy}
            view={view}
            productList={productList}
            page={page}
            pagination={pagination}
            rowsPerPage={rowsPerPage}
            toggleView={toggleView}
            toggleSidenav={toggleSidenav}
            handleSortChange={(e) => handleSortChange(e)}
            handleChangePage={handleChangePage}
            setRowsPerPage={handleRowsPerPage}
            onOpenDialog={(value) => dispatch(openDialog(value))}
          />
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </div>
  );
};

export default Gallery;
