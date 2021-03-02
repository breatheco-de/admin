import React, { useState} from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {
    Grid,
    Card,
    Divider,
    TextField,
    MenuItem,
    Button,
    Checkbox
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { useParams } from "react-router-dom";
import bc from "app/services/breathecode";

const EventForm = () => {
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
    const { id } = useParams();
    const postEvent = (values) => {
        if (id) {
            bc.events().updateAcademyEvent(id, values)
                .then(({ data }) => data.status === 201 ? setMsg({ alert: true, type: "success", text: "Event updated" }) : setMsg({ alert: true, type: "success", text: data.statusText }))
                .catch(error => error)
        } else {
            bc.events().addAcademyEvent(values)
                .then(({ data }) => data.status === 201 ? setMsg({ alert: true, type: "success", text: "Event created" }) : setMsg({ alert: true, type: "success", text: data.statusText }))
                .catch(error => error)
        }
    }
    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Events", path: "/events" },
                        { name: id ? "Edit Event" : "New Event"},
                    ]}
                />
            </div>
            <Card elevation={3}>
                <div className="flex p-4">
                    <h4 className="m-0">{id ? "Edit Event" : "Create a new Event"}</h4>
                </div>
                <Divider className="mb-2" />
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => postEvent(values)}
                    enableReinitialize={true}
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
                                <Grid item md={2} sm={4} xs={12}>
                                    Event Title
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Event Title"
                                        name="title"
                                        required
                                        size="small"
                                        variant="outlined"
                                        value={values.title}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Banner URL
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Banner URL"
                                        name="banner"
                                        size="small"
                                        variant="outlined"
                                        value={values.banner}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Landing URL
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Landing URL"
                                        name="url"
                                        size="small"
                                        variant="outlined"
                                        value={values.url}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Capacity
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Capacity"
                                        name="capacity"
                                        size="small"
                                        type="number"
                                        required
                                        variant="outlined"
                                        value={values.capacity}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Starting At
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        className="min-w-188"
                                        name="starting_at"
                                        size="small"
                                        required
                                        variant="outlined"
                                        type="datetime-local"
                                        value={values.starting_at}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Ending At
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        className="min-w-188"
                                        name="ending_at"
                                        size="small"
                                        required
                                        type="datetime-local"
                                        variant="outlined"
                                        value={values.ending_at}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Language
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <div className="flex flex-wrap m--2">
                                        <TextField
                                            className="m-2 min-w-188"
                                            label="Language"
                                            name="lang"
                                            size="small"
                                            required
                                            variant="outlined"
                                            select
                                            value={values.lang}
                                            onChange={handleChange}
                                        >
                                            {["EN", "ES"].map((item, ind) => (
                                                <MenuItem value={item.toLowerCase()} key={ind}>
                                                    {item}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Host
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Host"
                                        name="host"
                                        size="small"
                                        variant="outlined"
                                        value={values.host}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Venue
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Venue"
                                        name="venue"
                                        size="small"
                                        variant="outlined"
                                        value={values.venue}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Event Type
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Event Type"
                                        name="event_type"
                                        size="small"
                                        variant="outlined"
                                        value={values.event_type}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Event Description
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Event Description"
                                        name="description"
                                        size="small"
                                        multiline
                                        required
                                        variant="outlined"
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Short description
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <TextField
                                        label="Short Description"
                                        name="excerpt"
                                        size="small"
                                        multiline
                                        required
                                        variant="outlined"
                                        value={values.excerpt}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Online Event
                                </Grid>
                                <Grid item md={4} sm={8} xs={12}>
                                    <Checkbox
                                        checked={values.online_event}
                                        onChange={handleChange}
                                        name="online_event"
                                        color="primary"
                                    />
                                </Grid>
                            </Grid>
                            <div className="mt-6">
                                <Button color="primary" variant="contained" type="submit">
                                    Create
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
                {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                        {msg.text}
                    </Alert>
                </Snackbar> : ""}
            </Card>
        </div>
    );
};

const initialValues = {
    title: "",
    description: "",
    excerpt: "",
    lang: "",
    url: "",
    banner: "",
    capacity: 0,
    starting_at: "",
    ending_at: "",
    host: null,
    event_type: null,
    venue: null,
    online_event: false
};

export default EventForm;