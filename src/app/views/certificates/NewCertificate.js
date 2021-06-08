import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import { Grid, Card, Divider, Button } from "@material-ui/core";
import { Breadcrumb } from "matx";

import { AsyncAutocomplete } from "../../components/Autocomplete";
import ResponseDialog from "./ResponseDialog";

const NewCertificate = () => {
  const { type } = useParams();
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [specialties, setSpecialties] = useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [responseData, setResponseData] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cohort, setCohort] = useState([]);
  const [student, setStudent] = useState([]);
  const session = JSON.parse(localStorage.getItem("bc-session"));
  let history = useHistory();

  const getSpecialties = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/v1/certificate/specialty`)
      .then(({ data }) => setSpecialties(data))
      .catch((error) =>
        setMsg({ alert: true, type: "error", text: error.details || error.detail })
      );
  };


  useEffect(() => {
    getSpecialties();
  }, []);

  

  const postCerfiticate = (values) => {
    // student certificate
    if (type === "single") {
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${student.cohort.id}/student/${student.user.id}`,
          values
        )
        .then((data) => {
          setMsg({
            alert: true,
            type: "success",
            text: "Certificate added successfully",
          });
          setTimeout(function () {
            history.push("/certificates");
          }, 1000);
        })
        .catch(
          (error) =>
            console.log("error", error) ||
            setMsg({
              alert: true,
              type: "error",
              text: error.detail || "Unknown error, check cerficate fields",
            })
        );
    }
    if (type === "all") {
      //all certificates
      setIsLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${cohort.id}`,
          values
        )
        .then((data) => {
          setResponseData(data);
          setIsLoading(false);
          setOpenDialog(true);
        })
        .catch((error) =>
          setMsg({
            alert: true,
            type: "error",
            text:
              error.detail ||
              error.slug[0] ||
              error.name[0] ||
              error.kickoff_date[0] ||
              "Unknown error, check cerficate fields",
          })
        );
    }
  };

  return (
    <div className='m-sm-30'>
      <ResponseDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        responseData={responseData}
        isLoading={isLoading}
        cohortId={cohort.id}
      />
      <div className='mb-sm-30'>
        <Breadcrumb
          routeSegments={[
            { name: "Certificates", path: "/certificates" },
            {
              name: type === "single" ? "New Certificate" : "All Certificates",
            },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className='flex p-4'>
          <h4 className='m-0'>
            {type === "single"
              ? "Create Student Certificate"
              : "Create all cohort certificates"}
          </h4>
        </div>
        <Divider className='mb-2' />

        <Formik
          initialValues={initialValues}
          onSubmit={(values) => postCerfiticate(values)}
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
                {type === "all" && (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      <div className='flex mb-6'>Cohort</div>
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        size='small'
                        width='100%'
                        asyncSearch={() =>
                          axios.get(
                            `${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`
                          )
                        }
                        onChange={(cohort) => setCohort(cohort)}
                        getOptionLabel={(option) =>
                          `${option.name}, (${option.slug})`
                        }
                        label='Cohort'
                      />
                    </Grid>
                  </>
                )}
                {type === "single" ? (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      Student
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        size='small'
                        key={cohort.slug}
                        width='100%'
                        asyncSearch={() =>
                          axios.get(
                            `${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?academy=${session?.academy.slug}&roles=STUDENT&educational_status=ACTIVE,GRADUATED`
                          )
                        }
                        onChange={(student) => setStudent(student)}
                        value={student}
                        getOptionLabel={(option) =>
                          option.length !== 0 &&
                          `${option.user.first_name} ${option.user.last_name} (${option.cohort.name})`
                        }
                        label='Student'
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <div className='mt-6'>
                <Button color='primary' variant='contained' type='submit'>
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
            onClose={() => setMsg({ alert: false, text: "", type: "" })}
          >
            <Alert
              onClose={() => setMsg({ alert: false, text: "", type: "" })}
              severity={msg.type}
            >
              {msg.text}
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}
      </Card>
    </div>
  );
};

const initialValues = {
  academy: "",
  specialty: "",
  slug: "default",
  signed_by: "",
  signed_by_role: "Director",
};

export default NewCertificate;
