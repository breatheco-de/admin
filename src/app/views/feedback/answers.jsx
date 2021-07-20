/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Avatar,
  Grow,
  Icon,
  IconButton,
  TextField,
  Button,
  LinearProgress,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { Breadcrumb, MatxLoading } from '../../../matx';

import bc from '../../services/breathecode';

// import axios from '../../../axios';
import { useQuery } from '../../hooks/useQuery';
import { DownloadCsv } from '../../components/DownloadCsv';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

// const stageColors = {
//   INACTIVE: 'bg-gray',
//   PREWORK: 'bg-secondary',
//   STARTED: 'text-white bg-warning',
//   FINAL_PROJECT: 'text-white bg-error',
//   ENDED: 'text-white bg-green',
//   DELETED: 'light-gray',
// };

const Answers = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page: 0,
  });
  const [querys, setQuerys] = useState({});
  const query = useQuery();
  const history = useHistory();
  const [queryLimit, setQueryLimit] = useState(query.get('limit') || 10);
  const [queryOffset, setQueryOffset] = useState(query.get('offset') || 0);
  const [
    queryLike,
    // setQueryLike
  ] = useState(query.get('like') || '');

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [answer, setanswer] = useState({
    color: '',
    score: '',
    title: '',
    comment: '',
    highest: '',
    lowest: '',
    user: {
      imgUrl: '',
      first_name: '',
      last_name: '',
    },
    academy: {
      name: '',
      slug: '',
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const q = {
      limit: query.get('limit') !== null ? query.get('limit') : 10,
      offset: query.get('offset') !== null ? query.get('offset') : 0,
    };
    setQuerys(q);
    bc.feedback()
      .getAnswers(q)
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems({ ...data });
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
    return () => setIsAlive(false);
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    bc.feedback()
      .getAnswers({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data, page });
      })
      .catch(() => {
        setIsLoading(false);
      });
    const q = { ...querys, limit: rowsPerPage, offset: page * rowsPerPage };
    setQuerys(q);
    history.replace(
      `/feedback/answers?${Object.keys(q)
        .map((key) => `${key}=${q[key]}`)
        .join('&')}`,
    );
  };

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { user } = items.results[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.imgUrl} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {user?.first_name}
                  {' '}
                  {user?.last_name}
                </h5>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'created_at',
      label: 'Sent date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            {items.results[i].created_at ? (
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {dayjs(items.results[i].created_at).format('MM-DD-YYYY')}
                </h5>
                <small className="text-muted">
                  {dayjs(items.results[i].created_at).fromNow()}
                </small>
              </div>
            ) : (
              <div className="ml-3">No information</div>
            )}
          </div>
        ),
      },
    },
    {
      name: 'score',
      label: 'Score',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (i) => {
          const color = items.results[i].score > 7
            ? 'text-green'
            : items.results[i].score < 7
              ? 'text-error'
              : 'text-orange';
          if (items.results[i].score) {
            return (
              <div className="flex items-center">
                <LinearProgress
                  color="secondary"
                  value={parseInt(items.results[i].score, 10) * 10}
                  variant="determinate"
                />
                <small className={color}>{items.results[i].score}</small>
              </div>
            );
          }
          return 'Not answered';
        },
      },
    },
    {
      name: 'comment',
      label: 'Comments',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            {items.results[i].comment
              ? items.results[i].comment.substring(0, 100)
              : 'No comments'}
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
          <>
            <div className="flex items-center">
              <div className="flex-grow" />
              <span>
                <IconButton
                  onClick={() => {
                    handleClickOpen(true);
                    setanswer(items.results[dataIndex]);
                  }}
                >
                  <Icon>arrow_right_alt</Icon>
                </IconButton>
              </span>
            </div>
          </>
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
              routeSegments={[
                { name: 'Feedback', path: '/feedback/answers' },
                { name: 'Answer List' },
              ]}
            />
          </div>

          <div className="">
            <Link
              to="/feedback/survey/new"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Send new survey
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title="All Answers"
            data={items.results}
            columns={columns}
            options={{
              customToolbar: () => {
                const singlePageTableCsv = `/v1/feedback/academy/answer?limit=${queryLimit}&offset=${queryOffset}&like=${queryLike}`;
                const allPagesTableCsv = `/v1/feedback/academy/answer?like=${queryLike}`;
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
              onFilterChange: (
                changedColumn,
                filterList,
                type,
                changedColumnIndex,
              ) => {
                const q = {
                  [changedColumn]: filterList[changedColumnIndex][0],
                };
                setQuerys(q);
                history.replace(
                  `/feedback/answers?${Object.keys(q)
                    .map((key) => `${key}=${q[key]}`)
                    .join('&')}`,
                );
              },
              rowsPerPage: parseInt(query.get('limit'), 10) || 10,
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
                  case 'filterChange':
                    // console.log(action, tableState)
                    break;
                  default:
                  // console.log(tableState.page, tableState.rowsPerPage);
                }
              },
              customSearchRender: (searchText, handleSearch, hideSearch) => (
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

      <Dialog
        onClose={handleClose}
        open={open}
        aria-labelledby="simple-dialog-title"
      >
        <div className="px-sm-24 pt-sm-24">
          <div className="flex items-center">
            <div className="flex items-center flex-grow">
              <p className="m-0 mb-4 text-small text-muted">
                Answer with details
              </p>
            </div>
            <IconButton size="small" onClick={handleClose}>
              <Icon>clear</Icon>
            </IconButton>
          </div>
          <DialogTitle>
            <Grid container spacing={3}>
              <Grid item md={6} xs={6}>
                <div className="flex items-center">
                  <Avatar className="w-48 h-48" src={answer.user.imgUrl} />
                  <div className="ml-3 mt-3">
                    <h3 className="my-0 text-15">
                      {answer.user.first_name}
                      {' '}
                      {answer.user.last_name}
                    </h3>
                  </div>
                </div>
              </Grid>
              <Grid item md={6} xs={6}>
                {answer.score === null ? (
                  <Card className="bg-gray items-center flex justify-between p-4">
                    <div>
                      <h5 className="font-normal text-white uppercase pt-2 mr-3">
                        Waiting fot answer
                      </h5>
                    </div>
                  </Card>
                ) : answer.score > 7 ? (
                  <Card className="bg-green items-center flex justify-between p-4">
                    <div>
                      <span className="text-white uppercase">TOTAL SCORE:</span>
                    </div>
                    <div>
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">
                        {answer.score}
                      </h2>
                    </div>
                  </Card>
                ) : answer.score < 7 ? (
                  <Card className="bg-error items-center flex justify-between p-4">
                    <div>
                      <span className="text-white uppercase">TOTAL SCORE:</span>
                    </div>
                    <div>
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">
                        {answer.score}
                      </h2>
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-secondary items-center flex justify-between p-4">
                    <div>
                      <span className="text-white uppercase">TOTAL SCORE:</span>
                    </div>
                    <div>
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">
                        {answer.score}
                      </h2>
                    </div>
                  </Card>
                )}
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <div>
              <div className="comments">
                <div className="mb-4">
                  <div className="mb-2">
                    <h2 className="m-0">{answer.title}</h2>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div>
              <div className="comments">
                <div className="mb-4">
                  {answer.comment ? (
                    <p className="m-0 text-muted">
                      {answer.comment.substring(0, 10000)}
                    </p>
                  ) : (
                    <p className="m-0 text-muted">Waiting for comments</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="mb-3 bg-primary text-white"
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default Answers;
