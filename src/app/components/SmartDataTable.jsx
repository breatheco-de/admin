/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import {
  Grow, Icon, IconButton, TextField,
} from '@material-ui/core';
import useQuery from '../hooks/useQuery';
import DownloadCsv from './DownloadCsv';
import BulkDelete from './ToolBar/BulkDelete';

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
};

const DefaultToobar = ({ children, ...props }) => (
  <div className={props.classes.iconContainer}>
    <BulkDelete onBulkDelete={props.onBulkDelete} {...props} />
    {children}
  </div>
);

const StyledDefaultToobar = withStyles(defaultToolbarSelectStyles, {
  name: 'SmartMUIDataTable',
})(DefaultToobar);

export const SmartMUIDataTable = (props) => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [table, setTable] = useState({
    count: 100,
    page: 0,
  });
  const query = useQuery();
  const history = useHistory();
  const [queryLimit, setQueryLimit] = useState(query.get('limit') || 10);
  const [queryOffset, setQueryOffset] = useState(query.get('offset') || 0);
  const [queryLike, setQueryLike] = useState(query.get('like') || '');
  const [querySort, setQuerySort] = useState(query.get('sort') || ' ');
  const [querys, setQuerys] = useState({
    limit: queryLimit,
    offset: queryOffset,
    like: queryLike,
    sort: querySort,
  });

  const loadData = () => {
    setIsLoading(true);
    props
      .search(querys)
      .then((data) => {
        setIsLoading(false);
        if (isAlive) {
          setItems(data.results);
          setTable({ count: data.count });
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    return () => {
      setIsAlive(false);
    };
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage, _like, _sort) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    setQueryLike(_like);
    setQuerySort(_sort);
    const query = {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      like: _like,
      sort: _sort,
    };
    setQuerys(query);
    props
      .search(query)
      .then((data) => {
        setIsLoading(false);
        setItems(data.results);
        setTable({ count: data.count, page });
        history.replace(
          `${history.location.pathname}?${Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')}`,
        );
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  // TODO: Pass a prop that identifies the view to build this url dinamically
  const singlePageTableCsv = `/v1/auth/academy/student?limit=${queryLimit}&offset=${queryOffset}&like=${queryLike}`;
  const allPagesTableCsv = `/v1/auth/academy/student?like=${queryLike}`;

  return (
    <MUIDataTable
      title={props.title}
      data={props.items}
      columns={props.columns}
      options={{
        download: false,
        filterType: 'textField',
        responsive: 'standard',
        serverSide: true,
        elevation: 0,
        count: table.count,
        page: table.page,
        selectableRowsHeader: false,
        rowsPerPage: querys.limit === undefined ? 10 : querys.limit,
        rowsPerPageOptions: [10, 20, 40, 80, 100],
        viewColumns: true,
        customToolbar: () => (
          <DownloadCsv
            singlePageTableCsv={singlePageTableCsv}
            allPagesTableCsv={allPagesTableCsv}
          />
        ),

        onColumnSortChange: (changedColumn, direction) => {
          if (direction === 'asc') {
            handlePageChange(
              querys.offset,
              querys.limit,
              querys.like,
              changedColumn,
            );
          }
          if (direction === 'desc') {
            handlePageChange(
              querys.offset,
              querys.limit,
              querys.like,
              `-${changedColumn}`,
            );
          }
        },

        onFilterChange: (
          changedColumn,
          filterList,
          type,
          changedColumnIndex,
        ) => {
          const q = {
            ...querys,
            [changedColumn]: filterList[changedColumnIndex][0],
          };
          setQuerys(q);
          history.replace(
            `${props.historyReplace}?${Object.keys(q)
              .map((key) => `${key}=${q[key]}`)
              .join('&')}`,
          );
        },

        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
          let children = null;
          if (props.options?.customToolbarSelect) {
            children = props.options.customToolbarSelect(
              selectedRows,
              displayData,
              setSelectedRows,
              loadData,
            );
          }
          return (
            <StyledDefaultToobar
              selectedRows={selectedRows}
              displayData={displayData}
              setSelectedRows={setSelectedRows}
              items={props.items}
              onBulkDelete={loadData}
              deleting={props.deleting}
            >
              {children}
            </StyledDefaultToobar>
          );
        },

        onTableChange: (action, tableState) => {
          switch (action) {
            case 'changePage':
              handlePageChange(
                tableState.page,
                tableState.rowsPerPage,
                querys.like,
                querys.sort,
              );
              break;
            case 'changeRowsPerPage':
              handlePageChange(
                tableState.page,
                tableState.rowsPerPage,
                querys.like,
                querys.sort,
              );
              break;
            default:
              handlePageChange();
          }
        },

        customSearchRender: (searchText, handleSearch, hideSearch, options) => (
          <Grow appear in timeout={300}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePageChange(
                    querys.offset,
                    querys.limit,
                    e.target.value,
                    querys.sort,
                  );
                }
              }}
              InputProps={{
                style: {
                  paddingRight: 0,
                },
                startAdornment: (
                  <Icon className="mr-2" fontSize="small">
                    search
                  </Icon>
                ),
                endAdornment: (
                  <IconButton onClick={hideSearch}>
                    <Icon fontSize="small">clear</Icon>
                  </IconButton>
                ),
              }}
            />
          </Grow>
        ),
      }}
    />
  );
};

SmartMUIDataTable.propTypes = {
  title: PropTypes.string,
  items: PropTypes.any,
  columns: PropTypes.any,
  search: PropTypes.any,
  options: PropTypes.object,
};
