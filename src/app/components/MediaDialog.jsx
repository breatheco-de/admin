/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  GridList,
  GridListTile,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import clsx from 'clsx';
import { getProductList, getCategoryList } from '../redux/actions/MediaActions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  appBar: {
    position: 'relative',
    background: 'white',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: 'black',
  },
  hover: {
    '&:hover': {
      opacity: 1,
    },
  },
}));

const loader = (
  <div className="w-full text-center p-6" key="loader">
    <CircularProgress variant="indeterminate" />
  </div>
);

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function MediaDialog({
  openDialog, onClose, setUrl, name,
}) {
  const classes = useStyles();
  const { productList = [] } = useSelector((state) => state.ecommerce);
  const { categoryList = [] } = useSelector((state) => state.ecommerce);
  const { next = '' } = useSelector((state) => state.ecommerce);
  const { pagination } = useSelector((state) => state.ecommerce);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [category, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('default');
  const dispatch = useDispatch();

  const search = useCallback(
    debounce((query) => {
      if (query === '') {
        delete pagination.like;
        dispatch(getProductList(pagination));
      } else {
        dispatch(
          getProductList({
            ...pagination,
            like: query,
          }),
        );
      }
    }, 300),
    [productList],
  );

  const handleSearch = (query) => {
    setQuery(query);
    search(query);
  };

  const handleType = (value) => {
    setType(value);
    if (value === 'all') {
      delete pagination.type;
      dispatch(getProductList(pagination));
      return;
    }
    dispatch(getProductList({ ...pagination, type: value }));
  };

  const handleCategory = (value) => {
    setCategories(value);
    if (value.length < 1) {
      delete pagination.categories;
      dispatch(getProductList(pagination));
      return;
    }
    dispatch(
      getProductList({
        ...pagination,
        categories: value.join(','),
      }),
    );
  };

  const handleSort = (value) => {
    if (value === 'default') {
      delete pagination.sort;
      dispatch(getProductList(pagination));
      return;
    }
    dispatch(
      getProductList({
        ...pagination,
        sort: value,
      }),
    );
    setSort(value);
  };

  useEffect(() => {
    dispatch(getProductList({ limit: 50, offset: 0 }));
    dispatch(getCategoryList());
  }, []);

  const loadMore = () => {
    if (next) {
      dispatch(
        getProductList({
          ...pagination,
          limit: parseInt(pagination.limit, 10) + 50,
          offset: 0,
        }),
      );
    } else setHasMoreItems(false);
  };
  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar style={{ padding: '24px' }}>
          <IconButton edge="start" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Media Gallery
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="demo-controlled-open-select"
              value={category}
              multiple
              renderValue={(selected) => categoryList
                .filter((i) => selected.includes(i.id))
                .map((j) => j.name)
                .join(', ')}
              onChange={(e) => handleCategory(e.target.value)}
            >
              {categoryList.map((c) => (
                <MenuItem key={c.name} value={c.id}>
                  <Checkbox checked={category.includes(c.id)} />
                  <ListItemText primary={c.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="demo-controlled-open-select"
              value={type}
              onChange={(e) => handleType(e.target.value)}
            >
              {['All', 'Image', 'Video', 'PDF'].map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="sort">Sort</InputLabel>
            <Select
              labelId="sort"
              id="demo-controlled-open-select"
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="created_at">Recents First</MenuItem>
              <MenuItem value="-created_at">Oldests First</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              name="query"
              placeholder="Search by "
              style={{ marginTop: '12px' }}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
        </Toolbar>
      </AppBar>
      <div className="p-8 h-full-screen scroll-y">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMoreItems}
          loader={loader}
          useWindow={false}
          initialLoad={false}
        >
          <GridList cellHeight={200}>
            {productList.map((m) => (
              <GridListTile
                key={m.slug}
                style={{ width: '10%', cursor: 'pointer' }}
                rows={1}
                onClick={() => {
                  setUrl(name, m.url);
                  onClose();
                }}
                className={clsx('', classes.hover)}
              >
                <img src={m.thumbnail} alt={m.name} />
              </GridListTile>
            ))}
          </GridList>
        </InfiniteScroll>
      </div>
    </Dialog>
  );
}
