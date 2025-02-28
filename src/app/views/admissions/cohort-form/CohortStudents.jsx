import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
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
  Tooltip,
  IconButton,
  InputAdornment,
  DialogContent,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.tz.guess();

import { format, set } from "date-fns";
import clsx from "clsx";
import { MatxLoading } from "matx";
import bc from "app/services/breathecode";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import { useQuery } from "../../../hooks/useQuery";
import { PickUserModal } from "app/components/PickUserModal";
import useDebounce from "../../../hooks/useDebounce";
import { Assessment, CodeOutlined } from "@material-ui/icons";
import { countBy } from "lodash";
import { ca } from "date-fns/locale";
import PlansDialog from "./PlansDialog";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const actionController = {
  message: {
    educational_status: "Educational Status",
    finantial_status: "Finantial Status",
    role: "Cohort Role",
    plan: "Plan",
    subscriptions_status: "Subscription Status"
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
    finantial_status: ["FULLY_PAID", "UP_TO_DATE", "LATE", ""],
    role: ["TEACHER", "ASSISTANT", "REVIEWER", "STUDENT"],
    plan: [""],
    subscriptions_status: [
      "FREE_TRIAL",
      "ACTIVE", 
      "CANCELLED", 
      "DEPRECATED", 
      "PAYMENT_ISSUE", 
      "ERROR", 
      "FULLY_PAID", 
      "EXPIRED"],
  },
};

