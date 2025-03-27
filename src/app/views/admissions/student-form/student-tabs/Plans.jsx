import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
    DialogTitle,
    Dialog,
    Button,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PlansDialog from "../../cohort-form/PlansDialog";
import bc from "../../../../services/breathecode";

const Plans = ({ stdId, stdCohorts, planFinancing }) => {
    const [plansDialog, setPlansDialog] = useState([]);
    const [payments, setPayments] = useState([]);
    const [openPlanDialog, setOpenPlanDialog] = useState(false);
    const [cohortId, setCohortId] = useState(null);

    const fetchPlans = async (query) => {
        try {
            const response = await bc.payments().getPlanByCohort({ cohort: query });
            setPlansDialog(response.data);
        } catch (error) {
            console.error("Error fetching plansDialog: ", error);
        }
    };

    const fetchPayment = async (query) => {
        try {
            const response = await bc.payments().getPaymentsMethods(query);
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments: ", error);
        }
    };

    useEffect(() => {
        if (stdCohorts) fetchPlans(cohortId);
        fetchPayment();
    }, [cohortId]);

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium"></h4>
                <Button
                    className="px-7 font-medium text-primary bg-light-primary whitespace-pre"
                    onClick={() => setOpenPlanDialog(true)}
                >
                    Add to plan
                </Button>
            </div>
            <div className="overflow-auto">
                <div className="min-w-600">
                    {planFinancing.map((planF, i) => (
                        <div key={planF.id} className="py-4">
                            <Grid container alignItems="center" justifyContent="start">
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <div className="flex-grow w-full">
                                        <h6 className="mt-2 mb-2 text-15 text-primary flex items-center">
                                            How Many Installments:
                                            <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">
                                                {planF.how_many_installments}
                                            </small>
                                        </h6>

                                        <h6 className="mt-2 mb-2 text-15 text-primary flex items-center">
                                            Monthly Price:
                                            <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">
                                                {planF.monthly_price}
                                            </small>
                                            <small className="ml-1 text-black">
                                                {planF.plans[0]?.financing_options?.[0]?.currency?.code ?? ""}
                                            </small>
                                        </h6>

                                        <h6 className="mt-2 mb-2 text-15 text-primary flex items-center">
                                            Next Payment At:
                                            <small className="border-radius-4 ml-2 px-1 pt-2px text-black" style={{ fontWeight: 500, fontSize: "13px", background: "none" }}>
                                                {dayjs(planF.next_payment_at).format("DD MMMM, YYYY")}
                                            </small>
                                            <small className="ml-1 text-black" style={{ fontWeight: 400, fontSize: "10px" }}>
                                                , {dayjs(planF.next_payment_at).fromNow()}
                                            </small>
                                        </h6>

                                        <h6 className="mt-2 mb-2 text-15 text-primary flex items-center">
                                            Plan Expires At:
                                            <span className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                {dayjs(planF.plan_expires_at).format("DD MMMM, YYYY")}
                                            </span>
                                            <small className="ml-1 text-black" style={{ fontWeight: 400, fontSize: "10px" }}>
                                                , {dayjs(planF.plan_expires_at).fromNow()}
                                            </small>
                                        </h6>

                                        <h6 className="mt-2 mb-2 text-15 text-primary flex items-center">
                                            Valid Until:
                                            <span className="ml-2 text-black" style={{ fontWeight: 500, fontSize: "13px" }}>
                                                {dayjs(planF.valid_until).format("DD MMMM, YYYY")}
                                            </span>
                                            <small className="ml-1 text-black" style={{ fontWeight: 400, fontSize: "10px" }}>
                                                , {dayjs(planF.valid_until).fromNow()}
                                            </small>
                                        </h6>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    ))}

                </div>
            </div>
            <Dialog
                onClose={() => setOpenPlanDialog(false)}
                open={openPlanDialog}
                aria-labelledby="simple-dialog-title"
                fullWidth
            >
                <DialogTitle style={{ textAlign: "center" }}>
                </DialogTitle>
                <DialogContent>
                    {/* plans Dialog */}
                    <PlansDialog
                        plansDialog={plansDialog}
                        payments={payments}
                        userId={stdId}
                        stdCohorts={stdCohorts}
                        setCohortId={setCohortId}
                        onClose={() => setOpenPlanDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Plans;
