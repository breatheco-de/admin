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
import bc from "../../../services/breathecode";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import { getSession } from "../../../redux/actions/SessionActions";
import BasicTabs from "app/components/smartTabs";
import Plans from "./student-tabs/Plans";
import Cohorts from "./student-tabs/Cohorts";

const propTypes = {
  stdId: PropTypes.number.isRequired,
};

const StudentCohorts = ({ stdId, setCohortOptions }) => {
  const [setMsg] = useState({ alert: false, type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const session = getSession();
  const [planFinancing, setPlanFinancing] = useState([]);
  const [subscriptionSlugs, setSubscriptionSlugs] = useState([]);
  const params = useParams();

  const getStudentCohorts = () => {
    setIsLoading(true);
    bc.admissions()
      .getAllUserCohorts({
        users: stdId,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (data.length < 1) {
          setStdCohorts([]);
        } else {
          setStdCohorts(data);
          setCohortOptions(data);
        }
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

  const getSubscriptionStatus = () => {
    setIsLoading(true);
    bc.payments()
      .getSubscription({ users: stdId })
      .then(({ data }) => {
        setIsLoading(false);
        if (data.length > 0) {
          const slugs = data.map((subscription) => ({
            plans: subscription?.plans,
            cohorts: subscription?.selected_cohort_set?.cohorts,
            id: subscription?.id,
            status: subscription?.status,
          }));
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
        if (data.length > 0) {
          const slugs = data.map((planFinancing) => ({
            cohorts: planFinancing?.selected_cohort_set?.cohorts,
            ...planFinancing,
          }));
          setPlanFinancing(slugs);
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

  const tabs = [
    {
      disabled: false,
      component: (
        <Card className="p-4" style={{ height: "100%" }}>
          <Cohorts
            stdCohorts={stdCohorts}
            subscriptionSlugs={subscriptionSlugs}
            planFinancing={planFinancing}
            getStudentCohorts={getStudentCohorts}
            getPlanFinancing={getPlanFinancing}
            getSubscriptionStatus={getSubscriptionStatus}
          />
        </Card>
      ),
      label: "Cohorts",
    },
    {
      disabled: false,
      component: (
        <Card className="p-4" style={{ height: "100%" }}>
          <Plans
            stdId={params.stdId}
            stdCohorts={stdCohorts}
            planFinancing={planFinancing}
          />
        </Card>
      ),
      label: "Plans",
    },
  ];

  return (
    <>
      <Grid container spacing={3} style={{ width: "100%", height: "100vh" }}>
        <Grid item xs={12} style={{ height: "100%" }}>
          <BasicTabs tabs={tabs} style={{ height: "100%" }} />
        </Grid>
      </Grid>
      {isLoading && <MatxLoading />}
    </>
  );
};

StudentCohorts.propTypes = propTypes;

export default StudentCohorts;