const CohortStudents = ({ slug, cohortId }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [studenList, setStudentsList] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [addNewMember, setAddNewMember] = useState(false);
  const [openRoleDialog, setRoleDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [listLength, setListlength] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);
  // Redux actions and store

  const query = useQuery();

  const [queryLimit, setQueryLimit] = useState(query.get("limit") || 17);
  const [hasMore, setHasMore] = useState(true);

  const handlePaginationNextPage = () => {
    setQueryLimit((prevQueryLimit) => prevQueryLimit + 10);
  };

  const [plansDialog, setPlansDialog] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchPayment = async (query) => {
    try {
      const response = await bc.payments().getPaymentsMethods(query);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments: ", error);
    }
  };

  const fetchPlans = async (query) => {
    try {
      const response = await bc.payments().getPlanByCohort({ cohort: query });
      const plansNames = response.data.map((plan) => plan.slug);
      setPlansDialog(response.data);
      actionController.options.plan = plansNames;
    } catch (error) {
      console.error("Error fetching plansDialog: ", error);
    }
  };

  useEffect(() => {
    getCohortStudents();
    if (cohortId) fetchPlans(cohortId);
    fetchPayment();
  }, [queryLimit, cohortId]);

  React.useEffect(() => {
    if (debouncedSearchTerm || debouncedSearchTerm === "") {
      getCohortStudents({ like: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm]);

  const changeStudentStatus = (value, name, studentId) => {
    const student = studenList.find((s) => s.user.id === studentId);
    const sStatus = {
      role: student.role,
      finantial_status: student.finantial_status,
      educational_status: student.educational_status,
      subscriptions_status: student.subscriptions_status,
    };
    bc.admissions()
      .updateCohortUserInfo(cohortId, studentId, {
        ...sStatus,
        [name]: value,
      })
      .then((data) => {
        if (data.status >= 200) getCohortStudents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSubscriptionsStatus = (planSlug, query) => {
    setIsLoading(true);
    const _baseQuery = {
      plans: true,
      limit: queryLimit,
      offset: 0,
      ...query,
    };
    bc.payments()
    .getPlanSlugBySubscriptionStatus(planSlug, _baseQuery)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        console.log("Plan Data:", response.data);
        setPlanData(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching plan data:", error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  const getCohortStudents = (query) => {
    setIsLoading(true);
    const _baseQuery = {
      cohorts: slug,
      limit: queryLimit,
      offset: 0,
      plans: true,
      ...query,
    };
    bc.admissions()
      .getAllUserCohorts(_baseQuery)
      .then((data) => {
        if (data.status >= 200 && data.status < 300) {
          const { results, next } = data.data;
          setHasMore(next !== null);
          setIsLoading(false);
          setListlength(data.data.count);
          results.length < 1 ? setStudentsList([]) : setStudentsList(results);
        }
      })
      .catch((error) => error);
  };

  const addUserToCohort = (user_id) => {
    bc.admissions()
      .addUserCohort(cohortId, {
        user: user_id,
        role: "STUDENT",
        finantial_status: null,
        educational_status: "ACTIVE",
      })
      .then((data) => {
        if (data.status >= 200 && data.status < 300) getCohortStudents();
      })
      .catch((error) => error);
  };

  const deleteUserFromCohort = () => {
    bc.admissions()
      .deleteUserCohort(cohortId, currentStd.id)
      .then((data) => {
        if (data.ok) getCohortStudents();
      })
      .catch((error) => error);
    setOpenDialog(false);
  };

  const personsList = studenList
    .filter((p) => p.role?.toUpperCase() == "TEACHER")
    .concat(
      studenList.filter((p) => p.role?.toUpperCase() == "ASSISTANT"),
      studenList.filter((p) => p.role?.toUpperCase() == "REVIEWER"),
      studenList.filter((p) => p.role?.toUpperCase() == "STUDENT")
    );

  return (
    <Card className="p-4">
      {addNewMember && (
        <PickUserModal
          onClose={(profile) => {
            if (profile) addUserToCohort(profile.id);
            setAddNewMember(false);
          }}
          hint="Search name or email among your academy members"
        />
      )}
      {/* This Dialog opens the modal to delete the user in the cohort */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this user from cohort{" "}
          {slug.toUpperCase()}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Disagree
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => deleteUserFromCohort()}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* This Dialog opens the modal to delete the user in the cohort */}
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohort Members {listLength}</h4>
        <div className="text-muted text-13 font-medium">
          {format(new Date(), "MMM dd, yyyy")} at
          {format(new Date(), "HH:mm:aa")}
        </div>
      </div>
      <Divider className="mb-3" />

      <Grid container spacing={3} className="mb-3">
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Type search by student name or email"
            name="student-name-or-email"
            size="small"
            data-cy="student-name-or-email"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton edge="end" onClick={() => setSearchTerm("")}>
                      <Icon>close</Icon>
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setAddNewMember(true)}
          >
            Add student
          </Button>
        </Grid>
      </Grid>

      <div className="overflow-auto">
        {isLoading && <MatxLoading />}
        <div className="min-w-600">
          {personsList.length > 0 &&
            personsList.map((s, i) => (
              <div key={i} className="py-4">
                <Grid container alignItems="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <div className="flex">
                      <Avatar
                        className={clsx(
                          "h-full w-full mb-6 mr-2",
                          classes.avatar
                        )}
                        src={
                          s.user.profile !== undefined
                            ? s.user.profile.avatar_url
                            : ""
                        }
                      />
                      <div className="flex-grow">
                        <Link
                          to={`/${
                            s.role === "STUDENT"
                              ? "admissions/students"
                              : "admin/staff"
                          }/${s.user.id}`}
                        >
                          <h6 className="mt-0 mb-0 text-15 text-primary">
                            {s.user.first_name} {s.user.last_name}
                          </h6>
                        </Link>
                        <p className="mt-0 mb-6px text-13">
                          <span className="font-medium">
                            on {dayjs(s.created_at).format("YYYY-MM-DD")}
                          </span>
                        </p>
                        <p className="mt-0 mb-6px text-13">
                          <small
                            aria-hidden="true"
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "role",
                              });
                            }}
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: "pointer", margin: "0 3px" }}
                          >
                            {s.role}
                          </small>
                          {s.role === "STUDENT" && (
                            <>
                              <small
                                aria-hidden="true"
                                onClick={() => {
                                  setRoleDialog(true);
                                  setCurrentStd({
                                    id: s.user.id,
                                    positionInArray: i,
                                    action: "finantial_status",
                                  });
                                }}
                                className="border-radius-4 px-2 pt-2px bg-secondary"
                                style={{ cursor: "pointer", margin: "0 3px" }}
                              >
                                {s.finantial_status
                                  ? s.finantial_status
                                  : "NONE"}
                              </small>
                              <small
                                aria-hidden="true"
                                onClick={() => {
                                  setRoleDialog(true);
                                  setCurrentStd({
                                    id: s.user.id,
                                    positionInArray: i,
                                    action: "educational_status",
                                  });
                                }}
                                className="border-radius-4 px-2 pt-2px bg-secondary"
                                style={{ cursor: "pointer", margin: "0 3px" }}
                              >
                                {s.educational_status}
                              </small>
                              <small
                                aria-hidden="true"
                                onClick={() => {
                                  setRoleDialog(true);
                                  setCurrentStd({
                                    id: s.user.id,
                                    positionInArray: i,
                                    action: "subscriptions_status",
                                  });
                                }}
                                className="border-radius-4 px-2 pt-2px bg-secondary"
                                style={{ cursor: "pointer", margin: "0 3px" }}
                              >
                                {s?.subscription?.status?.toUpperCase() || "NO STATUS"}
                              </small>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="text-center"
                  >
                    <div className="flex justify-end items-center">
                      <IconButton
                        onClick={() => {
                          setCurrentStd({ id: s.user.id, positionInArray: i });
                          setOpenDialog(true);
                        }}
                      >
                        <Icon fontSize="small">delete</Icon>
                      </IconButton>
                      {s.role === "STUDENT" && (
                        <>
                        <Tooltip title="Create plan">
                          <IconButton
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                                action: "plan",
                              });
                            }}
                          >
                            <Icon fontSize="small">money</Icon>
                          </IconButton>
                        </Tooltip>
                          <Link
                            to={`/dashboard/student/${s.user.id}/cohort/${s.cohort.id}`}
                          >
                            <Tooltip title="Student<>Cohort Report">
                              <IconButton>
                                <Icon fontSize="small">assignment_ind</Icon>
                              </IconButton>
                            </Tooltip>
                          </Link>
                          {s.watching ? (
                            <Tooltip title="This student is being watched, click to stop watching">
                              <IconButton
                                onClick={() => {
                                  changeStudentStatus(
                                    false,
                                    "watching",
                                    s.user.id
                                  );
                                }}
                              >
                                <Icon fontSize="small" color="secondary">
                                  visibility
                                </Icon>
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Add this student to the watchlist">
                              <IconButton
                                onClick={() => {
                                  changeStudentStatus(
                                    true,
                                    "watching",
                                    s.user.id
                                  );
                                }}
                              >
                                <Icon fontSize="small">visibility_off</Icon>
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            ))}
          <div>
            <Button
              disabled={!hasMore}
              fullWidth
              className="text-primary bg-light-primary"
              onClick={() => {
                handlePaginationNextPage();
              }}
            >
              {hasMore ? "Load More" : "No more students to load"}
            </Button>
          </div>
        </div>
      </div>
      {/* This Dialog opens the modal for the user role in the cohort */}
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={openRoleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {currentStd.action === "plan"
            ? "Selecciona un Plan"
            : `Select a ${actionController.message[currentStd.action]}`}
        </DialogTitle>
        <DialogContent>
          {/* plans Dialog */}
          {currentStd.action === "plan" ? (
            <PlansDialog
              plansDialog={plansDialog}
              payments={payments}
              userId={currentStd.id}
              onClose={() => setRoleDialog(false)}
            />
          ) : (
            <List>
              {currentStd.action &&
                actionController.options[currentStd.action].map((opt, i) => (
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
                    key={i}
                  >
                    <ListItemText primary={opt} />
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CohortStudents;
