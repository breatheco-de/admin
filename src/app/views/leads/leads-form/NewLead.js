import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core';
import { Breadcrumb } from 'matx';
import bc from 'app/services/breathecode';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import { AsyncAutocomplete } from '../../../components/Autocomplete';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  select: {
    width: '18rem',
  },
}));

const countrys = require('./countrys.json');

const NewLead = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { user } = useAuth();

  const [listCourse, setListCourse] = useState();
  const [course, setCourse] = useState();

  // const { academy } = JSON.parse(localStorage.getItem('bc-session'));
  const { academy } = user;

  const [newLead, setNewLead] = useState(
    {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      course: '',
      client_comments: '',
      location: '',
      language: '',
      utm_url: '',
      utm_medium: '',
      utm_campaign: '',
      utm_source: '',
      referral_key: '',
      gclid: '',
      tags: '',
      automations: '',
      street_Address: '',
      country: '',
      city: '',
      latitude: 0,
      longitude: 0,
      state: '',
      zip_code: 0,
      browser_lang: '',
      lead_type: '',
      tag_objects: [],
      automation_objects: [],
      academy: academy.id,
    },
  );

  // AUX´s FUNCTION TO HELP IN VALIDATIONS AND CREATE THE OBJECT "newLead" \\

  const createLead = (event) => {
    setNewLead({ ...newLead, [event.target.name]: event.target.value });
  };

  const selectTypeLead = (event) => {
    setNewLead({
      ...newLead, lead_type: event.target.value,
    });
  };

  const leadTypes = [
    {
      value: 'STRONG',
      label: 'Strong',
    },
    {
      value: 'SOFT',
      label: 'Soft',
    },
    {
      value: 'DISCOVERY',
      label: 'Discovery',
    },
  ];

  const selectLanguages = (event) => {
    setNewLead({
      ...newLead, language: event.target.value,
    });
  };

  const languages = [
    {
      value: 'es',
      label: 'Spanish',
    },
    {
      value: 'us',
      label: 'English',
    },
  ];

  // useeffect para hacer el dropdown de las academias\\

  useEffect(() => {
    if (id) {
      bc.marketing().getAcademySingleLead(id)
      .then(({ data }) => {
        console.log(data);
        setNewLead({...data});
      })
      .catch((e) => console.log(e))
    }
  }, []);
  
  useEffect(() => {
    bc.admissions().getCertificates()
      .then(({ data }) => {
        setListCourse(data);
      });
  }, []);

  useEffect(() => {
    if (listCourse) {
      setCourse(listCourse.map((item) => (
        <MenuItem key={item.id} value={item.slug}>
          {`${item.name} (${item.slug})`}
        </MenuItem>
      )));
    }
  }, [listCourse != undefined]);

  // Constante para definir la lista de paises que viene de un JSON de este mismo directorio\\

  const listCountrys = countrys.map((item, index) => (
    <MenuItem key={index} value={item.name_en}>
      {item.name_en}
    </MenuItem>
  ));

  // VALIDACIONES FORM\\

  const phoneRegExp = /^[+]?([0-9]{11,15})$/;

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'Your name is too short')
      .required('Please enter a full name'),
    email: Yup.string()
      .email('The email is incorrect'),
    course: Yup.string().required('Please enter a course'),
    language: Yup.string().required('Please enter a language'),
    lead_type: Yup.string().required('Please select one type of lead'),
    phone: Yup.string()
      .matches(phoneRegExp, `Please enter the correct format with the code of your country with a ${'+'}`),
    latitude: Yup.number().typeError('Please enter a valid number and if not, leave the value at 0.'),
    longitude: Yup.number().typeError('Please enter a valid number and if not, leave the value at 0.'),
    zip_code: Yup.number().typeError('Please enter a valid number and if not, leave the value at 0.'),
  });

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Pages', path: '/leads/list' },
            { name: 'Order List', path: '/leads/list' },
            { name: 'New Lead' },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add New Lead</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={newLead}
          validationSchema={ProfileSchema}
          onSubmit={async (newLead) => { 
            let tags = '';
            if (newLead.tag_objects.length !== 0) tags = newLead.tag_objects.map(t => t.slug).join(',');
            let automations = '';
            if (newLead.automation_objects.length !== 0) automations = newLead.automation_objects.map(a => a.slug).join(',');
            const res = await bc.marketing().addNewLead({ 
              ...newLead, 
              tags, 
              tag_objects: newLead.tag_objects.map((tag) => tag.id),
              automations,
              automation_objects: newLead.automation_objects.map((auto) => auto.id)
            }); 
            if (res.ok) history.push('/growth/leads'); 
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
                <Grid item md={2} sm={4} xs={12} className="font-weight-bold">
                  First name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.first_name && touched.first_name}
                    helperText={touched.first_name && errors.first_name}
                    label="First name"
                    name="first_name"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.first_name}
                    value={newLead.first_name}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Last name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Last name"
                    name="last_name"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.last_name}
                    value={newLead.last_name}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Email
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.email && touched.email}
                    helperText={touched.email && errors.email}
                    label="Email"
                    name="email"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.email}
                    value={newLead.email}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Phone
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.phone && touched.phone}
                    helperText={touched.phone && errors.phone}
                    label="Phone"
                    name="phone"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.phone}
                    value={newLead.phone}
                    onChange={createLead}
                    placeholder="Enter the country code"
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Course
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.course && touched.course}
                    helperText={touched.course && errors.course}
                    select
                    className={classes.select}
                    label="Course"
                    name="course"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.course}
                    value={newLead.course}
                    onChange={createLead}
                  >
                    {course}
                  </TextField>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Client comments
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Client comments"
                    name="client_comments"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.client_comments}
                    value={newLead.client_comments}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Language
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.language && touched.language}
                    helperText={touched.language && errors.language}
                    select
                    className={classes.select}
                    label="Language"
                    name="language"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.language}
                    value={languages.find((lang) => newLead.language === lang.value)}
                    onChange={selectLanguages}
                  >
                    {languages.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Utm url
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Utm url"
                    name="utm_url"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.utm_url}
                    value={newLead.utm_url}
                    onChange={createLead}
                  />
                  <small className="text-muted d-block">The url when the contact was filling the form, or the chat application if its coming from a chat. E.g: Whatsapp.</small>
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
                    defaultValue={newLead.utm_medium}
                    onChange={createLead}
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
                    defaultValue={newLead.utm_campaign}
                    onChange={createLead}
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
                    defaultValue={newLead.utm_source}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Referral key
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Referral key"
                    name="referral_key"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.referral_key}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Gclid
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Gclid"
                    name="gclid"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.gclid}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Location
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <AsyncAutocomplete
                      onChange={(location) => { setNewLead({ ...newLead, location: location.slug }); }}
                      width="35%"
                      className="mr-2 ml-2"
                      asyncSearch={() => bc.marketing().getAcademyAlias()}
                      size="small"
                      label="location"
                      required={false}
                      debounced={false}
                      getOptionLabel={(option) => `${option.slug}`}
                    />
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Tags Objects
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <AsyncAutocomplete
                      onChange={(tags) => { setNewLead({ ...newLead, tag_objects: tags }); }}
                      width="35%"
                      className="mr-2 ml-2"
                      asyncSearch={(search) => bc.marketing().getAcademyTags({like: search, type : 'SOFT,STRONG'})}
                      size="small"
                      label="tags"
                      required={false}
                      multiple={true}
                      getOptionLabel={(option) => `${option.slug}`}
                    />
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Automation Objects
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <AsyncAutocomplete
                      onChange={(automation) => setNewLead({ ...newLead, automation_objects: automation })}
                      width="35%"
                      className="mr-2 ml-2"
                      asyncSearch={(like) => bc.marketing().getAcademyAutomations({ like })}
                      filter={(a) => a.slug !== ''}
                      size="small"
                      label="Automation"
                      required={false}
                      multiple={true}
                      getOptionLabel={(option) => `${option.name}`}
                    />
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Street address
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Street address"
                    name="street_Address"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.street_Address}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Country
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className={classes.select}
                    select
                    label="Country"
                    name="country"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.country}
                    onChange={createLead}
                  >
                    {listCountrys}
                  </TextField>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  State
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="State"
                    name="state"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.stats}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  City
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="City"
                    name="city"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.city}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  ZIP code
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.zip_code && touched.zip_code}
                    helperText={touched.zip_code && errors.zip_code}
                    label="ZIP code"
                    name="zip_code"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.zip_code}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Latitude
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.latitude && touched.latitude}
                    helperText={touched.latitude && errors.latitude}
                    label="Latitude"
                    name="latitude"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.latitude}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Longitude
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.longitude && touched.longitude}
                    helperText={touched.longitude && errors.longitude}
                    label="Longitude"
                    name="longitude"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.longitude}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Browser lang
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Browser lang"
                    name="browser_lang"
                    size="small"
                    variant="outlined"
                    defaultValue={newLead.browser_lang}
                    onChange={createLead}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Lead type
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    error={errors.lead_type && touched.lead_type}
                    helperText={touched.lead_type && errors.lead_type}
                    select
                    className={classes.select}
                    label="type"
                    name="lead_type"
                    size="small"
                    variant="outlined"
                    value={newLead.leadType}
                    onChange={selectTypeLead}
                  >
                    {leadTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
      </Card>
    </div>
  );
};

export default NewLead;
