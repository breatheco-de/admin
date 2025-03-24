import React, { useState, useEffect } from "react";
import { Grid, MenuItem, TextField, Button } from "@material-ui/core";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import bc from "app/services/breathecode";

const PlansDialog = ({ plansDialog, payments, userId, onClose, stdCohorts, setCohortId }) => {
    const { slug } = useParams();
    const [initialValues, setInitialValues] = useState({
        plan: "",
        payment_method: "",
        payment_details: "",
        reference: "",
        user: Number(userId),
        cohort: "",
    });

    const textFieldStyle = {
        margin: "10px 0",
        fontSize: "1rem",
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                plan: values.plan,
                payment_method: values.payment_method,
                payment_details: values.payment_details,
                reference: values.reference,
                user: values.user,
                cohorts: [values.cohort || slug],
            };
            await bc
                .payments()
                .addAcademyPlanSlugSubscription(values.plan, payload);
            toast.success("Subscription created successfully");
            return onClose();
        }
        catch (error) {
            console.error("error", error);
        }
    };

    const uniquePayments = Array.from(
        new Map(payments.map((method) => [method.title, method])).values()
    );

    useEffect(() => {
        if (plansDialog && plansDialog?.length > 0) {
            const currentSubscription = plansDialog.find((plan) => plan.is_active);
            if (currentSubscription) {
                setInitialValues({
                    plan: currentSubscription.slug,
                    payment_method: currentSubscription.payment_method || "",
                    payment_details: currentSubscription.payment_details || "",
                    reference: currentSubscription.reference || "",
                    user: userId,
                });
            }
        }
    }, [plansDialog, userId]);

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {({ values, handleChange, handleSubmit, setFieldValue }) => (
                <form
                    onSubmit={handleSubmit}
                    style={{ maxWidth: "400px", width: "90%", margin: "0 auto" }}
                >
                    <Grid container justifyContent="center">
                        {stdCohorts && (
                            <Grid item md={10} sm={8} xs={12}>
                                <TextField
                                    style={textFieldStyle}
                                    label="Cohort"
                                    name="cohort"
                                    size="medium"
                                    fullWidth
                                    required
                                    variant="outlined"
                                    select
                                    value={values.cohort}
                                    onChange={(e) => {
                                        console.log("e.target.value", e.target.value);
                                        setFieldValue("cohort", e.target.value)
                                        setCohortId(e.target.value);
                                        console.log("values.cohort", values.cohort); 
                                    }}
                                >
                                    {stdCohorts.map(({ cohort }) => (
                                        <MenuItem key={cohort.id} value={cohort.slug}>
                                            {cohort.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        {(values.cohort || slug) && (
                            <Grid item md={10} sm={8} xs={12}>
                                <TextField
                                    style={textFieldStyle}
                                    className=""
                                    label="Plan"
                                    size="medium"
                                    fullWidth
                                    variant="outlined"
                                    value={values.plan}
                                    onChange={(e) => setFieldValue("plan", e.target.value)}
                                    select
                                >
                                    {plansDialog?.map((plan) => (
                                        <MenuItem key={plan.slug} value={plan.slug}>
                                            {plan.slug}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}

                        {values.plan && (
                            <>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        style={textFieldStyle}
                                        label="Payment"
                                        name="payment_method"
                                        size="medium"
                                        fullWidth
                                        required
                                        variant="outlined"
                                        select
                                        value={values.payment_method}
                                        onChange={handleChange}
                                    >
                                        {uniquePayments.map((payment) => (
                                            <MenuItem key={payment.id} value={payment.id}>
                                                {payment.title}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        style={textFieldStyle}
                                        label="Payment Reference"
                                        name="reference"
                                        size="medium"
                                        fullWidth
                                        type="text"
                                        required
                                        variant="outlined"
                                        value={values.reference}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        style={textFieldStyle}
                                        label="Payment Details"
                                        name="payment_details"
                                        size="medium"
                                        fullWidth
                                        type="text"
                                        required
                                        variant="outlined"
                                        value={values.payment_details}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Grid
                                        item
                                        xs={4}
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "15px",
                                        }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            onClick={handleSubmit}
                                        >
                                            Send
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

export default PlansDialog;
