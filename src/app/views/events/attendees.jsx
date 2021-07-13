import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Grow, Icon, IconButton, TextField, Button,
} from '@material-ui/core';
import A from '@material-ui/core/Link';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { Breadcrumb, MatxLoading } from '../../../matx';

import bc from '../../services/breathecode';

import { useQuery } from '../../hooks/useQuery';
import { DownloadCsv } from '../../components/DownloadCsv';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  DRAFT: 'bg-gray',
  STARTED: 'text-white bg-warning',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const AttendeeList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page: 0,
  });
  const query = useQuery();
  const [querys, setQuerys] = useState({
    limit: query.get('limit') || 10,
    offset: query.get('offset') || 0,
  });
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    const q = {
      limit: query.get('limit') || 10,
      offset: query.get('offset') || 0,
    };
    setQuerys(q);
    bc.events()
      .getCheckins(q)
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems(data);
        }
      });
    return () => setIsAlive(false);
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    setQuerys({ limit: rowsPerPage, offset: page * rowsPerPage });
    bc.events()
      .getCheckins({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data, page });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    const q = { ...querys, limit: rowsPerPage, offset: page * rowsPerPage };
    setQuerys(q);
    history.replace(
      `/events/attendees?${Object.keys(q)
        .map((key) => `${key}=${q[key]}`)
        .join('&')}`,
    );
  };

  const handleFilterSubmit = () => {
    bc.events()
      .getCheckins(querys)
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data });
      })
      .catch((error) => {
        console.log(error);
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
      name: 'name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('name') !== null ? [query.get('name')] : [],
        customBodyRenderLite: (dataIndex) => {
          const { attendee, ...rest } = items.results[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {attendee !== null ? name(attendee) : `${rest.first_name} ${rest.last_name}`}
              </h5>
              <small className="text-muted">{rest?.email || rest.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('status') !== null ? [query.get('status')] : [],
        customBodyRenderLite: (dataIndex) => {
          const item = items.results[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${stageColors[item?.status]}`}>
                  {item?.status}
                </small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get('title') !== null ? [query.get('title')] : [],
        customBodyRenderLite: (dataIndex) => {
          const { event } = items.results[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">{event.title}</h5>
            </div>
          );
        },
      },
    },
    {
      name: 'url',
      label: 'Landing URL',
      options: {
        filter: true,
        filterList: query.get('url') !== null ? [query.get('url')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <A
                className="px-2 pt-2px border-radius-4 text-white bg-green cursor-pointer"
                href={items.results[i].url}
                rel="noopener"
              >
                URL
              </A>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'starting_at',
      label: 'Starting Date',
      options: {
        filter: true,
        filterList: query.get('starting_at') !== null ? [query.get('starting_at')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items.results[i].event.starting_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items.results[i].event.starting_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'ending_at',
      label: 'Ending Date',
      options: {
        filter: true,
        filterList: query.get('ending_at') !== null ? [query.get('ending_at')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items.results[i].event.ending_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items.results[i].event.ending_at).fromNow()}
              </small>
            </div>
          </div>
        ),
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
            <Link to={`/events/EditEvent/${items.results[dataIndex].id}`}>
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
            <Breadcrumb routeSegments={[{ name: 'Event', path: '/' }, { name: 'Event List' }]} />
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title="Event Attendees"
            data={items.results}
            columns={columns}
            options={{
              customToolbar: () => {
                const downloadCSV = async (querys = {}) => {
                  const { data } = await bc.events().downloadCSV(querys);
                  return data;
                };
                return (
                  <DownloadCsv
                    getAllPagesCSV={() => downloadCSV()}
                    getSinglePageCSV={() => downloadCSV(querys)}
                  />
                );
              },
              download: false,
              filterType: 'textField',
              responsive: 'standard',
              serverSide: true,
              elevation: 0,
              count: items.count,
              page: items.page,
              onFilterChange: (changedColumn, filterList, type, changedColumnIndex) => {
                let q;
                if (type === 'reset') {
                  q = {
                    limit: querys.limit ? querys.limit : 10,
                    offset: querys.offset ? querys.offset : 0,
                  };
                } else if (filterList[changedColumnIndex][0] === undefined || type === 'chip') {
                  q = { ...querys };
                  delete q[changedColumn];
                } else {
                  q = {
                    ...querys,
                    [changedColumn]: filterList[changedColumnIndex][0],
                  };
                }
                setQuerys(q);
                history.replace(
                  `/events/attendees?${Object.keys(q)
                    .map((key) => `${key}=${q[key]}`)
                    .join('&')}`,
                );
              },
              customFilterDialogFooter: () => (
                <div style={{ marginTop: '40px' }}>
                  <Button variant="contained" onClick={() => handleFilterSubmit()}>
                    Apply Filters
                  </Button>
                </div>
              ),
              rowsPerPage: querys.limit === undefined ? 10 : parseInt(querys.limit, 10),
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              onTableChange: (action, tableState) => {
                switch (action) {
                  case 'changePage':
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  case 'changeRowsPerPage':
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  default:
                    console.log(tableState.page, tableState.rowsPerPage);
                }
              },
              customSearchRender: (handleSearch, hideSearch) => (
                <Grow appear in timeout={300}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={({ target: { value } }) => handleSearch(value)}
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

export default AttendeeList;
