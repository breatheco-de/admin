/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  LinearProgress,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const Answers = () => {
  const [items, setItems] = useState([]);
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



  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { user } = items[dataIndex];
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
            {items[i].created_at ? (
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {dayjs(items[i].created_at).format('MM-DD-YYYY')}
                </h5>
                <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
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
          const color = items[i].score > 7
            ? 'text-green'
            : items[i].score < 7
              ? 'text-error'
              : 'text-orange';
          if (items[i].score) {
            return (
              <div className="flex items-center">
                <LinearProgress
                  color="secondary"
                  value={parseInt(items[i].score, 10) * 10}
                  variant="determinate"
                />
                <small className={color}>{items[i].score}</small>
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
            {items[i].comment ? items[i].comment.substring(0, 100) : 'No comments'}
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
                    setanswer(items[dataIndex]);
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
            <Link to="/feedback/survey/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary">
                Send new survey
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Answers"
            columns={columns}
            items={items}
            view="answers?"
            historyReplace="/feedback/answers"
            singlePage=""
            search={async (querys) => {
              const { data } = await bc.feedback().getAnswers(querys);
              setItems(data.results);
              return data;
            }}
          />
        </div>
      </div>

      <Dialog onClose={handleClose} open={open} aria-labelledby="simple-dialog-title">
        <div className="px-sm-24 pt-sm-24">
          <div className="flex items-center">
            <div className="flex items-center flex-grow">
              <p className="m-0 mb-4 text-small text-muted">Answer with details</p>
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
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">{answer.score}</h2>
                    </div>
                  </Card>
                ) : answer.score < 7 ? (
                  <Card className="bg-error items-center flex justify-between p-4">
                    <div>
                      <span className="text-white uppercase">TOTAL SCORE:</span>
                    </div>
                    <div>
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">{answer.score}</h2>
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-secondary items-center flex justify-between p-4">
                    <div>
                      <span className="text-white uppercase">TOTAL SCORE:</span>
                    </div>
                    <div>
                      <h2 className="font-normal text-white uppercase pt-2 mr-3">{answer.score}</h2>
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
                    <p className="m-0 text-muted">{answer.comment.substring(0, 10000)}</p>
                  ) : (
                    <p className="m-0 text-muted">Waiting for comments</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button className="mb-3 bg-primary text-white" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default Answers;
