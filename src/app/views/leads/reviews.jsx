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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { makeStyles } from '@material-ui/core/styles';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import AnswerStatus from '../../components/AnswerStatus';
import SingleDelete from '../../components/ToolBar/SingleDelete';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  REQUESTED: 'text-white bg-warning',
  PENDING: 'text-white bg-error',
  DONE: 'text-white bg-green',
  IGNORE: 'light-gray',
};

const useStyles = makeStyles(() => ({
  dialogue: {
    color: 'rgba(52, 49, 76, 1)',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  select: {
    width: '15rem',
  },
  title: {
    textAlign: 'center',
  },
  dialogContent: {
    width: '80%',
    margin: 'auto',
  },
}));

const Reviews = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [toIgnore, setToIgnore] = useState(null);
  const [review, setReview] = useState(null);
  // const [reviewDetails, setReviewDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const ignoreReview = (_review) => {
    handleClickOpen(true);
    // setReview(_review);
    setItems(items.map((r) => ((r.id != _review.id) ? r : { ...r, status: 'IGNORE' })));
    return bc.feedback().updateReview(_review.id, { status: 'IGNORE' });
  };

  const URL = /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

  const ProfileSchema = Yup.object().shape({
    rating:
      Yup.number()
        .required().positive('Must a positive number')
        .integer()
        .min(1, 'Must not be lower than one')
        .max(5, 'Must not be bigger than five'),
    url: Yup.string().matches(URL, 'Enter a valid url').required('Please write a URL'),
    comment: Yup.string().required('Please write a Comment'),
  });

  // const [review, setReview] = useState({
  //   color: '',
  //   score: '',
  //   title: '',
  //   comment: '',
  //   highest: '',
  //   lowest: '',
  //   user: {
  //     imgUrl: '',
  //     first_name: '',
  //     last_name: '',
  //   },
  //   academy: {
  //     name: '',
  //     slug: '',
  //   },
  // });

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
        customBodyRenderLite: (i) => {
          let newDay = dayjs(items[i].updated_at).add(dayjs.duration({ 'days': 30 }))
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Chip size="small" label={items[i]?.status} color={stageColors[items[i]?.status]} />
                <p className="my-0"><small className={`text-muted ${!dayjs().isBefore(newDay) ? 'text-error' : ''}`}>
                  {dayjs(items[i].updated_at).fromNow()}
                  </small>
                </p>
              </div>
            </div>
          )
        },
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
              {(rating)
                ? (
                  <div>
                    <LinearProgress
                      color="secondary"
                      value={parseInt(rating, 10) * 20}
                      variant="determinate"
                    />
                    <small className={color}>{rating}</small>
                  </div>
                )
                : <p className="my-0">No rating yet</p>}
              <div>
                <small>
                  NPS Avg:
                  {previous_rating}
                </small>
              </div>
            </div>
          );
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
          if (['IGNORE', 'DONE'].includes(_review.status)) return _review.status;
          return (
            <>
              <div className="flex items-center">
                <div className="flex-grow" />
                <span>
                  <IconButton
                    onClick={() => {
                    // handleClickOpen(true);
                    // setReview(_review);
                    // setItems(items.map(r => (r.id != _review.id) ? r : { ...r, status: "DONE" }))
                    // bc.feedback().updateReview(_review.id, { status: "DONE" });

                      setReview(_review);
                      setOpenDialog(true);
                    }}
                  >
                    <Icon>check</Icon>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setToIgnore(_review);
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
                { name: "Review's List" },
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
            historyReplace="/growth/reviews"
            singlePage=""
            tableOptions={{
              selectableRows: false,
              print: false,
              viewColumns: false
            }}
            search={async (querys) => {
              const { data } = await bc.feedback().getReviews(querys);
              setItems(data.results || data);
              return data;
            }}
          />
          {toIgnore && (
            <SingleDelete
              deleting={() => {
                ignoreReview(toIgnore);
              }}
              onClose={setToIgnore}
              message="Are you sure you want to ignore this review"
            />
          )}
          {review && (
            <Dialog
              onClose={() => {
                setOpenDialog(false);
                setReview(null);
              }}
              fullWidth
              maxWidth="sm"
              open={openDialog}
              aria-labelledby="simple-dialog-title"
            >
              <DialogTitle id="simple-dialog-title" className={classes.title}>
                Write the details of the review
              </DialogTitle>
              <Formik
                initialValues={{
                  rating,
                  url,
                  comment,
                }}
                enableReinitialize
                validationSchema={ProfileSchema}
                onSubmit={async () => {
                  const data = {
                    status: 'DONE',
                    total_rating: rating,
                    public_url: url,
                    comments: comment,
                  };

                  const result = await bc.feedback().updateReview(review.id, data);
                  if (result.status >= 200 && result.status < 300) {
                    setItems(items.map((r) => ((r.id != review.id) ? r : { ...r, status: 'DONE' })));
                  }
                  setReview(null);
                  setOpenDialog(false);
                }}
              >
                {({ errors, touched, handleSubmit }) => (
                  <form
                    onSubmit={handleSubmit}
                    className="d-flex justify-content-center mt-0 p-4"
                  >
                    <DialogContent className={classes.dialogContent}>
                      <DialogContentText className={classes.dialogue}>
                        Select a rating:
                      </DialogContentText>
                      <TextField
                        error={errors.rating && touched.rating}
                        helperText={touched.rating && errors.rating}
                        label="Rating"
                        name="rating"
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: 5 } }}
                        size="small"
                        fullWidth
                        variant="outlined"
                        defaultValue={rating}
                        onChange={(e) => {
                          setRating(e.target.value);
                        }}
                      />

                      <DialogContentText className={classes.dialogue}>
                        Review URL:
                      </DialogContentText>
                      <TextField
                        error={errors.url && touched.url}
                        helperText={touched.url && errors.url}
                        name="url"
                        size="small"
                        variant="outlined"
                        value={url}
                        fullWidth
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                      />

                      <DialogContentText className={classes.dialogue}>
                        Comments:
                      </DialogContentText>
                      <TextField
                        error={errors.comment && touched.comment}
                        helperText={touched.comment && errors.comment}
                        name="comment"
                        size="small"
                        variant="outlined"
                        value={comment}
                        multiline
                        rows={4}
                        fullWidth
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />
                    </DialogContent>
                    <DialogActions className={classes.button}>
                      <Button color="primary" variant="contained" type="submit">
                        Send now
                      </Button>
                    </DialogActions>
                  </form>
                )}
              </Formik>
            </Dialog>
          )}

        </div>
      </div>
      {/* <AnswerStatus review={review} handleClose={handleClose} open={open}/> */}
    </div>
  );
};

export default Reviews;
