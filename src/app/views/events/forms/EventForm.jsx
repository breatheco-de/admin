import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Grid, Card, Divider, TextField, MenuItem, Button, Checkbox,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';
import bc from '../../../services/breathecode';
import { Breadcrumb } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import { MediaInput } from '../../../components/MediaInput';

// Timezone plugin
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const EventForm = () => {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    excerpt: '',
    lang: '',
    url: '',
    banner: '',
    capacity: 0,
    starting_at: '',
    ending_at: '',
    host: '',
    online_event: false,
    sync_with_eventbrite: false,
  });
  const [venue, setVenue] = useState(null);
  const [tags, setTags] = useState([]);
  const [eventType, setEventType] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      bc.events()
        .getAcademyEvent(id)
        .then(({ data }) => {
          setEvent({
            ...data,
            starting_at: dayjs(data.starting_at).format("YYYY-MM-DDTHH:mm:ss"),
            ending_at: dayjs(data.ending_at).format("YYYY-MM-DDTHH:mm:ss"),
          });
          setEventType({...data.event_type, academy: data.academy});
          setVenue({ ...data.venue });
        })
        .catch((error) => error);
    }
  }, []);
  const postEvent = (values) => {
    const venueAndType = {
      venue: venue !== null ? venue.id : null,
      event_type: eventType !== null ? eventType.id : null,
    };
    if (id) {
      const { academy, ...rest } = values;
      bc.events()
        .updateAcademyEvent(id, {
          ...rest,
          starting_at: dayjs(rest.starting_at).utc().format(),
          ending_at: dayjs(rest.ending_at).utc().format(),
          ...venueAndType,
        })
        .then(({ data }) => {
          setEvent({
            title: '',
            description: '',
            excerpt: '',
            lang: '',
            url: '',
            banner: '',
            capacity: 0,
            starting_at: '',
            ending_at: '',
            host: null,
            event_type: null,
            venue: null,
            online_event: false,
            sync_with_eventbrite: false,
          });
          if (data.academy !== undefined) history.push('/events/list');
        })
        .catch((error) => error);
    } else {
      bc.events()
        .addAcademyEvent({
          ...values,
          starting_at: dayjs(values.starting_at).utc().format(),
          ending_at: dayjs(values.ending_at).utc().format(),
          ...venueAndType,
        })
        .then(({ data }) => {
          setEvent({
            title: '',
            description: '',
            excerpt: '',
            lang: '',
            url: '',
            banner: '',
            capacity: 0,
            starting_at: '',
            ending_at: '',
            host: null,
            event_type: null,
            venue: null,
            online_event: false,
            sync_with_eventbrite: false,
          });
          if (data.academy !== undefined) history.push('/events/list');
        })
        .catch((error) => error);
    }
  };
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Events', path: '/events/list' },
            { name: id ? 'Edit Event' : 'New Event' },
          ]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">{id ? 'Edit Event' : 'Create a new Event'}</h4>
        </div>
        <Divider className="mb-2" />
        {!id && (
          <Alert severity="warning">
            <AlertTitle>Before you add a new event</AlertTitle>
            Usually events get added automatically from EventBrite, please only manually add events
            that are NOT going to be published thru Eventbrite.
          </Alert>
        )}
        <Formik initialValues={event} onSubmit={(values) => postEvent(values)} enableReinitialize>
          {({
            values,
            handleChange,
            handleSubmit,
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
                    name="banner"
                    fullWidth
                    inputProps={{ style: { padding: '10px' } }}
                  />
                </Grid>
                <Grid item md={1} sm={4} xs={12}>
                  Landing URL
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <TextField
                    placeholder="Landing URL"
                    size="small"
                    type="url"
                    variant="outlined"
                    value={values.url}
                    onChange={handleChange}
                    name="url"
                    fullWidth
                    required
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
                      {['EN', 'ES'].map((lang) => {
                        const langInLowerCase = lang.toLowerCase();
                        return (
                          <MenuItem value={langInLowerCase} key={`event-lang-${langInLowerCase}`}>
                            {lang}
                          </MenuItem>
                        );
                      })}
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
                    onChange={(v) => setVenue(v)}
                    asyncSearch={() => bc.events().getAcademyVenues()}
                    size="small"
                    label="Venue"
                    debounced={false}
                    required={false}
                    getOptionLabel={(option) => `${option.title}`}
                    value={venue}
                  />
                </Grid>
                <Grid item md={1} sm={4} xs={12}>
                  Event Type
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <AsyncAutocomplete
                    onChange={(v) => setEventType(v)}
                    asyncSearch={() => bc.events().getAcademyEventType()}
                    size="small"
                    debounced={false}
                    label="Event type"
                    required
                    getOptionLabel={(option) => `${option.name}`}
                    value={eventType}
                  />
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
                  Tags
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <AsyncAutocomplete
                    onChange={(v) => setTags(v)}
                    asyncSearch={() => bc.marketing().getAcademyTags()}
                    size="small"
                    label="Tags"
                    debounced={false}
                    multiple={true}
                    required={tags.length <= 1}
                    getOptionLabel={(option) => `${option.slug}`}
                    value={tags}
                  />
                  <small className="text-muted">The specified tags will be applied to this event attendees on active campaign</small>
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
                <Grid item md={1} sm={4} xs={12}>
                  Sync with Eventbrite
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <Checkbox
                    checked={values.sync_with_eventbrite}
                    onChange={handleChange}
                    name="sync_with_eventbrite"
                    color="primary"
                  />
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit">
                  {id ? 'Update' : 'Create'}
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
