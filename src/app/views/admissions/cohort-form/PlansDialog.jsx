import React, { useState, useEffect } from "react";
import { Grid, MenuItem, TextField, Button } from "@material-ui/core";
import { Formik } from "formik";
import { toast } from "react-toastify";
import bc from "app/services/breathecode";

const PlansDialog = ({ plansDialog, payments, userId, onClose }) => {
    const initialValuesState = {
        plan: "",
        how_many_installments: 0,
        payment_method: "",
        payment_details: "",
        reference: "",
        user: Number(userId),
    };

    const textFieldStyle = {
        margin: "10px 0",
        fontSize: "1rem",
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                plan: values.plan,
                how_many_installments: values.how_many_installments,
                payment_method: values.payment_method,
                payment_details: values.payment_details,
                reference: values.reference,
                user: values.user,
            };
            await bc.payments().addAcademyPlanSlugSubscription(values.plan, payload);
            toast.success("Subscription created successfully");
            return onClose();
        }
        catch (error) {
            console.error("error", error);
        }
    };

    console.log(plansDialog)
    const uniquePayments = Array.from(
        new Map(payments.map((method) => [method.title, method])).values()
    );

    return (
        <Formik initialValues={initialValuesState} onSubmit={handleSubmit} enableReinitialize>
            {({ values, handleChange, handleSubmit, setFieldValue }) => {
                useEffect(() => {
                    const selectedPlanObject = plansDialog?.find(p => p.slug === values.plan);
                    let defaultInstallment = 0;

                    if (selectedPlanObject?.financing_options && selectedPlanObject.financing_options.length > 0) {
                        defaultInstallment = selectedPlanObject.financing_options[0].how_many_months;
                    }

                    if (values.how_many_installments !== defaultInstallment) {
                        setFieldValue('how_many_installments', defaultInstallment);
                    }

                }, [values.plan, plansDialog, setFieldValue]);

                const selectedPlanObjectForRender = plansDialog?.find(p => p.slug === values.plan);
                const financingOptions = selectedPlanObjectForRender?.financing_options;

                return (
                    <form
                        onSubmit={handleSubmit}
                        style={{ maxWidth: "400px", width: "90%", margin: "0 auto" }}
                    >
                        <Grid container justifyContent="center">
                            <Grid item md={10} sm={8} xs={12}>
                                <TextField
                                    style={textFieldStyle}
                                    className=""
                                    label="Plan"
                                    size="medium"
                                    fullWidth
                                    variant="outlined"
                                    value={values.plan}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    name="plan"
                                    select
                                >
                                    {plansDialog?.filter(plan => 
                                        plan.financing_options && 
                                        plan.financing_options.length > 0 && 
                                        plan.financing_options.some(option => option.how_many_months === 1)
                                    ).map((plan) => (
                                        <MenuItem key={plan.slug} value={plan.slug}>
                                            {plan.slug}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {values.plan && (
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        style={textFieldStyle}
                                        label="Installments"
                                        name="how_many_installments"
                                        size="medium"
                                        fullWidth
                                        required
                                        variant="outlined"
                                        select
                                        value={values.how_many_installments}
                                        onChange={(e) => setFieldValue("how_many_installments", Number(e.target.value))}
                                    >
                                        {(financingOptions && financingOptions.length > 0) ? (
                                            financingOptions.map((option) => (
                                                <MenuItem key={option.how_many_months} value={option.how_many_months}>
                                                    {`${option.how_many_months} Month(s)`}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem key={0} value={0}>
                                                0 Month(s) (Paid in full)
                                            </MenuItem>
                                        )}
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
                                            {(payments && Array.from(new Map(payments.map((method) => [method.title, method])).values()).map((payment) => (
                                                <MenuItem key={payment.id} value={payment.id}>
                                                    {payment.title}
                                                </MenuItem>
                                            ))) || <MenuItem value="">Loading...</MenuItem>}
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
                );
            }}
        </Formik>
    );
};

export default PlansDialog;
