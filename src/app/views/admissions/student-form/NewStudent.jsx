import React, { useState } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Card, Divider, Button } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Breadcrumb } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';
import { useQuery } from '../../../hooks/useQuery';
import { ProfileForm } from './student-utils/ProfileForm';

const filter = createFilterOptions();
const NewStudent = () => {
  const query = useQuery();
  const baseData = query.has('data') ? JSON.parse(atob(query.get('data'))) : null;
  const [showForm, setShowForm] = useState({
    show: !!baseData,
    data: {
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      phone: '',
      cohort: '',
      ...baseData,
    },
  });

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Admin', path: '/admin' },
            { name: 'Students', path: '/admissions/students' },
            { name: 'New Student' },
          ]}
        />
      </div>
      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Student</h4>
        </div>
        <Divider className="mb-2 flex" />
        {
          !showForm.show ? (
            <>
              <div className="m-3">
                <Alert severity="success">
                  <AlertTitle>On Adding a new student</AlertTitle>
                  You can search for current users or create a new one
                </Alert>
              </div>
              <div className="flex m-4">
                <AsyncAutocomplete
                  onChange={(user) => setShowForm({ data: { ...showForm.data, ...user }, show: true })}
                  width="100%"
                  label="Search Users"
                  asyncSearch={(searchTerm) => bc.auth().getAllUsers(searchTerm)}
                  debounced
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue !== '') {
                      filtered.push({
                        newUser: (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowForm({
                                show: true,
                                data: {
                                  first_name: params.inputValue,
                                },
                              });
                            }}
                          >
                            {`Invite '
                          ${params.inputValue}
                          ' to Breathecode`}
                          </Button>
                        ),
                        first_name: params.inputValue,
                      });
                    }
                    return filtered;
                  }}
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

export default NewStudent;
