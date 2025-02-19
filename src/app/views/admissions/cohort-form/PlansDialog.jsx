import React, { useState } from "react";
import { Grid, MenuItem, TextField, Button } from "@material-ui/core";
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import bc from 'app/services/breathecode';


const PlansDialog = ({ plansDialog, payments, userId, onClose }) => {
    const [initialValues, setInitialValues] = useState({
        plan: "",
        payment_method: "",
        payment_details: "",
        reference: "",
        user: userId,
        how_many_installments: 0,
    });

    const textFieldStyle = {
        margin: "10px 0",
        fontSize: "1rem"
    };

    const labelStyle = {
        fontSize: "15px",
        marginTop: "10px",
        display: "contents",
        alignItems: "center",
        padding: "0px 45px"
    };

    const handleSubmit = async (values) => {

        try {
            const payload = {
                plan: values.plan,
                payment_method: values.payment_method,
                payment_details: values.payment_details,
                reference: values.reference,
                user: values.user,
                how_many_installments: Number(values.how_many_installments)
            };
            await bc.payments().addAcademyPlanSlugSubscription(values.plan, payload);
            onClose();
            toast.success("Subscription created successfully");
        }
        catch (error) {
            console.error("error", error);
        }
    }

    const uniquePayments = Array.from(
        new Map(payments.map(method => [method.title, method])).values()
    );

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({
                values,
                handleChange,
                handleSubmit,
                setFieldValue,
            }) => (
                <form onSubmit={handleSubmit} style={{ maxWidth: "400px", width:"90%", margin: "0 auto" }}>
                    <Grid container justifyContent="center">
                        <Grid item md={10} sm={8} xs={12} style={labelStyle}>
                            {/* Plans */}
                        </Grid>
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
                                {plansDialog.map((plan) => (
                                    <MenuItem key={plan.slug} value={plan.slug}>
                                        {plan.slug}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

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
                                        {uniquePayments.map(payment => (
                                            <MenuItem key={payment.id} value={payment.id}>
                                                {payment.title}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        style={textFieldStyle}
                                        label="How Many Installments"
                                        name="how_many_installments"
                                        size="medium"
                                        fullWidth
                                        type="text"
                                        required
                                        variant="outlined"
                                        value={values.how_many_installments}
                                        onChange={handleChange}
                                    />
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
                                    <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
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
