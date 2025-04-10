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
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
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

  console.log(subscriptionSlugs)

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
            subscriptions={subscriptionSlugs}
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
