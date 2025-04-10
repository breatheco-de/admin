import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useAuth from "../../../../hooks/useAuth";

import {
    DialogTitle,
    Dialog,
    Button,
    DialogContent,
    Grid,
    Divider,
} from "@material-ui/core";
import PlansDialog from "../../cohort-form/PlansDialog";
import bc from "../../../../services/breathecode";

const Plans = ({ stdId, planFinancing, subscriptions = [] }) => {
    const [plansDialog, setPlansDialog] = useState([]);
    const [payments, setPayments] = useState([]);
    const [openPlanDialog, setOpenPlanDialog] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (openPlanDialog) {
            bc.payments().getAcademyPlans()
                .then(response => {
                    setPlansDialog(response.data);
                })
                .catch(error => {
                    console.error("Error fetching academy plans:", error);
                });

            bc.payments().getPaymentsMethods({ academy_id: user?.academy?.id })
                .then(response => {
                    const uniqueMethods = Array.from(
                        new Map(response.data.map(method => [method.title, method])).values()
                    );
                    setPayments(uniqueMethods);
                })
                .catch(error => {
                    console.error("Error fetching payment methods:", error);
                });
        }
    }, [openPlanDialog]);

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium">Student Plans</h4>
                <Button
                    className="px-7 font-medium text-primary bg-light-primary whitespace-pre"
                    onClick={() => setOpenPlanDialog(true)}
                >
                    Add to plan
                </Button>
            </div>
            <Divider className="my-2" />
            <div className="overflow-auto">
                <div className="min-w-600">
                    {subscriptions && subscriptions.length > 0 && (
                        <>
                            <h5 className="mt-4 mb-2 font-medium">Subscriptions</h5>
                            {subscriptions.map((sub, i) => (
                                <div key={`sub-${sub.id}`} className="py-2">
                                    <Grid container alignItems="center" justifyContent="start">
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <div className="flex-grow w-full mt-2">
                                                <h5 className="text-15 text-primary flex items-center">
                                                    Plan: {sub.plans && sub.plans.length > 0 ? sub.plans[0].slug : "N/A"}
                                                </h5>
                                                <h6 className="text-15 text-primary flex items-center">
                                                    Status:
                                                    <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">
                                                        {sub.status}
                                                    </small>
                                                </h6>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                        </>
                    )}

                    {planFinancing && planFinancing.length > 0 && (
                        <>
                            {subscriptions && subscriptions.length > 0 && <Divider className="my-2" />}
                            <h5 className="mt-4 mb-2 text-18 font-medium">Plan Financings</h5>
                            {planFinancing.map((planF, i) => (
                                <div key={planF.id} className="py-4">
                                    <Grid container alignItems="center" justifyContent="start">
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <div className="flex-grow w-full">
                                                <h6 className="mt-0 mb-2 text-16 text-primary">
                                                    {planF.plans[0]?.slug}
                                                </h6>
                                                <h6 className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                    How Many Installments: {planF.how_many_installments}
                                                </h6>

                                                <h6 className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                    Monthly Price: {planF.monthly_price}
                                                </h6>

                                                <h6 className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                    Next Payment At: {dayjs(planF.next_payment_at).format("DD MMMM, YYYY")}
                                                </h6>

                                                <h6 className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                    Plan Expires At: {dayjs(planF.plan_expires_at).format("DD MMMM, YYYY")}
                                                </h6>

                                                <h6 className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                    Valid Until: {dayjs(planF.valid_until).format("DD MMMM, YYYY")}
                                                </h6>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                        </>
                    )}

                    {subscriptions.length === 0 && planFinancing.length === 0 && (
                        <div className="text-center py-6">
                            <p>No plans have been assigned to this student yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <Dialog
                onClose={() => setOpenPlanDialog(false)}
                open={openPlanDialog}
                aria-labelledby="simple-dialog-title"
                fullWidth
            >
                <DialogTitle style={{ textAlign: "center" }}>
                    Add Plan to Student
                </DialogTitle>
                <DialogContent>
                    <PlansDialog
                        plansDialog={plansDialog}
                        payments={payments}
                        userId={stdId}
                        onClose={() => setOpenPlanDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Plans;
