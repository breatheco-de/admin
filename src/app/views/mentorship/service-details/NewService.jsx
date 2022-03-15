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
import { ServiceForm } from './service-utils/ServiceForm'

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

const NewService = () => {

  const query = useQuery();
  const baseData = query.has('data') ? JSON.parse(atob(query.get('data'))) : null;
  const [serviceFormInfo, setServiceFormInfo] = useState({
    show: !!baseData,
    data: {
      slug: '',
      name: '',
      status: 'INNACTIVE',
      duration: '01:00:00',
      max_duration: '7200.0',
      description: null,
      logo_url: null,
      allow_mentee_to_extend: true,
      allow_mentors_to_extend: true,
      missed_meeting_duration: "600.0",
      created_at: '',
      updated_at: ''
    },
  });

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: 'Mentorship', path: '/mentors/services' }, { name: 'New Service' }]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Create a new service.</h4>
        </div>
        <Divider className="mb-2 flex" />
        <ServiceForm initialValues={serviceFormInfo.data} />
      </Card>
    </div>
  );
};

export default NewService;
