import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Card,
    Divider,
    TextField,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import bc from "app/services/breathecode";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import { tr } from "date-fns/locale";

const useStyles = makeStyles(({ palette, ...theme }) => ({
    select: {
        width: "18rem",
    },
}));

// const countrys = require('./countrys.json');

const NewShort = () => {
    const classes = useStyles();
    const history = useHistory();

    const [isPrivate, setPrivate] = useState(false);
    const [checked, setChecked] = useState(false);

    const [listCourse, setListCourse] = useState();
    const [course, setCourse] = useState();

    const { academy } = JSON.parse(localStorage.getItem("bc-session"));

    const [newShort, setNewShort] = useState({
        // id: '',
        slug: "",
        destination: "",
        hits: 0,
        isPrivate: false,
        author: 1,
        utm_campaign: "",
        utm_medium: "",
        utm_content: "",
        utm_source: "",
        // active: true,
        // destination_status: "ACTIVE",
        // destination_status_text: null,
        // created_at: "2021-10-28T23:00:56.286892Z",
        // updated_at: "2021-10-28T23:00:56.286914Z",
    });

    const handlePrivate = (event) => {
        setChecked(event.target.checked);
        setNewShort({
            ...newShort,
            isPrivate: true,
        });
        createShort;
    };

    const createShort = (event) => {
        setNewShort({ ...newShort, [event.target.name]: event.target.value });
    };

    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Growth", path: "/Growth" },
                        { name: "URL Shortner", path: "/growth/urls" },
                        { name: "New Short Link", path: "/growth/newshort" },
                    ]}
                />
            </div>

            <Card elevation={3}>
                <div className="flex p-4">
                    <h4 className="m-0">Add New Short Link</h4>
                </div>
                <Divider className="mb-2" />

                <Formik
                    initialValues={newShort}
                    // validationSchema={ProfileSchema}
                    onSubmit={(newShort) => {
                        bc.marketing().addNewShort(newShort);
                        console.log("This is the new short###", newShort);
                        history.push("/growth/urls");
                        window.location.reload();
                    }}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setSubmitting,
                        setFieldValue,
                    }) => (
                        <form className="p-4" onSubmit={handleSubmit}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid
                                    item
                                    md={2}
                                    sm={4}
                                    xs={12}
                                    className="font-weight-bold"
                                >
                                    Slug
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Slug"
                                        name="slug"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.slug}
                                        onChange={createShort}
                                    />
                                </Grid>

                                <Grid item md={2} sm={4} xs={12}>
                                    Destination
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Destination"
                                        name="destination"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.destination}
                                        onChange={createShort}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Private
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={handlePrivate}
                                                defaultValue={
                                                    newShort.isPrivate
                                                }
                                                name="Private"
                                                data-cy="private"
                                                color="primary"
                                                className="text-left"
                                            />
                                        }
                                        label="Other academies will see and use private urls."
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Utm campaign
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Utm campaign"
                                        name="utm_campaign"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.utm_campaign}
                                        onChange={createShort}
                                    />
                                </Grid>

                                <Grid item md={2} sm={4} xs={12}>
                                    Utm medium
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Utm medium"
                                        name="utm_medium"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.utm_medium}
                                        onChange={createShort}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Utm content
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Utm content"
                                        name="utm_content"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.utm_content}
                                        onChange={createShort}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Utm source
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Utm source"
                                        name="utm_source"
                                        size="small"
                                        variant="outlined"
                                        defaultValue={newShort.utm_source}
                                        onChange={createShort}
                                    />
                                </Grid>
                            </Grid>
                            <div className="mt-6">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default NewShort;
