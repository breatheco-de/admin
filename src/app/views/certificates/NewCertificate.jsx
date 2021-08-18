import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import {
  Grid, Card, Divider, Button,
} from '@material-ui/core';
import { Breadcrumb } from '../../../matx';
import bc from '../../services/breathecode';
import axios from '../../../axios';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import ResponseDialog from './ResponseDialog';
import { getSession } from '../../redux/actions/SessionActions';

const NewCertificate = () => {
  const [certificateSlug, setCertificateSlug] = React.useState('');
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
    layout_slug: '',
    signed_by: '',
    signed_by_role: 'Director',
  });

  const generatingSingleStudentCertificate = (payload) => {
    const { cohort, user } = state.student;
    bc.certificates()
      .generateSingleStudentCertificate(cohort.id, user.id, payload)
      .then((data) => {
        if (data !== undefined && data.status >= 200 && data.status < 300) history.push('/certificates');
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

  const handleChange = ({ slug, cohort, student }) => {
    if (cohort === null || student === null) {
      setCertificateSlug('');
      setState({ ...state, student: '', cohort: '' });
      return;
    }
    if (slug === undefined) throw new Error('Invalid Action!');
    setCertificateSlug(slug);
    if (slug === 'all') setState({ ...state, cohort });
    if (slug === 'single') setState({ ...state, student });
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
              name: 'Generate Certificates',
            },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Generate Certificates</h4>
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
                <Grid item md={2} sm={4} xs={12}>
                  Cohort
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    size="small"
                    disabled={certificateSlug === 'single'}
                    width="100%"
                    asyncSearch={() => axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`)}
                    onChange={(cohort) => handleChange({ slug: 'all', cohort })}
                    getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                    label="Select a Cohort"
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Student
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    size="small"
                    disabled={certificateSlug === 'all'}
                    key={state.cohort.slug}
                    width="100%"
                    asyncSearch={() => axios.get(
                      `${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?academy=${session?.academy.slug}&roles=STUDENT&educational_status=ACTIVE,GRADUATED`,
                    )}
                    onChange={(student) => handleChange({ slug: 'single', student })}
                    getOptionLabel={(option) => option.length !== 0
                      && `${option.user.first_name} ${option.user.last_name} (${option.cohort.name})`}
                    label="Select a Student"
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Layout Design
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    id="layoutDesign"
                    onChange={(layoutDesign) => setState({ ...state, layout_slug: layoutDesign.slug })}
                    width="50%"
                    asyncSearch={() => bc.layout().getDefaultLayout()}
                    size="small"
                    prefetch
                    debaunced
                    label="Layout Design"
                    required
                    getOptionLabel={(option) => `${option.slug}`}
                    renderOption={(option) => (
                      <React.Fragment>
                        <img src={option.preview_url || option.background_url} style={{maxHeight: 100}} />
                        &nbsp; {option.slug}
                      </React.Fragment>
                    )}
                  />
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

export default NewCertificate;
