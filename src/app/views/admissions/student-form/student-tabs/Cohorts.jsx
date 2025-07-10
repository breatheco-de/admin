import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    DialogTitle,
    Dialog,
    Grid,
    List,
    ListItemText,
    ListItem,
    Button,
    DialogActions,
    IconButton,
    Icon,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import dayjs from "dayjs";
import bc from "../../../../services/breathecode";
import { MatxLoading } from "../../../../../matx";
import { AsyncAutocomplete } from "../../../../components/Autocomplete";
import axios from "../../../../../axios";
import config from "../../../../../config";
import { getSession } from "../../../../redux/actions/SessionActions";

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

const Cohorts = ({
    stdCohorts,
    subscriptionSlugs,
    planFinancing,
    getStudentCohorts,
    getPlanFinancing,
    getSubscriptionStatus,
    stdId,
}) => {
    const [openRoleDialog, setRoleDialog] = useState(false);
    const [currentStd, setCurrentStd] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [cohort, setCohort] = useState(null);
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
    const session = getSession();

    const getSlugSubscriptionByCohort = (cohortId) => {
        const subscriptionSlug = subscriptionSlugs.filter((subscriptionSlug) =>
            subscriptionSlug.cohorts?.some((cohort) => cohort.id === cohortId)
        );
        return subscriptionSlug[0];
    };

    const getSlugPlanFinancingByCohort = (cohortId) => {
        const planFinancingSlug = planFinancing.filter((planF) =>
            planF.cohorts?.some((cohort) => cohort.id === cohortId)
        );
        return planFinancingSlug[0];
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

    const changeStudentStatus = ({
        value,
        name,
        studentId,
        i,
        subscriptionId,
        planFinancingId,
    }) => {
        const sStatus = {
            role: stdCohorts[i].role.toUpperCase(),
            finantial_status: stdCohorts[i].finantial_status,
            educational_status: stdCohorts[i].educational_status,
            subscriptions_status: stdCohorts[i].subscriptions_status,
            plan_financing_status: stdCohorts[i].plan_financing_status,
            [name]: value,
        };
        if (name === "subscriptions_status") {
            bc.payments()
                .updatedSubscription(subscriptionId, { status: value })
                .then(() => getSubscriptionStatus())
                .catch((error) => console.error("Update failed:", error));
        } else if (name === "plan_financing_status") {
            bc.payments()
                .updatedPlanFinancing(planFinancingId, { status: value })
                .then(() => getPlanFinancing())
                .catch((error) => console.error("Update failed:", error));
        } else {
            bc.admissions()
                .updateCohortUserInfo(stdCohorts[i].cohort.id, studentId, sStatus)
                .then((data) => {
                    if (data.status >= 200) getStudentCohorts();
                })
                .catch((error) => error);
        }
    };

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete this user from this cohort?
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
            {isLoading && <MatxLoading />}

            <div className="flex mb-6">
                <AsyncAutocomplete
                    onChange={(newCohort) => setCohort(newCohort)}
                    width="100%"
                    label="Search Cohorts"
                    getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                    asyncSearch={() =>
                        axios.get(
                            `${config.REACT_APP_API_HOST}/v1/admissions/academy/cohort`
                        )
                    }
                >
                    <Button
                        className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre"
                        onClick={() => addUserToCohort()}
                    >
                        Add to cohort
                    </Button>
                </AsyncAutocomplete>
            </div>

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
                                                    {dayjs(s.cohort.kickoff_date).format("DD MMMM, YYYY")}
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
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                    {getSlugSubscriptionByCohort(s.cohort?.id)?.plans?.map(subscription => (
                                                        <Tooltip title="Subscription Slug" key={subscription?.slug}>
                                                            <small
                                                                onClick={() => {
                                                                    setRoleDialog(true);
                                                                    setCurrentStd({
                                                                        id: s.user.id,
                                                                        positionInArray: i,
                                                                        action: "subscriptions_status",
                                                                        subscriptionId: getSlugSubscriptionByCohort(s.cohort?.id).id,
                                                                        status: getSlugSubscriptionByCohort(s.cohort?.id).status,
                                                                    });
                                                                }}
                                                                role="none"
                                                                className="border-radius-4 px-2 pt-2px bg-secondary"
                                                                style={{
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                    whiteSpace: "normal",
                                                                    margin: "3px",
                                                                }}
                                                            >
                                                                {subscription?.slug.toUpperCase() || "SUBSCRIPTION SLUG"}
                                                            </small>
                                                        </Tooltip>
                                                    ))}

                                                    {getSlugPlanFinancingByCohort(s.cohort?.id)?.plans?.map(planFinancing => (
                                                        <Tooltip title="Plan Financing Slug" key={planFinancing?.slug}>
                                                            <small
                                                                onClick={() => {
                                                                    setRoleDialog(true);
                                                                    setCurrentStd({
                                                                        id: s.user.id,
                                                                        positionInArray: i,
                                                                        action: "plan_financing_status",
                                                                        planFinancingId: getSlugPlanFinancingByCohort(s.cohort?.id).id,
                                                                        status: getSlugPlanFinancingByCohort(s.cohort?.id).status,
                                                                    });
                                                                }}
                                                                role="none"
                                                                className="border-radius-4 px-2 pt-2px bg-secondary"
                                                                style={{
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                    whiteSpace: "normal",
                                                                    margin: "3px",
                                                                }}
                                                            >
                                                                {planFinancing?.slug.toUpperCase() || "PLAN FINANCING SLUG"}
                                                            </small>
                                                        </Tooltip>
                                                    ))}
                                                </div>

                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={8} md={8} sm={6} xs={6} className="text-center">
                                    <div className="flex justify-end items-center">
                                        <IconButton
                                            onClick={() => {
                                                setCurrentStd({
                                                    id: s.user.id,
                                                    positionInArray: i,
                                                    cohort_id: s.cohort.id,
                                                });
                                                setOpenDialog(true);
                                            }}
                                        >
                                            <Icon fontSize="small">delete</Icon>
                                        </IconButton>
                                        <Tooltip title="Student Report">
                                            <IconButton
                                                onClick={() =>
                                                    window.open(
                                                        `${process.env.REACT_APP_STUDENT}/cohort/${s.cohort.slug}/student/${s.user.id}?academy=${session.academy.id}&token=${session.token}`
                                                    )
                                                }
                                            >
                                                <Icon fontSize="small">assignment_ind</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        {s.watching ? (
                                            <Tooltip title="This student is being watched, click to stop watching">
                                                <IconButton
                                                    onClick={() => {
                                                        changeStudentStatus({
                                                            value: false,
                                                            name: "watching",
                                                            studentId: s.user.id,
                                                            i,
                                                        });
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
                                                        changeStudentStatus({
                                                            value: true,
                                                            name: "watching",
                                                            studentId: s.user.id,
                                                            i,
                                                        });
                                                    }}
                                                >
                                                    <Icon fontSize="small">visibility_off</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        )}
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
                <DialogTitle id="simple-dialog-title">{`Select a ${actionController.message[currentStd.action]
                    }`}</DialogTitle>
                <List>
                    {currentStd.action &&
                        actionController.options[currentStd.action].map((opt) => (
                            <ListItem
                                key={opt}
                                button
                                disabled={currentStd.status === opt}
                                onClick={() => {
                                    changeStudentStatus({
                                        value: opt,
                                        name: currentStd.action,
                                        studentId: currentStd.id,
                                        i: currentStd.positionInArray,
                                        subscriptionId: currentStd.subscriptionId,
                                        planFinancingId: currentStd.planFinancingId,
                                    });
                                    setRoleDialog(false);
                                }}
                            >
                                <ListItemText primary={opt} />
                            </ListItem>
                        ))}
                </List>
            </Dialog>
        </>
    );
};

export default Cohorts;
