/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import AnswerStatus from '../../components/AnswerStatus';

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
      name: 'user__first_name', // field name in the row object
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
      <div>
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
      <AnswerStatus answer={answer} handleClose={handleClose} open={open} />
    </div>
  );
};

export default Answers;
