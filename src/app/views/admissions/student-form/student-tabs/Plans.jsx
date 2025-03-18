import React, {useEffect, useState} from "react";
import {
    DialogTitle,
    Dialog,
    Button,
    DialogContent,
} from "@material-ui/core";
import PlansDialog from "../../cohort-form/PlansDialog";
import bc from "../../../../services/breathecode";

const Plans = ({ stdId, stdCohorts }) => {
    const [plansDialog, setPlansDialog] = useState([]);
    const [payments, setPayments] = useState([]);
    const [openPlanDialog, setOpenPlanDialog] = useState(false);

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


    return (
        <>
            <div>Hola</div>
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium"></h4>
                <Button
                    className="px-7 font-medium text-primary bg-light-primary whitespace-pre"
                    onClick={() => setOpenPlanDialog(true)}
                >
                    Add to plan
                </Button>
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
