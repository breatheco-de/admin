import React, { useState,useEffect } from "react";
import { Formik } from "formik";

import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import bc from "app/services/breathecode";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import * as Yup from 'yup';

const NewLead = () => {
  const [leadType, setLeadType] = useState("");
  let academy = JSON.parse(localStorage.getItem("bc-academy"));
  const [newLead, setNewLead] = useState(
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      course: "",
      client_comments: "",
      location: "",
      language: "",
      utm_url: "",
      utm_medium: "", 
      utm_campaign: "",
      utm_source: "", 
      referral_key: "",
      gclid: "",
      tags: "",
      automations: "",
      street_Address: "",
      country: "",
      city: "",
      latitude: 0,
      longitude: 0,
      state: "",
      zip_code: 0,
      browser_lang: "",
      lead_type: "",
      tag_objects: [],
      automation_objects: [],
      academy: academy.id
    }
  ); 

  // AUX´s FUNCTION TO HELP IN VALIDATIONS AND CREATE DE OBJECT "newLead" \\
    
  const createLead = event => {
		setNewLead({ ...newLead, [event.target.name]: event.target.value });
	};

  const selectTypeLead = (event) => {
    setLeadType(event.target.value);
    setNewLead({
      ...newLead, lead_type: event.target.value
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

  const phoneRegExp = /^[+]?([0-9]{11,15})$/;

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, "Your name is too short")
      .required("Please enter your full name"),
    email: Yup.string()
      .email("The email is incorrect"),
    course: Yup.string().required("Please enter a course"),
    language: Yup.string().required("Please enter a language"),
    lead_type: Yup.string().required("Please select one type of lead"),
    phone: Yup.string()
      .matches(phoneRegExp, `Please enter the correct format with the code of your country with a ${"+"}`)
  });

  
  return (
    <div className = "m-sm-30">
      <div className = "mb-sm-30">
      <Breadcrumb
          routeSegments = {[
            { name: "Pages", path: "/leads/list" },
            { name: "Order List", path: "/leads/list"},
            { name: "New Lead"}
          ]}
        />
      </div>

      <Card elevation = {3}>
        <div className = "flex p-4">
          <h4 className = "m-0">Add New Lead</h4>
        </div>
        <Divider className = "mb-2" />

        <Formik
          initialValues = {newLead}
          validationSchema = {ProfileSchema}
          onSubmit = {(newLead) => {bc.marketing().addNewLead(newLead); console.log(newLead)}}
          enableReinitialize = {true}
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
            <form className = "p-4" onSubmit = {handleSubmit}>
              <Grid container spacing = {3} alignItems = "center">
                <Grid item md = {2} sm = {4} xs = {12} className = "font-weight-bold">
                  First name
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.first_name && touched.first_name}
                    helperText = {touched.first_name && errors.first_name}
                    label = "First name"
                    name = "first_name"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.first_name}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Last name
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Last name"
                    name = "last_name"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.last_name}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Email
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.email && touched.email}
                    helperText = {touched.email && errors.email}
                    label = "Email"
                    name = "email"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.email}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Phone
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.phone && touched.phone}
                    helperText = {touched.phone && errors.phone}
                    label = "Phone"
                    name = "phone"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.phone}
                    onChange = {createLead}
                    placeholder = "Enter the country code"
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Course
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.course && touched.course}
                    helperText = {touched.course && errors.course}
                    label = "Course"
                    name = "course"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.course}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Client comments
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Client comments"
                    name = "client_comments"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.client_comments}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Location
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Location"
                    name = "location"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.location}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Language
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.language && touched.language}
                    helperText = {touched.language && errors.language}
                    label = "Language"
                    name = "language"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.language}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Utm url
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Utm url"
                    name = "utm_url"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.utm_url}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Utm medium
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Utm medium"
                    name = "utm_medium"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.utm_medium}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Utm campaign
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Utm campaign"
                    name = "utm_campaign"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.utm_campaign}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Utm source
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Utm source"
                    name = "utm_source"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.utm_source}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Referral key
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Referral key"
                    name = "referral_key"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.referral_key}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Gclid
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Gclid"
                    name = "gclid"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.gclid}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Tags
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Tags"
                    name = "Tags"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.tags}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Automations
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Automations"
                    name = "automations"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.automations}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Tags Objects
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <div className = "flex flex-wrap m--2">
                    <AsyncAutocomplete
                      onChange = {(tags) => {setNewLead({...newLead, tag_objects: [tags.id]}); console.log(tags)}}
                      width = {"40%"}
                      className = "mr-2 ml-2"
                      asyncSearch = {() => bc.marketing().getAcademyTags()}
                      size = {"small"}
                      label = "tags"
                      required = {false}
                      getOptionLabel = {option => `${option.slug}`}
                      />
                  </div>
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Automation Objects
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <div className = "flex flex-wrap m--2">
                    <AsyncAutocomplete
                      onChange = {(automation) => setNewLead({...newLead, automation_objects: [automation.id]})}
                      width = {"40%"}
                      className = "mr-2 ml-2"
                      asyncSearch = {() => bc.marketing().getAcademyAutomations()}
                      size = {"small"}
                      label = "Automation"
                      required = {false}
                      getOptionLabel = {option => `${option.name}`}
                      />
                  </div>
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Street address
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Street address"
                    name = "street_Address"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.street_Address}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Country
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Country"
                    name = "country"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.country}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  State
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "State"
                    name = "state"
                    size = "small"
                    variant = "outlined"
                     defaultValue = {newLead.stats}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  City
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "City"
                    name = "city"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.city}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  ZIP code
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "ZIP code"
                    name = "zip_code"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.zip_code}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Latitude
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Latitude"
                    name = "latitude"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.latitude}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Longitude
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Longitude"
                    name = "longitude"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.longitude}
                    onChange = {createLead}
                  />
                </Grid>
                <Grid item md = {2} sm = {4} xs = {12}>
                  Browser lang
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    label = "Browser lang"
                    name = "browser_lang"
                    size = "small"
                    variant = "outlined"
                    defaultValue = {newLead.browser_lang}
                    onChange = {createLead}
                  />
                </Grid>                
                <Grid item md = {2} sm = {4} xs = {12}>
                  Lead type
                </Grid>
                <Grid item md = {10} sm = {8} xs = {12}>
                  <TextField
                    error = {errors.lead_type && touched.lead_type}
                    helperText = {touched.lead_type && errors.lead_type}
                    select
                    label = "type"
                    name = "lead_type"
                    size = "small"
                    variant = "outlined"
                    value = {leadType}
                    onChange = {selectTypeLead}
                    >
                      {leadTypes.map((option) => (
                        <MenuItem key = {option.value} value = {option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
              <div className = "mt-6">
              
                  <Button color = "primary" variant = "contained" type = "submit">
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