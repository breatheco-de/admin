import React, { useState, useEffect } from 'react';
import { Breadcrumb, MatxLoading } from 'matx';
import MUIDataTable from 'mui-datatables';
import { Grow, Icon, IconButton, TextField, Button } from '@material-ui/core';
import A from '@material-ui/core/Link';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

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

const EventList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [table, setTable] = useState({
    count: 100,
    page: 0,
  });
  const query = useQuery();
  const history = useHistory();
  const [querys, setQuerys] = useState({
    limit: query.get('limit') || 10,
    offset: query.get('offset') || 0,
  });

  useEffect(() => {
    setIsLoading(true);
    bc.events()
      .getAcademyEvents({
        limit: query.get('limit') || 10,
        offset: query.get('offset') || 0,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems(data.results);
          setTable({ count: data.count });
        }
      });
    return () => setIsAlive(false);
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    setQuerys({ limit: rowsPerPage, offset: page * rowsPerPage });
    bc.events()
      .getAcademyEvents({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setItems(data.results);
        setTable({ count: data.count, page });
        history.replace(
          `/events/list?limit=${rowsPerPage}&offset=${page * rowsPerPage}`
        );
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
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className='flex items-center'>
              <div className='ml-3'>
                <small
                  className={`border-radius-4 px-2 pt-2px ${
                    stageColors[item?.status]
                  }`}
                >
                  {item?.status}
                </small>
                <br />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
    },
    {
      name: 'url',
      label: 'Landing URL',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className='flex items-center'>
            <div className='ml-3'>
              <A
                className='px-2 pt-2px border-radius-4 text-white bg-green'
                href={items[i].url}
                rel='noopener'
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
        customBodyRenderLite: (i) => (
          <div className='flex items-center'>
            <div className='ml-3'>
              <h5 className='my-0 text-15'>
                {dayjs(items[i].starting_at).format('MM-DD-YYYY')}
              </h5>
              <small className='text-muted'>
                {dayjs(items[i].starting_at).fromNow()}
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
        customBodyRenderLite: (i) => (
          <div className='flex items-center'>
            <div className='ml-3'>
              <h5 className='my-0 text-15'>
                {dayjs(items[i].ending_at).format('MM-DD-YYYY')}
              </h5>
              <small className='text-muted'>
                {dayjs(items[i].ending_at).fromNow()}
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
          <div className='flex items-center'>
            <div className='flex-grow' />
            <Link to={`/events/EditEvent/${items[dataIndex].id}`}>
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
    <div className='m-sm-30'>
      <div className='mb-sm-30'>
        <div className='flex flex-wrap justify-between mb-6'>
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Event', path: '/' },
                { name: 'Event List' },
              ]}
            />
          </div>

          <div className=''>
            <Link
              to='/events/NewEvent'
              color='primary'
              className='btn btn-primary'
            >
              <Button variant='contained' color='primary'>
                Add new event
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='overflow-auto'>
        <div className='min-w-750'>
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title='All Events'
            data={items}
            columns={columns}
            options={{
              customToolbar: () => {
                const singlePageTableCsv = `/v1/events/academy/event?limit=${
                  querys.limit
                }&offset=${querys.offset}&like=${''}`;
                const allPagesTableCsv = `/v1/events/academy/event?like=${''}`;
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
              count: table.count,
              page: table.page,
              rowsPerPage: parseInt(query.get('limit'), 10) || 10,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              onTableChange: (action, tableState) => {
                console.log(action, tableState);
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
                    variant='outlined'
                    size='small'
                    fullWidth
                    onChange={({ target: { value } }) => handleSearch(value)}
                    InputProps={{
                      style: {
                        paddingRight: 0,
                      },
                      startAdornment: (
                        <Icon className='mr-2' fontSize='small'>
                          search
                        </Icon>
                      ),
                      endAdornment: (
                        <IconButton onClick={hideSearch}>
                          <Icon fontSize='small'>clear</Icon>
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

export default EventList;
