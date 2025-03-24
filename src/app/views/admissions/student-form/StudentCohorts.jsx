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

const StudentCohorts = ({ stdId, setCohortOptions }) => {
  const [setMsg] = useState({ alert: false, type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openPlanDialog, setOpenPlanDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const session = getSession();
  const [planFinancing, setPlanFinancing] = useState([]);
  const [subscriptionSlugs, setSubscriptionSlugs] = useState([]);
  const [plansDialog, setPlansDialog] = useState([]);
  const [payments, setPayments] = useState([]);
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
        console.log("Raw Subscription Data:", data);
        if (data.length > 0) {
          const slugs = data.map((subscription) => ({
            plans: subscription?.plans,
            cohorts: subscription?.selected_cohort_set?.cohorts,
            id: subscription?.id,
            status: subscription?.status
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
        <Cohorts 
          stdCohorts={stdCohorts} 
          subscriptionSlugs={subscriptionSlugs}
          planFinancing={planFinancing}
          getStudentCohorts={getStudentCohorts}
          getPlanFinancing={getPlanFinancing}
          getSubscriptionStatus={getSubscriptionStatus}
        />
      ),
      label: "Cohorts",
    },
    {
      disabled: false,
      component: (
        <Plans stdId={params.stdId} stdCohorts={stdCohorts} planFinancing={planFinancing} />
      ),
      label: "Plans",
    },
  ];

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
