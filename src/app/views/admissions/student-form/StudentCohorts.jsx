import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Grid,
  Divider,
  Card,
  TextField,
  Icon,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
  Button,
  MenuItem,
  DialogActions,
  IconButton,
  Tooltip,
  DialogContent,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { MatxLoading } from "../../../../matx";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import bc from "../../../services/breathecode";
import axios from "../../../../axios";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import config from "../../../../config.js";
import { getSession } from "../../../redux/actions/SessionActions";
import BasicTabs from "app/components/smartTabs";
import Plans from "./student-tabs/Plans";
import Cohorts from "./student-tabs/Cohorts";

const propTypes = {
  stdId: PropTypes.number.isRequired,
};

const actionController = {
  message: {
    educational_status: "Educational Status",
    finantial_status: "Finantial Status",
    role: "Cohort Role",
    subscriptions_status: "Subscription Status",
    plan_financing_status: "Plan Financing Status",
  },
  options: {
    educational_status: [
      "ACTIVE",
      "POSTPONED",
      "SUSPENDED",
      "GRADUATED",
      "DROPPED",
      "NOT_COMPLETING",
    ],
    finantial_status: ["FULLY_PAID", "UP_TO_DATE", "LATE"],
    role: ["TEACHER", "ASSISTANT", "REVIEWER", "STUDENT"],
    subscriptions_status: ["ACTIVE", "ERROR", "FREE_TRIAL"],
    plan_financing_status: ["FREE_TRIAL", "ACTIVE", "ERROR"],
  },
};

