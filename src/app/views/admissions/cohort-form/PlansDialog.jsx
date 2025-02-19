import React, { useState } from "react";
import { Grid, MenuItem, TextField, Button } from "@material-ui/core";
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import bc from 'app/services/breathecode';


const PlansDialog = ({ plansDialog, payments, userId }) => {
    const [initialValues, setInitialValues] = useState({
        plan: "",
        payment: "",
        payment_details: "",
        payment_reference: "",
        user: userId,
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

        //user.id pasarlo por props, agregarlo al payload del handleSubmit
        //ARREGLAR EL QUERY DEL COHORT AL GET PLAN

      // TODO: ADD USEEFFECT TO FETCH PAYMENTS AND PLANS

    const handleSubmit = async (values) => {
        console.log("values", values);

        try {
            const payload = {
                plan: values.plan,
                payment: values.payment,
                payment_details: values.payment_details,
                payment_reference: values.payment_reference,
                user: values.user,
            };
            await bc.payments().addAcademyPlanSlugSubscription(values.plan, payload);
            toast.success("Subscription created successfully");
            onclose();
        }
        catch (error) {
            console.error("error", error);
        }
    }

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
                <form onSubmit={handleSubmit} style={{ width: "400px" }}>
                    {console.log("VALUES", values)}
                    <Grid item md={2} sm={4} xs={12} style={labelStyle}>
                        {/* Plans */}
                    </Grid>
                    <Grid item md={9} sm={8} xs={12}>
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
                            <Grid item md={2} sm={4} xs={12} style={labelStyle}>
                                {/* Payment */}
                            </Grid>
                            <Grid item md={9} sm={8} xs={12}>
                                <TextField
                                    style={textFieldStyle}
                                    label="Payment"
                                    name="payment"
                                    size="medium"
                                    fullWidth
                                    required
                                    variant="outlined"
                                    select
                                    value={values.payment}
                                    onChange={handleChange}
                                >
                                    {payments.map((payment) => (
                                        <MenuItem key={payment.id} value={payment.title}>
                                            {payment.title}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item md={2} sm={4} xs={12} style={labelStyle}>
                                {/* Payment Details */}
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
                            <Grid item md={2} sm={4} xs={12} style={labelStyle}>
                                {/* Payment Reference */}
                            </Grid>
                            <Grid item md={10} sm={8} xs={12}>
                                <TextField
                                    style={textFieldStyle}
                                    label="Payment Reference"
                                    name="payment_reference"
                                    size="medium"
                                    fullWidth
                                    type="text"
                                    required
                                    variant="outlined"
                                    value={values.payment_reference}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end" }}>
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
                </form>
            )}
        </Formik>
    );
};

export default PlansDialog;
