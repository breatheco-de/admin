import React, { useState } from 'react';
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import useAuth from '../../../hooks/useAuth';
import history from '../../../../history';

const useStyles = makeStyles(() => ({
  cardHolder: {
    background: '#1A2038',
  },
  card: {
    maxWidth: 800,
    borderRadius: 12,
    margin: '1rem',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const JwtLogin = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login, user } = useAuth();

  const classes = useStyles();

  React.useEffect(() => {
    if (user) {
      if (!user.role) history.push('/session/choose');
      else history.push('/');
    }
  }, [user]);

  const handleChange = ({ target: { name, value } }) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...userInfo };
    temp[name] = value;
    setUserInfo(temp);
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      await login(userInfo.email, userInfo.password);
      history.push('/');
    } catch (e) {
      console.log(e);
      setMessage(e.message);
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx('flex justify-center items-center  min-h-full-screen', classes.cardHolder)}
    >
      <Card className={classes.card}>
        <Grid data-cy="login_card" container>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <div className="p-8 flex justify-center items-center h-full">
              <img className="w-200" src="/assets/images/breathecode.small.png" alt="" />
            </div>
          </Grid>
          <Grid item lg={7} md={7} sm={7} xs={12}>
            <div className="p-8 h-full bg-light-gray relative">
              <ValidatorForm data-cy="login_form" onSubmit={handleFormSubmit}>
                <TextValidator
                  data-cy="email"
                  className="mb-6 w-full"
                  variant="outlined"
                  size="small"
                  label="Email"
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={userInfo.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['this field is required', 'email is not valid']}
                />
                <TextValidator
                  data-cy="password"
                  className="mb-3 w-full"
                  label="Password"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  name="password"
                  type="password"
                  value={userInfo.password}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
                <FormControlLabel
                  className="mb-3 min-w-288"
                  name="agreement"
                  onChange={handleChange}
                  control={(
                    <Checkbox
                      size="small"
                      onChange={({ target: { checked } }) => handleChange({
                        target: { name: 'agreement', value: checked },
                      })}
                      checked={userInfo.agreement || true}
                    />
                  )}
                  label="Remeber me"
                />

                {message && <p className="text-error">{message}</p>}

                <div className="flex flex-wrap items-center mb-4">
                  <div className="relative">
                    <Button data-cy="submit_button" variant="contained" color="primary" disabled={loading} type="submit">
                      Sign in
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                  <span className="mr-2 ml-5">or</span>
                  <Button
                    onClick={() => {
                      window.location.href = `${process.env.REACT_APP_API_HOST}/v1/auth/github?url=${window.location.href}`;
                    }}
                    variant="contained"
                    className={classes.socialButton}
                  >
                    <img
                      style={{ height: '20px', marginRight: '5px' }}
                      src="/assets/images/logos/github.svg"
                      alt=""
                    />
                    With Github
                  </Button>
                </div>
                <Button
                  className="text-primary"
                  onClick={() => {
                    window.location.href = `${process.env.REACT_APP_API_HOST}/v1/auth/password/reset`;
                  }}
                >
                  Forgot password?
                </Button>
              </ValidatorForm>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default JwtLogin;
