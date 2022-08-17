import React, { useState, useEffect } from 'react';
import {
  Button, Card, Divider, Grid, TextField,
  MenuItem,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../../hooks/useQuery';
import { Breadcrumb } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';
import { MentorProfileForm } from './mentor-utils/MentorProfileForm';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  booking_url: '',
  slug: '',
  one_line_bio: '',
  online_meeting_url: '',
  status: '',
  price_per_hour: '',
  existing_user: '',
};

const filter = createFilterOptions();

const NewMentor = () => {

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    bc.mentorship().getAllServices()
      .then((payload) => {
        // console.log('Mentorship Service response', payload);
        setServiceList(payload.data || []);
      });
  }, []);

  const query = useQuery();
  const baseData = query.has('data') ? JSON.parse(atob(query.get('data'))) : null;
  console.log('baseData');
  console.log(baseData);
  const [showForm, setShowForm] = useState({
    show: !!baseData,
    data: {
      first_name: '',
      last_name: '',
      email: '',
      booking_url: '',
      slug: '',
      one_line_bio: '',
      online_meeting_url: '',
      status: 'INVITED',
      price_per_hour: '',
      syllabus: [],
      existing_user: '',
      ...baseData,
    },
  });

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: 'Mentorship', path: '/mentors' }, { name: 'New Mentor' }]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a mentor to service</h4>
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
            : <MentorProfileForm initialValues={showForm.data} serviceList={serviceList} />
        }
      </Card>
    </div>
  );
};

export default NewMentor;
