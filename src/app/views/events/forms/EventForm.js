import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert, AlertTitle } from '@material-ui/lab';
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
import { useParams, useHistory } from "react-router-dom";
import bc from "app/services/breathecode";
import dayjs from "dayjs";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import {MediaInput} from "../../../components/MediaInput"

//Timezone plugin
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

const EventForm = () => {
    const [event, setEvent] = useState({
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
        online_event: false
    });
    const [venue, setVenue] = useState(null);
    const [eventType, setEventType] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (id) bc.events().getAcademyEvent(id)
            .then(({ data }) => setEvent({ ...data, starting_at: dayjs(data.starting_at).format("YYYY-MM-DDTHH:mm:ss"), ending_at: dayjs(data.ending_at).format("YYYY-MM-DDTHH:mm:ss")}))
            .catch(error => error);
    }, [])
    const postEvent = (values) => {
        console.log(values)
        const venueAndType = {
            venue: venue !== null ? venue.id: null,
            event_type: eventType !== null ? eventType.id: null,
        }
        if (id) {
            const { academy, ...rest } = values;
            bc.events().updateAcademyEvent(id, { 
                ...rest, 
                starting_at: dayjs(rest.starting_at).utc().format(), 
                ending_at: dayjs(rest.ending_at).utc().format(), 
                ...venueAndType
             })
                .then(({ data }) => {
                    setEvent({
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
                    });
                    if (data.academy !== undefined) history.push("/events/list")
                })
                .catch(error => error)
        } else {
            bc.events().addAcademyEvent({ 
                ...values, 
                starting_at: dayjs(values.starting_at).utc().format(), 
                ending_at: dayjs(values.ending_at).utc().format(), 
                ...venueAndType
            })
                .then(({ data }) => {
                    setEvent({
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
                    });
                    if (data.academy !== undefined) history.push("/events/list")
                })
                .catch(error => error)
        }
    }
    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Events", path: "/events/list" },
                        { name: id ? "Edit Event" : "New Event" },
                    ]}
                />
            </div>
            <Card elevation={3}>

                <div className="flex p-4">
                    <h4 className="m-0">{id ? "Edit Event" : "Create a new Event"}</h4>
                </div>
                <Divider className="mb-2" />
                {!id &&             <Alert severity="warning">
                <AlertTitle>Before you add a new event</AlertTitle>
                Usually events get added automatically from EventBrite, please only manually add events that are NOT going to be published thru Eventbrite.
            </Alert>}
                <Formik
                    initialValues={event}
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
                                <Grid item md={1} sm={4} xs={12}>
                                    Event Title
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        label="Event Title"
                                        name="title"
                                        required
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={values.title}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Banner URL
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <MediaInput 
                                        size="small" 
                                        placeholder="Banner URL"
                                        value={values.banner} 
                                        handleChange={setFieldValue} 
                                        name={"banner"} 
                                        fullWidth 
                                        inputProps={{style:{padding:"10px"}}}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Landing URL
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <MediaInput
                                        placeholder="Landing URL"
                                        size="small" 
                                        value={values.url} 
                                        handleChange={setFieldValue} 
                                        name={"url"} 
                                        fullWidth 
                                        inputProps={{style:{padding:"10px"}}}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Capacity
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        label="Capacity"
                                        name="capacity"
                                        size="small"
                                        type="number"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={values.capacity}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Starting At
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        className="min-w-188"
                                        name="starting_at"
                                        size="small"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        type="datetime-local"
                                        value={values.starting_at}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Ending At
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        className="min-w-188"
                                        name="ending_at"
                                        size="small"
                                        required
                                        fullWidth
                                        type="datetime-local"
                                        variant="outlined"
                                        value={values.ending_at}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Language
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <div className="flex flex-wrap m--2">
                                        <TextField
                                            className="m-2 min-w-188"
                                            label="Language"
                                            name="lang"
                                            size="small"
                                            required
                                            variant="outlined"
                                            select
                                            fullWidth
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
                                <Grid item md={1} sm={4} xs={12}>
                                    Host
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        label="Host"
                                        name="host"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={values.host}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Venue
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <AsyncAutocomplete
                                        onChange={(venue) => setVenue(venue)}
                                        asyncSearch={() => bc.events().getAcademyVenues()}
                                        size={"small"}
                                        label="Venue"
                                        debounced={false}
                                        required={false}
                                        getOptionLabel={option => `${option.title}`}
                                        value={venue} />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Event Type
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                <AsyncAutocomplete
                                        onChange={(eventType) => setEventType(eventType)}
                                        asyncSearch={() => bc.events().getAcademyEventType()}
                                        size={"small"}
                                        debounced={false}
                                        label="Event type"
                                        required={true}
                                        getOptionLabel={option => `${option.name}`}
                                        value={eventType} />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Event Description
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        label="Event Description"
                                        name="description"
                                        size="small"
                                        multiline
                                        required
                                        fullWidth
                                        variant="outlined"
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Short description
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
                                    <TextField
                                        label="Short Description"
                                        name="excerpt"
                                        size="small"
                                        fullWidth
                                        multiline
                                        required
                                        variant="outlined"
                                        value={values.excerpt}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={1} sm={4} xs={12}>
                                    Online Event
                                </Grid>
                                <Grid item md={3} sm={8} xs={12}>
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
                                    {id ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default EventForm;
