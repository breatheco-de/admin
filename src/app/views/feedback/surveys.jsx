import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { MatxLoading } from "matx";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { addHours } from 'date-fns';
import bc from 'app/services/breathecode';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../../matx';
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import SingleDelete from '../../components/ToolBar/ConfirmationDialog';
import StatusTable from './StatusTable';
import axios from '../../../axios';
import { useQuery } from '../../hooks/useQuery';
import config from '../../../config.js';

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
  PENDING: 'bg-secondary',
  STARTED: 'text-white bg-warning',
  FINAL_PROJECT: 'text-white bg-error',
  FATAL: 'bg-error',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const defaultBg = 'bg-gray';

const SurveyList = () => {
  const { settings } = useSelector(({ layout }) => layout);
  const [items, setItems] = useState([]);
  const query = useQuery();
  const [templates, setTemplates] = useState([]);
  const [scoreFilter, setScoreFilter] = useState({ operator: 'gt', value: 7 });

  const [openDialog, setOpenDialog] = useState(false);
  const [url, setUrl] = useState('');

  const [toResend, setToResend] = useState(null);
  const [status, setStatus] = useState({ open: false, value: null });

  // Load all templates when component mounts
  useEffect(() => {
    axios.get(`${config.REACT_APP_API_HOST}/v1/feedback/academy/survey/template?is_shared=true&lang=en`)
      .then(response => {
        console.log("Templates loaded:", response.data);
        // The API returns the templates directly as an array
        if (response.data) {
          setTemplates(response.data);
        }
      })
      .catch(error => console.error("Error loading templates:", error));
  }, []);

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

  const showStatus = (item) => {
    setStatus({ open: true, value: JSON.parse(item.status_json) });
  }

  const isExpired = (item) => {
    // return finalizacion < dayjs(item.datetime + item.duration)

    return new Date() < dayjs(item.datetime + item.duration)
  }

  const statusMsg = (item) => {
    if (item.status === "SEND" && isExpired(item)) {
      return "EXPIRED";
    } else if (item.status === "SEND") {
      return "SENT";
    }
    return item?.status;
  }

  const columns = [
    {
      name: "title", // field name in the row object
      label: "Survey Title", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3" style={{ width: "100%" }}>
                <h5 className="my-0 text-18 font-weight-bold">{item?.title || "Untitled Survey"}</h5>
                <small className="text-muted">{item?.template_slug || "No template"}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "cohort", // field name in the row object
      label: "Cohort Slug", // column title that will be shown in table
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
      name: "status", // Combined field
      label: "Status",
      options: {
        filter: true,
        filterType: 'custom',
        filterList: query.get('status') !== null ? [query.get('status')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div style={{ width: '100%' }}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={filterList[index][0] || ''}
                    onChange={(e) => {
                      filterList[index] = e.target.value ? [e.target.value] : [];
                      onChange(filterList[index], index, column);
                    }}
                    label="Status"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="SENT">SENT</MenuItem>
                    <MenuItem value="PARTIAL">PARTIAL</MenuItem>
                    <MenuItem value="FATAL">FATAL</MenuItem>
                  </Select>
                </FormControl>
              </div>
            );
          }
        },
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Tooltip 
                  style={{ cursor: 'pointer' }} 
                  title={item.status_json? "Click to view Status Json" : "No Status Json"} 
                  onClick={() => { showStatus(item) }}
                >
                  <small
                    className={`border-radius-4 px-2 pt-2px text-white ${stageColors[item?.status] || defaultBg}`}
                  >
                    {statusMsg(item)}
                  </small>
                </Tooltip>
                {item.sent_at && (
                  <div className="mt-1">
                    <small className="text-muted">{dayjs(item.sent_at).format("MM-DD-YYYY")}</small>
                    <small className="text-muted ml-2">({dayjs(item.sent_at).fromNow()})</small>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "total_score",
      label: "Score",
      options: {
        filter: true,
        filterType: 'custom',
        filterList: query.get('total_score') !== null ? [query.get('total_score')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            // Parse initial filter value if any
            const currentFilter = filterList[index][0] || '';
            const initOperator = currentFilter.endsWith('+') ? 'gt' : 
                                currentFilter.endsWith('-') ? 'lt' : 'eq';
            const initValue = parseInt(currentFilter.replace(/[+-]/g, '')) || 7;
            
            // Initialize state if not already set
            if (scoreFilter.value !== initValue || scoreFilter.operator !== initOperator) {
              setScoreFilter({ operator: initOperator, value: initValue });
            }
            
            return (
              <div style={{ width: '100%' }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <InputLabel id="score-operator-label">Operator</InputLabel>
                      <Select
                        labelId="score-operator-label"
                        value={scoreFilter.operator}
                        onChange={(e) => {
                          const newScoreFilter = { ...scoreFilter, operator: e.target.value };
                          setScoreFilter(newScoreFilter);
                          
                          // Format for total_score query param
                          let filterValue = `${newScoreFilter.operator}:${newScoreFilter.value}`;
                          filterList[index] = [filterValue];
                          onChange(filterList[index], index, column);
                        }}
                        label="Operator"
                      >
                        <MenuItem value="gt">Greater than</MenuItem>
                        <MenuItem value="lt">Less than</MenuItem>
                        <MenuItem value="eq">Equal to</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Value"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={scoreFilter.value}
                      inputProps={{ min: 1, max: 10, step: 1 }}
                      onChange={(e) => {
                        const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10);
                        const newScoreFilter = { ...scoreFilter, value };
                        setScoreFilter(newScoreFilter);
                        
                        // Format for total_score query param
                        let filterValue;
                        if (newScoreFilter.operator === 'gt') {
                          filterValue = `${value}+`;
                        } else if (newScoreFilter.operator === 'lt') {
                          filterValue = `${value}-`;
                        } else {
                          filterValue = `${value}`;
                        }
                        
                        filterList[index] = [filterValue];
                        onChange(filterList[index], index, column);
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            );
          }
        },
        customBodyRenderLite: (i) => {
          const avg_score = items[i].scores?.total || null;
          const color =
            avg_score > 7
              ? "text-green"
              : avg_score < 7
                ? "text-error"
                : "text-orange";
          if (avg_score) {
            return (
              <div className="flex items-center">
                <LinearProgress
                  color="secondary"
                  value={parseInt(avg_score, 10) * 10}
                  variant="determinate"
                />
                <small className={color}>
                  {Math.round(avg_score * 100) / 100}
                </small>
              </div>
            );
          }
          return "No avg yet";
        },
      },
    },
    {
      name: "template_slug",
      label: "Template",
      options: {
        filter: true,
        filterType: 'custom',
        filterList: query.get('template_slug') !== null ? [query.get('template_slug')] : [],
        display: false,
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div style={{ width: '100%' }}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel id="template-select-label">Template</InputLabel>
                  <Select
                    labelId="template-select-label"
                    value={filterList[index][0] || ''}
                    onChange={(e) => {
                      filterList[index] = e.target.value ? [e.target.value] : [];
                      onChange(filterList[index], index, column);
                    }}
                    label="Template"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {Array.isArray(templates) && templates.map((template) => (
                      <MenuItem key={template.id} value={template.slug}>
                        {template.slug}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            );
          }
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

  if (!items) return <MatxLoading />;

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
            options={{
              print: false,
              viewColumns: false,
              onFilterChipClose: async (index, removedFilter, filterList) => {
                setTemplates([]);
                const querys = {};
                const { data } = await bc.feedback().getSurveys(querys);
                setItems(data.results);
              },
            }}
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
      {status.open && (
        <StatusTable
          openDialog={status.open}
          setOpenDialog={setStatus}
          status={status.value}
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

export default SurveyList;
