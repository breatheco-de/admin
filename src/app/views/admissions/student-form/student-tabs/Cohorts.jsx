import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    DialogTitle,
    Dialog,
    Grid,
    List,
    ListItemText,
    ListItem
} from "@material-ui/core";
import dayjs from "dayjs";
import bc from "../../../../services/breathecode";

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
    planFinancingSlugs,
    getStudentCohorts,
    getPlanFinancing,
    getSubscriptionStatus
}) => {
    const [openRoleDialog, setRoleDialog] = useState(false);
    const [currentStd, setCurrentStd] = useState({});

    console.log("planFinancingSlugs", planFinancingSlugs)

    const getSlugSubscriptionByCohort = (cohortId) => {
        const subscriptionSlug = subscriptionSlugs
            .filter(subscriptionSlug =>
                subscriptionSlug.cohorts?.some(cohort => cohort.id === cohortId)
            )
        return subscriptionSlug[0]
    };

    const getSlugPlanFinancingByCohort = (cohortId) => {
        const planFinancingSlug = planFinancingSlugs
            .filter(planFinancingSlug =>
                planFinancingSlug.cohorts?.some(cohort => cohort.id === cohortId)
            )
        return planFinancingSlug[0]
    };


    const changeStudentStatus = ({ value, name, studentId, i, subscriptionId, planFinancingId }) => {
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
                                                {getSlugSubscriptionByCohort(s.cohort?.id)?.plans?.map((subscription) => (
                                                    <small
                                                        onClick={() => {
                                                            setRoleDialog(true);
                                                            setCurrentStd({
                                                                id: s.user.id,
                                                                positionInArray: i,
                                                                action: "subscriptions_status",
                                                                subscriptionId: getSlugSubscriptionByCohort(s.cohort?.id).id,
                                                                status: getSlugSubscriptionByCohort(s.cohort?.id).status
                                                            });
                                                        }}
                                                        onKeyDown={() => {
                                                            setRoleDialog(true);
                                                            setCurrentStd({
                                                                id: s.user.id,
                                                                positionInArray: i,
                                                                action: "subscriptions_status",
                                                                subscriptionId: getSlugSubscriptionByCohort(s.cohort?.id).id,
                                                                status: getSlugSubscriptionByCohort(s.cohort?.id).status
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
                                                        {subscription?.slug.toUpperCase() || "SUBSCRIPTION SLUG"}
                                                    </small>
                                                ))}
                                                {getSlugPlanFinancingByCohort(s.cohort?.id)?.plans?.map((planFinancing) => (
                                                    <small
                                                        onClick={() => {
                                                            setRoleDialog(true);
                                                            setCurrentStd({
                                                                id: s.user.id,
                                                                positionInArray: i,
                                                                action: "plan_financing_status",
                                                                planFinancingId: getSlugPlanFinancingByCohort(s.cohort?.id).id,
                                                                status: getSlugPlanFinancingByCohort(s.cohort?.id).status
                                                            });
                                                        }}
                                                        onKeyDown={() => {
                                                            setRoleDialog(true);
                                                            setCurrentStd({
                                                                id: s.user.id,
                                                                positionInArray: i,
                                                                action: "plan_financing_status",
                                                                planFinancingId: getSlugPlanFinancingByCohort(s.cohort?.id).id,
                                                                status: getSlugPlanFinancingByCohort(s.cohort?.id).status
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
                                                        {planFinancing?.slug.toUpperCase() || "PLAN FINANCING SLUG"}
                                                    </small>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </div>
            </div >

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
                                // style={{ backgroundColor: currentStd.status === opt ? "lightgray" : null }}
                                disabled={currentStd.status === opt}
                                onClick={() => {
                                    changeStudentStatus({
                                        value: opt,
                                        name: currentStd.action,
                                        studentId: currentStd.id,
                                        i: currentStd.positionInArray,
                                        subscriptionId: currentStd.subscriptionId,
                                        planFinancingId: currentStd.planFinancingId
                                    });
                                    setRoleDialog(false);
                                }}
                            >   
                                {console.log("algo", opt, currentStd)}
                                <ListItemText primary={opt} />
                            </ListItem>
                        ))}
                </List>
            </Dialog>
        </>
    )
}

export default Cohorts