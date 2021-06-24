import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {Grid, Card, Divider, Button} from '@material-ui/core';
import { Breadcrumb } from 'matx';
import axios from '../../../axios';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import ResponseDialog from './ResponseDialog';

const NewCertificate = () => {
  const { slug } = useParams();
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [responseData, setResponseData] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cohort, setCohort] = useState([]);
  const [student, setStudent] = useState([]);
  const session = JSON.parse(localStorage.getItem('bc-session'));
  const history = useHistory();

  const generateSingleStudentCertificate = (payload) => {
    const { cohort, user } = student;
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${cohort.id}/student/${user.id}`,
        payload
      )
      .then((data) => {
        if (data !== undefined && data.status >= 200 && data.status < 300) {
          setMsg({
            alert: true,
            type: "success",
            text: "Certificate added successfully",
          });
          setTimeout(function () {
            history.push("/certificates");
          }, 1000);
        }
      })
      .catch((error) => {
        setMsg({
          alert: true,
          type: "error",
          text: error.message,
        });
      });
  };

  const generateAllCohortCertificates = (payload) => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${cohort.id}`,
        payload
      )
      .then((data) => {
        if (data !== undefined && data.status >= 200 && data.status < 300) {
          setResponseData(data);
          setIsLoading(false);
          setOpenDialog(true);
        }
      })
      .catch((error) => {
        setMsg({
          alert: true,
          type: "error",
          text: error.message,
        });
      });
  };

  const generateCerfiticate = (payload) => {
    slug === "single"
      ? generateSingleStudentCertificate(payload)
      : generateAllCohortCertificates(payload);
  };

  return (
    <div className="m-sm-30">
      <ResponseDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        responseData={responseData}
        isLoading={isLoading}
        cohortId={cohort.id}
      />
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Certificates', path: '/certificates' },
            {
              name: slug === "single" ? "New Certificate" : "All Certificates",
            },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className='flex p-4'>
          <h4 className='m-0'>
            {slug === "single"
              ? "Create Student Certificate"
              : "Create all cohort certificates"}
          </h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={initialValues}
          onSubmit={(values) => generateCerfiticate(values)}
          enableReinitialize={true}
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
            <form className='p-4' onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems='center'>
                {slug === "all" && (
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
                        onChange={(cohort) => setCohort(cohort)}
                        getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                        label="Cohort"
                      />
                    </Grid>
                  </>
                )}
                {slug === "single" ? (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      Student
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        size="small"
                        key={cohort.slug}
                        width="100%"
                        asyncSearch={() => axios.get(
                          `${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?academy=${session?.academy.slug}&roles=STUDENT&educational_status=ACTIVE,GRADUATED`,
                        )}
                        onChange={(student) => setStudent(student)}
                        value={student}
                        getOptionLabel={(option) => option.length !== 0
                          && `${option.user.first_name} ${option.user.last_name} (${option.cohort.name})`}
                        label="Student"
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit">
                  Create
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
            <Alert
              onClose={() => setMsg({ alert: false, text: '', type: '' })}
              severity={msg.type}
            >
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

const initialValues = {
  academy: '',
  specialty: '',
  slug: 'default',
  signed_by: '',
  signed_by_role: 'Director',
};

export default NewCertificate;
