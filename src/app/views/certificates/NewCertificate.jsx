import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import {
  Grid, Card, Divider, Button,
} from '@material-ui/core';
import axios from '../../../axios';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import { Breadcrumb } from '../../../matx';
import ResponseDialog from './ResponseDialog';
import bc from '../../services/breathecode';
import { getSession } from '../../redux/actions/SessionActions';

const NewCertificate = () => {
  const { certificateSlug } = useParams();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [responseData, setResponseData] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const session = getSession();
  const history = useHistory();
  const [state, setState] = useState({
    cohort: '',
    student: '',
    academy: '',
    specialty: '',
    slug: 'default',
    signed_by: '',
    signed_by_role: 'Director',
  });

  const generatingSingleStudentCertificate = (payload) => {
    const { cohort, user } = state.student;
    bc.certificates()
      .generateSingleStudentCertificate(cohort.id, user.id, payload)
      .then((data) => {
        if (data !== undefined && data.status >= 200 && data.status < 300) {
          setTimeout(() => {
            history.push('/certificates');
          }, 1000);
        }
      });
  };

  const generatingAllCohortCertificates = (payload) => {
    setIsLoading(true);
    bc.certificates()
      .generateAllCohortCertificates(state.cohort.id, payload)
      .then((data) => {
        if (data !== undefined && data.status >= 200 && data.status < 300) {
          setResponseData(data);
          setIsLoading(false);
          setOpenDialog(true);
        }
      });
  };

  const generateCerfiticate = (payload) => {
    if (certificateSlug === 'single') generatingSingleStudentCertificate(payload);
    else generatingAllCohortCertificates(payload);
  };

  return (
    <div className="m-sm-30">
      <ResponseDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        responseData={responseData}
        isLoading={isLoading}
        cohortId={state.cohort.id}
      />
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Certificates', path: '/certificates' },
            {
              name: certificateSlug === 'single' ? 'New Certificate' : 'All Certificates',
            },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">
            {certificateSlug === 'single'
              ? 'Create Student Certificate'
              : 'Create all cohort certificates'}
          </h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={state}
          onSubmit={(values) => generateCerfiticate(values)}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                {certificateSlug === 'all' && (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      <div className="flex mb-6">Cohort</div>
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        size="small"
                        width="100%"
                        asyncSearch={() => axios.get(
                          `${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`,
                        )}
                        onChange={(cohort) => setState({ ...state, cohort })}
                        getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                        label="Cohort"
                      />
                    </Grid>
                  </>
                )}
                {certificateSlug === 'single' && (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      Student
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        size="small"
                        key={state.cohort.slug}
                        width="100%"
                        asyncSearch={() => axios.get(
                          `${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?academy=${session?.academy.slug}&roles=STUDENT&educational_status=ACTIVE,GRADUATED`,
                        )}
                        onChange={(student) => setState({ ...state, student })}
                        value={state.student}
                        getOptionLabel={(option) => option.length !== 0
                          && `${option.user.first_name} ${option.user.last_name} (${option.cohort.name})`}
                        label="Student"
                      />
                    </Grid>
                  </>
                )}
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

export default NewCertificate;
