import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Grid, Card, Divider, TextField, MenuItem, Button, Checkbox,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';
import bc from '../../../services/breathecode';
import { Breadcrumb, ConfirmationDialog } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import { MediaInput } from '../../../components/MediaInput';
import useAuth from '../../../hooks/useAuth';

// Timezone plugin
const utc = require('dayjs/plugin/utc');

// Slugify Library
const slugify = require('slugify');

dayjs.extend(utc);

const EventForm = () => {
  const [event, setEvent] = useState({
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
    live_stream_url: '',
    eventbrite_sync_status: '',
    sync_with_eventbrite: true,
  });
  const [venue, setVenue] = useState(null);
  const [tags, setTags] = useState([]);
  const [eventType, setEventType] = useState(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!id) setSlug(slugify(title).toLowerCase());
  }, [title]);

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
          
          setTitle(data.title);
          
          if (data.tags !== "") setTags(data.tags.split(","));
          if (data.slug) setSlug(data.slug);
          if (data.event_type) setEventType({ ...data.event_type, academy: data.academy });
          if (data.venue) setVenue({ ...data.venue });

        })
        .catch((error) => error);
    }
  }, []);
  const postEvent = (values) => {
    const venueAndType = {
      venue: venue ? venue.id : null,
      event_type: eventType ? eventType.id : null,
    };

    if (id) {

      const { academy, status, slug, ...rest } = values;

      bc.events()
        .updateAcademyEvent(id, {
          ...rest,
          title,
          tags: tags.join(","),
          starting_at: dayjs(rest.starting_at).utc().format(),
          ending_at: dayjs(rest.ending_at).utc().format(),
          ...venueAndType,
        })
        .then(({ data }) => {

          if (data.academy !== undefined) history.push('/events/list');
        })
        .catch((error) => {
          setShowDialog(false);
          return error
        });
    } else {
      const { eventbrite_sync_status, ...restValues } = values
      const payload = {
        ...restValues,
        title,
        slug,
        tags: tags.join(","),
        starting_at: dayjs(values.starting_at).utc().format(),
        ending_at: dayjs(values.ending_at).utc().format(),
        ...venueAndType,
      }
      bc.events()
        .addAcademyEvent({
          ...payload
        })
        .then(({ data }) => {

          if (data.academy !== undefined) {
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
              live_stream_url: '',
              sync_with_eventbrite: false,
            });
            history.push('/events/list')
          }
        })
        .catch((error) => {
          setShowDialog(false);
          return error
        });
    }
  };

  const removeDuplicates = (arr) => {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }



  const getTags = async () => {
    try {
      const { data } = await bc.marketing().getAcademyTags({ type: 'DISCOVERY' })

      let slugs = removeDuplicates(data.map((item) => {
        return item['slug'];
      }));

      return { data: slugs }
    } catch (err) {
      return err
    }
  }

  const dialogText = 'Warning! Please make sure the chosen tags are ideal for this audience, choosing the wrong tags will mislead the AI algorithms and result in a bad marketing for this and future events.';
  const dialogUrl = 'https://4geeksacademy.notion.site/Choosing-event-tags-e11bc8405ddd4ceead6a66161af03b6b';

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
            In you "Sync with Eventbrite" the event will be published to eventbrite as a DRAFT and you will have to finish its publication on eventbrite.com
          </Alert>
        )}
        <Formik initialValues={event} onSubmit={() => setShowDialog(true)} enableReinitialize
          validate={(values) => {
            let errors = {}
            if (!dayjs(values.starting_at).isBefore(dayjs(values.ending_at))) {
              errors.ending_at = 'The ending date should be after the starting date'
            }

            return errors
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <ConfirmationDialog
                open={showDialog}
                onConfirmDialogClose={() => setShowDialog(false)}
                // text={dialogText}
                title="Confirm"
                onYesClick={() => postEvent(values)}
              >
                <p>{dialogText} <a
                  style={{ textDecoration: 'underline' }}
                  href={dialogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to learn more
                </a></p>

              </ConfirmationDialog>
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

                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                  />
                </Grid>
                <Grid item md={1} sm={4} xs={12}>
                  Slug
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <TextField
                    label="Slug"
                    name="slug"
                    size="small"
                    fullWidth
                    variant="outlined"
                    disabled={id ? true : false}
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value) }}
                  />
                  <small className="text-muted">Can only be updated when creating the event</small>
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
                    disabled={values.sync_with_eventbrite ? true : false}
                  />
                  <small className="text-muted">If the event gets published on eventbrite, this field will be filled with the eventbrite public URL</small>
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
                    onChange={(e) => {
                      if (values.ending_at === '') {
                        const newEnding = dayjs(e.target.value).add(2, 'h')
                        values.ending_at = dayjs(newEnding).format('YYYY-MM-DDTHH:mm');
                      }
                      handleChange(e);
                    }}
                  />
                  <small className="text-muted">{`The event timezone will be the same as the academy timezone ${user?.academy.timezone}`}</small>
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
                    error={errors.ending_at && touched.ending_at}
                    helperText={touched.ending_at && errors.ending_at}
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
                    renderInput={(params) => (
                      <TextField {...params} label="Venue" placeholder="Venue" />
                    )}
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
                    renderInput={(params) => (
                      <TextField {...params} label="Event Type" placeholder="Event Type" />
                    )}
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
                    // asyncSearch={() => bc.marketing().getAcademyTags({ type: 'DISCOVERY' })}
                    asyncSearch={getTags}
                    size="small"
                    label="Tags"
                    debounced={false}
                    isOptionEqualToValue={(option, value) => option === value}
                    multiple={true}
                    required={tags.length <= 1}
                    getOptionLabel={(option) => option}
                    value={tags}
                  />
                  <small className="text-muted">The specified tags will be applied to this event attendees on active campaign</small>
                </Grid>
                <Grid item md={1} sm={4} xs={12}>
                  Live Stream URL
                </Grid>
                <Grid item md={3} sm={8} xs={12}>
                  <TextField
                    label="Live Stream URL"
                    name="live_stream_url"
                    required={values.online_event}
                    size="small"
                    fullWidth
                    variant="outlined"
                    value={values.live_stream_url}
                    onChange={(e) => { setEvent({...event, live_stream_url: e.target.value}) }}
                  />
                  <small className="text-muted">In case the event is online, this field is mandatory. It's the meeting URL.</small>
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
