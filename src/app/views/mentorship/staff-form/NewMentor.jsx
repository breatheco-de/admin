import {
  Button, Card, Divider, Grid, TextField,
  MenuItem,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../../hooks/useQuery';
import { Breadcrumb } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';
import { ProfileForm } from './staff-utils/ProfileForm';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  booking_url: '',
  slug: '',
  meeting_url: '',
  status: '',
  price_per_hour: '',
  existing_user: '',
};

const filter = createFilterOptions();

const NewMentor = () => {

  const query = useQuery();
  const baseData = query.has('data') ? JSON.parse(atob(query.get('data'))) : null;
  const [showForm, setShowForm] = useState({
    show: !!baseData,
    data: {
      first_name: '',
      last_name: '',
      email: '',
      booking_url: '',
      slug: '',
      meeting_url: '',
      status: 'INVITED',
      price_per_hour: '',
      existing_user: '',
      ...baseData,
    },
  });

  // const [msg, setMsg] = useState({ alert: false, type: '', text: '' });
  // const [user, setUser] = useState({
  //   id: '',
  //   email: '',
  //   first_name: '',
  //   last_name: '',
  // });

  // const [role, setRole] = useState({
  //   slug: '',
  //   name: '',
  // });

  // const history = useHistory();

  // const postMember = (values) => {
  //   // console.log('post member values', values);
  //   const refactor = user.id !== '' ? { user: user.id } : { email: values.email, invite: true, ...values };
  //   console.log('REFACTOR ', refactor);

  //   bc.mentorship()
  //     .addAcademyMentor({ ...refactor, slug: `${values.first_name.toLowerCase()}-${values.last_name.toLowerCase()}` })
  //     .then((data) => {
  //       setShowForm(false);
  //       if (data.status === 201) {
  //         setRole(null);
  //         setUser(null);
  //         history.push('/admin/staff');
  //       }
  //     })
  //     .catch(() => setShowForm(false));
  // };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: 'Mentorship', path: '/mentors/staff' }, { name: 'New Staff' }]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Mentor</h4>
        </div>
        <Divider className="mb-2 flex" />
        {
          !showForm.show ? (
            <>
              <div className="m-3">
                <Alert severity="success">
                  <AlertTitle>To add a new mentor, they must first be a breathcode user.</AlertTitle>
                </Alert>
              </div>
              <div className="flex m-4">
                <AsyncAutocomplete
                  onChange={(user) => setShowForm({ data: { ...showForm.data, ...user }, show: true })}
                  width="100%"
                  label="Search Users"
                  asyncSearch={(searchTerm) => bc.auth().getAllUsers(searchTerm)}
                  debounced
                  getOptionLabel={(option) => (option.newUser
                    ? option.newUser
                    : `${option.first_name} ${option.last_name}, (${option.email})`)}
                />
              </div>
            </>
          )
            : <ProfileForm initialValues={showForm.data} />
        }
      </Card>
    </div>
  );
};

export default NewMentor;
