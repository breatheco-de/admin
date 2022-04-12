import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Icon,
  IconButton,
  Button,
  LinearProgress,
  Tooltip,
  Chip,
  Grid,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { addHours } from 'date-fns';
import bc from 'app/services/breathecode';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../../matx';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import SingleDelete from '../../components/ToolBar/SingleDelete';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const stageColors = {
  INACTIVE: 'bg-gray',
  SENT: 'bg-gray',
  PREWORK: 'bg-secondary',
  PENDING : 'bg-secondary',
  STARTED: 'text-white bg-warning',
  FINAL_PROJECT: 'text-white bg-error',
  FATAL: 'bg-error',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const EventList = () => {
  const { settings } = useSelector(({ layout }) => layout);
  const [items, setItems] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [url, setUrl] = useState('');

  const [toResend, setToResend] = useState(null);

  const resendSurvey = (survey) => {
    bc.feedback()
      .updateSurvey({
        cohort: survey.cohort.id, 
        send_now: true
      }, 
      survey.id)
      .then(({ data }) => console.log(data))
      .catch((error) => console.error(error));
  };

  const isExpired = (item) => {
    // return finalizacion < dayjs(item.datetime + item.duration)

    return new Date() < dayjs(item.datetime + item.duration)
  }

  const columns = [
    {
      name: "id", // field name in the row object
      label: "ID", // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: "cohort", // field name in the row object
      label: "Cohort", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Link
                  to={`/admissions/cohorts/${item?.cohort?.slug}`}
                  style={{ textDecoration: "underline" }}
                >
                  <h5 className="my-0 text-15">{item?.cohort?.name}</h5>
                </Link>
                <small className="text-muted">{item?.cohort?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "status", // field name in the row object
      label: "Status", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];

          if (item.status === "SEND" && isExpired(item)) {
            return (
              <div className="flex items-center">
                <div className="ml-3">
                  <Tooltip title={"EXPIRED"}>
                    <small
                      className={`border-radius-4 px-2 pt-2px${
                        stageColors[item?.status]
                      }`}
                    >
                      {"EXPIRED"}
                    </small>
                  </Tooltip>
                </div>
              </div>
            );
          } else if (item.status === "SEND") {
            return (
              <div className="flex items-center">
                <div className="ml-3">
                  <Tooltip title={"SEND"}>
                    <small
                      className={`border-radius-4 px-2 pt-2px${
                        stageColors[item?.status]
                      }`}
                    >
                      {"SENT"}
                    </small>
                  </Tooltip>
                </div>
              </div>
            );
          }

          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Tooltip title={item?.status}>
                  <small
                    className={`border-radius-4 px-2 pt-2px text-white ${
                      stageColors[item?.status]
                    }`}
                  >
                    {item?.status}
                  </small>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "sent_at",
      label: "Sent date",
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center"  style={{ width: "80%" }}>
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items[i].sent_at).format("MM-DD-YYYY")}
              </h5>
              <small className="text-muted">
                {dayjs(items[i].sent_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: "avg_score",
      label: "Score",
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const color =
            items[i].avg_score > 7
              ? "text-green"
              : items[i].avg_score < 7
              ? "text-error"
              : "text-orange";
          if (items[i].avg_score) {
            return (
              <div className="flex items-center">
                <LinearProgress
                  color="secondary"
                  value={parseInt(items[i].avg_score, 10) * 10}
                  variant="determinate"
                />
                <small className={color}>
                  {Math.round(items[i].avg_score * 100) / 100}
                </small>
              </div>
            );
          }
          return "No avg yet";
        },
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const survey = items[dataIndex];
          return (
            <div className="flex items-center">
              {/* <div className="flex-grow" /> */}
              {survey.status !== "FATAL" && !isExpired(survey) &&
                <>
                  <Tooltip title="Copy survey link">
                    <IconButton
                      onClick={() => {
                        console.log(survey.public_url);
                        setOpenDialog(true);
                        setUrl(survey.public_url);
                      }}
                    >
                      <Icon>assignment</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Resend Survey">
                    <IconButton onClick={() =>
                      setToResend(survey)
                      // resendSurvey(survey)
                    }>
                      <Icon>refresh</Icon>
                    </IconButton>
                  </Tooltip>
                </>
              }
              <Link
                to={`/feedback/surveys/${survey?.cohort?.slug}/${survey?.id}`}
              >
                <IconButton>
                  <Icon>arrow_right_alt</Icon>
                </IconButton>
              </Link>
            </div>
          )
        },
      },
    },
  ];

  return (
    <>
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <Breadcrumb
                routeSegments={[
                  { name: 'Feedback', path: '/feedback/surveys' },
                  { name: 'Survey List' },
                ]}
              />
            </div>

            {settings.beta && (
              <div className="">
                <Link to="/feedback/survey/new" color="primary" className="btn btn-primary">
                  <Button variant="contained" color="primary">
                    Add new survey
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-auto">
          <SmartMUIDataTable
            title="All Surveys"
            columns={columns}
            items={items}
            view="survey?"
            historyReplace="/feedback/surveys"
            singlePage=""
            search={async (querys) => {
              const { data } = await bc.feedback().getSurveys(querys);
              setItems(data.results);
              return data;
            }}
            deleting={async (querys) => {
              const { status } = await bc.feedback().deleteSurveysBulk(querys);
              return status;
            }}
          />
        </div>
      </div>
      {toResend && (
        <SingleDelete
          deleting={() => {
            resendSurvey(toResend);
          }}
          onClose={setToResend}
          message="Are you sure you want to resend this survey?"
        />
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <form className="p-4">
          <DialogTitle id="form-dialog-title">Survey public URL</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item md={12} sm={12} xs={10}>
                <TextField
                  label="URL"
                  name="url"
                  size="medium"
                  // disabled
                  fullWidth
                  variant="outlined"
                  value={url}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Grid className="p-2">
            <DialogActions>
              <Button
                className="bg-primary text-white"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success('Invite url copied successfuly', toastOption);
                }}
                autoFocus
              >
                Copy
              </Button>
              <Button color="danger" variant="contained" onClick={() => setOpenDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Grid>
        </form>
      </Dialog>
    </>
  );
};

export default EventList;
