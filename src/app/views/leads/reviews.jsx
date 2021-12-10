/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Breadcrumb } from 'matx';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  Chip,
  LinearProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import bc from 'app/services/breathecode';
import AnswerStatus from '../../components/AnswerStatus';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  REQUESTED: 'text-white bg-warning',
  PENDING: 'text-white bg-error',
  DONE: 'text-white bg-green',
  IGNORE: 'light-gray',
};

const Reviews = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [review, setReview] = useState({
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
          const { author } = items[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={author?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {author?.first_name}
                  {' '}
                  {author?.last_name}
                </h5>
                <small className="text-muted">{author?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <Chip size="small" label={items[i]?.status} color={stageColors[items[i]?.status]} />
            {items[i].created_at ? (<>
                <h5 className="my-0 text-15">
                  {dayjs(items[i].created_at).format('MM-DD-YYYY')}
                </h5>
                <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
                </>) : (
                  <p className="mt-0">No date information</p>
                  )}
            </div>
          </div>
        ),
      },
    },
    {
      name: 'total_rating',
      label: 'Rating',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (i) => {
          const rating = items[i].total_rating;
          const previous_rating = items[i].nps_previous_rating;
          const color = rating > 4.5
            ? 'text-green'
            : rating < 4
              ? 'text-error'
              : 'text-orange';

          return (
            <div>
              {(rating) ? 
                <div>
                  <LinearProgress
                    color="secondary"
                    value={parseInt(rating, 10) * 10}
                    variant="determinate"
                  />
                  <small className={color}>{rating}</small>
                </div>
                :
                <p  className="my-0">No rating yet</p>
              }
              <div><small>NPS Avg: {previous_rating}</small></div>
            </div>)

        },
      },
    },
    {
      name: 'platform',
      label: 'Platform',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            {items[i].platform?.name}
          </div>
        ),
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const _review = items[dataIndex];
          if(['IGNORE', 'DONE'].includes(_review.status)) return _review.status;
          return (
          <>
            <div className="flex items-center">
              <div className="flex-grow" />
              <span>
                <IconButton
                  onClick={() => {
                    handleClickOpen(true);
                    setReview(_review);
                    setItems(items.map(r => (r.id != _review.id) ? r : { ...r, status: "DONE" }))
                    bc.feedback().updateReview(_review.id, { status: "DONE" });
                  }}
                >
                  <Icon>check</Icon>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleClickOpen(true);
                    setReview(_review);
                    setItems(items.map(r => (r.id != _review.id) ? r : { ...r, status: "IGNORE" }))
                    bc.feedback().updateReview(_review.id, { status: "IGNORE" });
                  }}
                >
                  <Icon>cancel</Icon>
                </IconButton>
              </span>
            </div>
          </>
        );
                },
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
                { name: 'Feedback', path: '/feedback/reviews' },
                { name: 'Review\'s List' },
              ]}
            />
          </div>

          {/* <div className="">
            <Link to="/feedback/survey/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary">
                Send new survey
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <SmartMUIDataTable
            title="All Reviews"
            columns={columns}
            items={items}
            view="reviews?"
            historyReplace="/feedback/reviews"
            singlePage=""
            search={async (querys) => {
              const { data } = await bc.feedback().getReviews(querys);
              setItems(data.results || data);
              return data;
            }}
          />
        </div>
      </div>
    {/* <AnswerStatus review={review} handleClose={handleClose} open={open}/> */}
    </div>
  );
};

export default Reviews;
