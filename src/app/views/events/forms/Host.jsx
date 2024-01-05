import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { Breadcrumb } from "../../../../matx";
import bc from "../../../services/breathecode";

const Host = () => {
  const { id } = useParams();
  const [host, setHost] = useState({
    avatar_url: '',
    bio: '',
    phone: '',
    show_tutorial: false,
    twitter_username: '',
    github_username: '',
    portfolio_url: '',
    linkedin_url: '',
    blog: '',
  });

  const getHost = async () => {
    try {
      const { data } = await bc.auth().getProfile(id);
      setHost({ ...data });
      console.log(data);
    } catch(e) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    getHost();
  }, []);

  const phoneRegExp = /^\+?1?\d{9,15}$/;

  const ProfileSchema = Yup.object().shape({
    avatar_url: Yup.string().url(),
    bio: Yup.string().nullable().max(255, 'Maximum length is 255 characters'),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  });

  const editHost = (event) => {
    setHost({
      ...host,
      [event.target.name]: event.target.value,
    });
  };

  const putHost = async (values) => {
    try {
      await bc.auth().updateProfile(id, { ...values, user: id })
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Events", path: "/events/list" },
            { name: "Edit Host" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Edit Host</h4>
        </div>
        <Divider className="mb-2" />
        {host && host.user && (
          <div className="p-4">
            <h4 className="m-0">{`${host.user.first_name} ${host.user.last_name}`}</h4>
          </div>
        )}
        <Formik
          initialValues={host}
          onSubmit={(newPostCohort) => putHost(newPostCohort)}
          enableReinitialize
          validationSchema={ProfileSchema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  Avatar url
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Avatar url"
                    name="avatar_url"
                    size="small"
                    style={{ width: "300px" }}
                    variant="outlined"
                    value={host.avatar_url}
                    onChange={(e) => {
                      editHost(e);
                    }}
                    error={errors.avatar_url && touched.avatar_url}
                    helperText={touched.avatar_url && errors.avatar_url}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Bio
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Bio"
                    name="bio"
                    multiline
                    minRows={4}
                    style={{ width: "300px" }}
                    variant="outlined"
                    value={host.bio}
                    onChange={(e) => {
                      editHost(e);
                    }}
                    error={errors.bio && touched.bio}
                    helperText={touched.bio && errors.bio}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Phone
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Phone"
                    name="phone"
                    size="small"
                    variant="outlined"
                    value={host.phone}
                    onChange={(e) => {
                      editHost(e);
                    }}
                    error={errors.phone && touched.phone}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControlLabel
                    className="flex-grow"
                    name="show_tutorial"
                    onChange={() => {
                      setHost((host) => ({ ...host, show_tutorial: !host.show_tutorial }));
                    }}
                    control={<Checkbox checked={host.show_tutorial} />}
                    label="Show Tutorial"
                    style={{ marginRight: "5px" }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Twitter Username
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Twitter Username"
                    name="twitter_username"
                    size="small"
                    variant="outlined"
                    value={host.twitter_username}
                    onChange={(e) => {
                      editHost(e);
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Github Username
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Github Username"
                    name="github_username"
                    size="small"
                    variant="outlined"
                    value={host.github_username}
                    onChange={(e) => {
                      editHost(e);
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Portfolio URL
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Portfolio URL"
                    name="portfolio_url"
                    size="small"
                    variant="outlined"
                    value={host.portfolio_url}
                    onChange={(e) => {
                      editHost(e);
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Linkedin URL
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Linkedin URL"
                    name="linkedin_url"
                    size="small"
                    variant="outlined"
                    value={host.linkedin_url}
                    onChange={(e) => {
                      editHost(e);
                    }}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Blog
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Blog"
                    name="blog"
                    size="small"
                    variant="outlined"
                    value={host.blog}
                    onChange={(e) => {
                      editHost(e);
                    }}
                  />
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                  color="primary"
                  variant="contained"
                >
                  Update
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Host;
