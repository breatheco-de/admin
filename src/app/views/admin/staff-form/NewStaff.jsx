import React, { useState } from 'react';
import { Formik } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {
  Grid, Card, Divider, Button, TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Breadcrumb } from '../../../../matx';
import bc from '../../../services/breathecode';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import * as Yup from 'yup';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
};

const filter = createFilterOptions();

const NewStaff = () => {
  const [msg, setMsg] = useState({ alert: false, type: '', text: '' });
  const [user, setUser] = useState({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [role, setRole] = useState({
    slug: '',
    name: '',
  });
  const [showForm, setShowForm] = useState(false);
  const history = useHistory();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().when('showForm', {
      is: true,
      then: Yup.string().required("Please write the name")
    }),
    last_name: Yup.string().when('showForm', {
      is: true,
      then: Yup.string().required("Please write the last name")
    }),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').when('showForm', {
      is: true,
      then: Yup.string().required("Please write the phone number")
    }),
    email: Yup.string().email('Field should contain a valid e-mail').when('showForm', {
      is: true,
      then: Yup.string().required("Please write the email")
    })
  });

  const postMember = (values) => {
    console.log(values);
    const refactor = user && user.id !== '' ? { user: user.id } : { email: values.email, invite: true, ...values };
    console.log(refactor);
    bc.auth()
      .addAcademyMember({ ...refactor, role: role.slug !== '' ? role.slug : '' })
      .then((data) => {
        if (data.status === 201) {
          setShowForm(false);
          setRole(null);
          setUser(null);
          history.push('/admin/staff');        
        }
      })
      .catch(() => setShowForm(false));
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: 'Admin', path: '/admin/staff' }, { name: 'New Staff' }]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a Staff Member</h4>
        </div>
        <Divider className="mb-2" />
        <div className="m-3">
          <Alert severity="success">
            <AlertTitle>On Adding a new staff member</AlertTitle>
            You can search for current users or invite a new member
          </Alert>
        </div>
        <Formik
          initialValues={{...initialValues, showForm}}
          onSubmit={(values) => postMember(values)}
          enableReinitialize
          validationSchema={ProfileSchema}
        >
          {({
            errors, touched, values, handleChange, handleSubmit, setFieldValue,
          }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  User
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    id="user"
                    onChange={(userData) => setUser(userData)}
                    size="small"
                    width="50%"
                    value={user}
                    label="User"
                    debounced
                    filterOptions={(options) => options}
                    renderOption={(option) => (option.newUser
                      ? option.newUser
                      : `${option.first_name} ${option.last_name}, (${option.email})`)}
                    getOptionLabel={(option) => option.first_name}
                    asyncSearch={(searchTerm) => bc.auth().getAllUsers({ like: searchTerm || '' })}
                    getOptions={(options, params) => {
                      const filtered = filter(options, params);
                      if (params.inputValue !== '') {
                        filtered.push({
                          newUser: (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowForm(true);
                                values.showForm = true;
                                if (params.inputValue.includes('@')) setFieldValue('email', params.inputValue);
                                else setFieldValue('first_name', params.inputValue);
                              }}
                            >
                              {`Invite ${params.inputValue} to 4Geeks.`}
                            </div>
                          ),
                        });
                      }
                      return filtered;
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Role
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    id="roles"
                    onChange={(newRole) => setRole(newRole)}
                    width="50%"
                    asyncSearch={() => bc.auth().getRoles()}
                    size="small"
                    prefetch
                    debaunced
                    label="Roles"
                    required
                    getOptionLabel={(option) => `${option.name}`}
                    value={role}
                  />
                </Grid>
                {showForm ? (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      Name
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <div className="flex">
                        <TextField
                          className="mb-2 mt-2"
                          label="First Name"
                          name="first_name"
                          size="small"
                          required
                          variant="outlined"
                          value={values.first_name}
                          onChange={handleChange}first_name
                          error={errors.first_name && touched.first_name}
                          helperText={touched.first_name && errors.first_name}
                        />
                        <TextField
                          className="m-2"
                          label="Last Name"
                          name="last_name"
                          size="small"
                          required
                          variant="outlined"
                          value={values.last_name}
                          onChange={handleChange}
                          error={errors.last_name && touched.last_name}
                          helperText={touched.last_name && errors.last_name}
                        />
                      </div>
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      Phone number
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <TextField
                        label="Phone number"
                        name="phone"
                        size="small"
                        required
                        variant="outlined"
                        value={values.phone}
                        onChange={handleChange}
                        error={errors.phone && touched.phone}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      Address
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <TextField
                        label="Address"
                        name="address"
                        size="small"
                        type="text"
                        variant="outlined"
                        value={values.address}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      Email
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <TextField
                        label="Email"
                        name="email"
                        size="small"
                        type="email"
                        required
                        variant="outlined"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email && touched.email}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                  </>
                ) : (
                  ''
                )}
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Formik>
        {msg.alert ? (
          <Snackbar
            open={msg.alert}
            autoHideDuration={15000}
            onClose={() => setMsg({ alert: false, text: '', type: '' })}
          >
            <Alert onClose={() => setMsg({ alert: false, text: '', type: '' })} severity={msg.type}>
              {msg.text}
            </Alert>
          </Snackbar>
        ) : (
          ''
        )}
      </Card>
    </div>
  );
};

export default NewStaff;
