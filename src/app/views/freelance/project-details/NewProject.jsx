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
import bc from '../../../services/breathecode';
import ProjectDetails from './ProjectDetails'

const filter = createFilterOptions();

const NewProject = () => {

  const query = useQuery();
  const baseData = query.has('data') ? JSON.parse(atob(query.get('data'))) : null;
  const [serviceFormInfo, setServiceFormInfo] = useState({
    show: !!baseData,
    data: {
      slug: '',
      name: '',
      status: 'INNACTIVE',
      duration: '60',
      max_duration: '180',
      description: null,
      logo_url: null,
      allow_mentee_to_extend: true,
      allow_mentors_to_extend: true,
      missed_meeting_duration: "10",
      created_at: '',
      updated_at: ''
    },
  });

  const createProject = (values) => {
    bc.freelance()
      .createAcademyProject({
        ...values, 
        // duration: formattedDuration,
      })
      .then(({ data }) => data)
      .catch((error) => console.error(error));
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: 'Freelance', path: '#' }, { name: 'Projects', path: '/freelance/project' }, { name: 'New Project' }]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Create a new project</h4>
        </div>
        <Divider className="mb-2 flex" />
        <ProjectDetails onSubmit={createProject} />
      </Card>
    </div>
  );
};

export default NewProject;