const StudentCohorts = ({ stdId, setCohortOptions }) => {
  const [setMsg] = useState({ alert: false, type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openRoleDialog, setRoleDialog] = useState(false);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const session = getSession();
  const [planFinancingSlugs, setPlanFinancingSlugs] = useState([]);
  const [subscriptionSlugs, setSubscriptionSlugs] = useState([]);
  const [plansDialog, setPlansDialog] = useState([]);
  const [payments, setPayments] = useState([]);
  const params = useParams();

  console.log("PARAMS", params);

  const getStudentCohorts = () => {
    setIsLoading(true);
    bc.admissions()
      .getAllUserCohorts({
        users: stdId,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (data.length < 1) {
          // console.log("dataaaaaa", data)
          setStdCohorts([]);
        } else {
          // console.log("dataaaaaaDOSSSS", data)
          setStdCohorts(data);
          setCohortOptions(data);
        }
      })
      .catch((error) => error);
  };

  const changeStudentStatus = (value, name, studentId, i) => {
    const sStatus = {
      role: stdCohorts[i].role.toUpperCase(),
      finantial_status: stdCohorts[i].finantial_status,
      educational_status: stdCohorts[i].educational_status,
      subscriptions_status: stdCohorts[i].subscriptions_status,
      plan_financing_status: stdCohorts[i].plan_financing_status,
      [name]: value,
    };
    console.log("SSSSSSTATTTTUSSSS", sStatus);

    bc.admissions()
      .updateCohortUserInfo(stdCohorts[i].cohort.id, studentId, sStatus)
      .then((data) => {
        console.log("DATAAAAAAATRESSSSSSSS", data);
        if (data.status >= 200) getStudentCohorts();
      })
      .catch((error) => error);
  };

  const deleteUserFromCohort = () => {
    bc.admissions()
      .deleteUserCohort(currentStd.cohort_id, currentStd.id)
      .then((data) => {
        if (data.status === 204) getStudentCohorts();
      })
      .catch((error) => error);
    setOpenDialog(false);
  };
  const addUserToCohort = () => {
    if (cohort === null)
      setMsg({ alert: true, type: "warning", text: "Select a cohort" });
    else {
      bc.admissions()
        .addUserCohort(cohort.id, {
          user: stdId,
          role: "STUDENT",
          finantial_status: null,
          educational_status: "ACTIVE",
        })
        .then((data) => {
          if (data.status >= 200) getStudentCohorts();
        })
        .catch((error) => error);
    }
  };

  const tabs = [
    {
      disabled: false,
      component: (
        <>
          <Cohorts />
          <div className="overflow-auto">
          <div className="min-w-600">
            {stdCohorts.map((s, i) => (
              <div key={s.id} className="py-4">
                <Grid container alignItems="center">
                  <Grid item lg={4} md={4} sm={6} xs={6}>
                    <div className="flex">
                      <div className="flex-grow">
                        <Link to={`/admissions/cohorts/${s.cohort.slug}`}>
                          <h6 className="mt-0 mb-0 text-15 text-primary">
                            {s.cohort.name}
                            <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">
                              {s.cohort.stage}
                            </small>
                          </h6>
                        </Link>
                        <p className="mt-0 mb-6px text-13">
                          <span className="font-medium">
                            {dayjs(s.cohort.kickoff_date).format(
                              "DD MMMM, YYYY"
                            )}
                          </span>
                          <small>
                            , {dayjs(s.cohort.kickoff_date).fromNow()}
                          </small>
                        </p>
                        <p className="mt-0 mb-6px text-13">
                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "role",
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "role",
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: "pointer", margin: "0 3px" }}
                          >
                            {s.role}
                          </small>
                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "finantial_status",
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "finantial_status",
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: "pointer", margin: "0 3px" }}
                          >
                            {s.finantial_status ? s.finantial_status : "NONE"}
                          </small>
                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "educational_status",
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "educational_status",
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: "pointer", margin: "0 3px" }}
                          >
                            {s.educational_status}
                          </small>
                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "subscriptions_status",
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "subscriptions_status",
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{
                              cursor: "pointer",
                              margin: "0 3px",
                              color: "white",
                            }}
                          >
                            {subscriptionSlugs[i]?.plan?.toUpperCase() ||
                              "SUBSCRIPTION SLUG"}
                          </small>

                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "plan_financing_status",
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "plan_financing_status",
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{
                              cursor: "pointer",
                              margin: "0 3px",
                              color: "red",
                            }}
                          >
                            {planFinancingSlugs[i]?.plan?.toUpperCase() ||
                              "PLAN FINANCING SLUG"}
                          </small>
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        </div>

        <Dialog
          onClose={() => setRoleDialog(false)}
          open={openRoleDialog}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">{`Select a ${
            actionController.message[currentStd.action]
          }`}</DialogTitle>
          <List>
            {currentStd.action &&
              actionController.options[currentStd.action].map((opt) => (
                <ListItem
                  button
                  onClick={() => {
                    changeStudentStatus(
                      opt,
                      currentStd.action,
                      currentStd.id,
                      currentStd.positionInArray
                    );
                    setRoleDialog(false);
                  }}
                >
                  <ListItemText primary={opt} />
                </ListItem>
              ))}
          </List>
        </Dialog>
        </>
      ),
      label: "Cohorts",
    },
    {
      disabled: false,
      component: (
        <Plans stdId={params.stdId} stdCohorts={stdCohorts} />
      ),
      label: "Plans",
    },
  ];

  const getSubscriptionStatus = () => {
    setIsLoading(true);
    bc.payments()
      .getSubscription({ users: stdId })
      .then(({ data }) => {
        setIsLoading(false);
        console.log("Raw Subscription Data:", data);
        if (data.length > 0) {
          const slugs = data.map((subscription) => ({
            plans: subscription?.plans,
          }));
          console.log("SLUGS SUBSCRIPTION", slugs);
          setSubscriptionSlugs(slugs);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const getPlanFinancing = () => {
    setIsLoading(true);
    bc.payments()
      .getPlanFinancing({ users: stdId })
      .then(({ data }) => {
        setIsLoading(false);
        console.log("Raw PlanFinancing Data:", data);
        if (data.length > 0) {
          const slugs = data.map((planFinancing) => ({
            plan: planFinancing.plans[0]?.slug || "N/A",
            status: planFinancing.status,
          }));
          setPlanFinancingSlugs(slugs);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    getStudentCohorts();
    getSubscriptionStatus();
    getPlanFinancing();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={7} xs={12}>
          <BasicTabs tabs={tabs} />
        </Grid>
      </Grid>
      <Card className="p-4">
        {isLoading && <MatxLoading />}


      </Card>
    </>
  );
};

StudentCohorts.propTypes = propTypes;

export default StudentCohorts;
