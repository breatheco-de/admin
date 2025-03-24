import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
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

    const fetchPlans = async (query) => {
        try {
            const response = await bc.payments().getPlanByCohort({ cohort: query });
            const plansNames = response.data.map((plan) => plan.slug);
            setPlansDialog(response.data);
            // actionController.options.plan = plansNames;
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
        // if (stdCohorts) fetchPlans(stdCohorts);
        if (stdCohorts) fetchPlans(641);
        fetchPayment();
    }, [stdCohorts]);

    console.log("planFinancing", planFinancing);

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
                            <Grid container alignItems="center">
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <div className="flex">
                                        <div className="flex-grow">
                                            <Link to={`/admissions/cohorts/${planF.id}`}>
                                                <h6 className="mt-0 mb-0 text-15 text-primary">
                                                    {planF.status}
                                                    <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">
                                                        {planF.status}
                                                    </small>
                                                </h6>
                                            </Link>
                                            <p className="mt-0 mb-6px text-13">
                                                <span className="font-medium">
                                                    {dayjs(planF.valid_until).format("DD MMMM, YYYY")}
                                                </span>
                                                <small>
                                                    , {dayjs(planF.valid_until).fromNow()}
                                                </small>
                                            </p>
                                            <p className="mt-0 mb-6px text-13"><small>{planF.how_many_installments}</small></p>
                                            <p className="mt-0 mb-6px text-13"><small>{planF.monthly_price}</small></p>
                                            <p className="mt-0 mb-6px text-13"><small>Next payment at: {dayjs(planF.next_payment_at).format("DD/MM/YYYY")}</small></p>
                                            <p className="mt-0 mb-6px text-13"><small>Plan expires at: {dayjs(planF.plan_expires_at).format("DD/MM/YYYY")}</small></p>

                                        </div>
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
            >
                <DialogTitle style={{ textAlign: "center" }}>
                    {/* {`Select a ${actionController.message[currentStd?.action]} ${currentStd?.status?.slug ? `for ${currentStd?.status?.slug}` : ""
                        }`} */}
                </DialogTitle>
                <DialogContent>
                    {/* plans Dialog */}
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
