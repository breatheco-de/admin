import React, { useState, useEffect } from 'react';
import {
  Grow, Icon, IconButton, TextField, Button, Chip,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import MUIDataTable from 'mui-datatables';
import { Breadcrumb, MatxLoading } from '../../../matx';
import bc from '../../services/breathecode';
import { useQuery } from '../../hooks/useQuery';
import { DownloadCsv } from '../../components/DownloadCsv';
import CustomToolbar from '../../components/CustomToolbar';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  INACTIVE: 'gray',
  PREWORK: 'main',
  STARTED: 'primary',
  FINAL_PROJECT: 'error',
  ENDED: 'dark',
  DELETED: 'gray',
};

const Cohorts = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [setTable] = useState({
    count: 100,
    page: 0,
  });
  const query = useQuery();
  const history = useHistory();
  const [queryLimit, setQueryLimit] = useState(query.get('limit') || 10);
  const [queryOffset, setQueryOffset] = useState(query.get('offset') || 0);
  const [queryLike, setQueryLike] = useState(query.get('like') || '');
  const [querys, setQuerys] = useState({
    limit: queryLimit,
    offset: queryOffset,
    like: queryLike,
  });
  const [querySort, setQuerySort] = useState(query.get('sort') || ' ');

  const handleLoadingData = () => {
    setIsLoading(true);
    bc.admissions()
      .getAllCohorts({
        limit: queryLimit,
        offset: queryOffset,
        like: queryLike,
        sort: querySort,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems(data.results);
          setTable({ count: data.count });
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
    return () => setIsAlive(false);
  };

  useEffect(() => {
    handleLoadingData();
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage, _like, _sort) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    setQueryLike(_like);
    setQuerySort(_sort);
    const q = {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      like: _like,
      sort: _sort,
    };
    setQuerys(q);
    bc.admissions()
      .getAllCohorts(q)
      .then(({ data }) => {
        setIsLoading(false);
        setItems(data.results);
        setTable({ count: data.count, page });
        history.replace(
          `/admissions/cohorts?${Object.keys(q)
            .map((key) => `${key}=${q[key]}`)
            .join('&')}`,
        );
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: 'stage', // field name in the row object
      label: 'Stage', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('stage') !== null ? [query.get('stage')] : [],
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          console.log('for kickoffdate:', dayjs().isBefore(dayjs(item?.kickoff_date)));
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {dayjs().isAfter(dayjs(item?.ending_date))
                && !['ENDED', 'DELETED'].includes(item?.stage) ? (
                  <Chip
                    size="small"
                    icon={<Icon fontSize="small">error</Icon>}
                    label="Out of sync"
                    color="secondary"
                  />
                  ) : (
                    <Chip size="small" label={item?.stage} color={stageColors[item?.stage]} />
                  )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'slug', // field name in the row object
      label: 'Slug', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('slug') !== null ? [query.get('slug')] : [],
        customBodyRenderLite: (i) => {
          const item = items[i];
          console.log('this is an item', item);
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Link
                  to={`/admissions/cohorts/${item.slug}`}
                  style={{ textDecoration: 'underline' }}
                >
                  <h5 className="my-0 text-15">{item?.name}</h5>
                </Link>
                <small className="text-muted">{item?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'kickoff_date',
      label: 'Kickoff Date',
      options: {
        filter: true,
        filterList: query.get('kickoff_date') !== null ? [query.get('kickoff_date')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items[i].kickoff_date).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(items[i].kickoff_date).fromNow()}</small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'certificate',
      label: 'Certificate',
      options: {
        filter: true,
        filterList: query.get('certificate') !== null ? [query.get('certificate')] : [],
        customBodyRenderLite: (i) => items[i].syllabus.certificate?.name,
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow" />
            <Link to={`/admissions/cohorts/${items[dataIndex].slug}`}>
              <IconButton>
                <Icon>edit</Icon>
              </IconButton>
            </Link>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[{ name: 'Admin', path: '/admissions' }, { name: 'Cohorts' }]}
            />
          </div>

          <div className="">
            <Link to="/admissions/cohorts/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary">
                Add new cohort
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title="All Cohorts"
            data={items}
            columns={columns}
            options={{
              onColumnSortChange: (changedColumn, direction) => {
                if (direction === 'asc') {
                  handlePageChange(queryLimit, queryOffset, queryLike, changedColumn);
                }
                if (direction === 'desc') {
                  handlePageChange(queryLimit, queryOffset, queryLike, `-${changedColumn}`);
                }
              },
              customToolbar: () => {
                const singlePageTableCsv = `/v1/admissions/academy/cohort?limit=${queryLimit}&offset=${queryOffset}&like=${queryLike}`;
                const allPagesTableCsv = `/v1/admissions/academy/cohort?like=${queryLike}`;
                return (
                  <DownloadCsv
                    singlePageTableCsv={singlePageTableCsv}
                    allPagesTableCsv={allPagesTableCsv}
                  />
                );
              },
              download: false,
              filterType: 'textField',
              responsive: 'standard',
              serverSide: true,
              elevation: 0,
              page: items.page,
              count: items.count,
              onFilterChange: (changedColumn, filterList, type, changedColumnIndex) => {
                const q = {
                  ...querys,
                  [changedColumn]: filterList[changedColumnIndex][0],
                };
                setQuerys(q);
                history.replace(
                  `/admissions/cohorts?${Object.keys(q)
                    .map((key) => `${key}=${q[key]}`)
                    .join('&')}`,
                );
              },
              rowsPerPage: querys.limit === undefined ? 10 : querys.limit,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                <CustomToolbar
                  selectedRows={selectedRows}
                  displayData={displayData}
                  setSelectedRows={setSelectedRows}
                  items={items}
                  key={items}
                  history={history}
                  id="cohorts"
                  deleting={async (quer) => {
                    const { status } = await bc.admissions().deleteCohortsBulk(quer);
                    return status;
                  }}
                  onBulkDelete={handleLoadingData}
                />
              ),
              onTableChange: (action, tableState) => {
                switch (action) {
                  case 'changePage':
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike, querySort);
                    break;
                  case 'changeRowsPerPage':
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike, querySort);
                    break;
                  case 'filterChange':
                    // console.log(action, tableState)
                    break;
                  default:
                    console.log(tableState.page, tableState.rowsPerPage);
                }
              },
              customSearchRender: (
                // searchText,
                handleSearch,
                hideSearch,
                // options,
              ) => (
                <Grow appear in timeout={300}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={({ target: { value } }) => handleSearch(value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePageChange(queryOffset, queryLimit, e.target.value, querySort);
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
        </div>
      </div>
    </div>
  );
};

export default Cohorts;
