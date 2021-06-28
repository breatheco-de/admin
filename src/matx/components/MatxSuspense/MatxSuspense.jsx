/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Suspense, useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
// eslint-disable-next-line import/no-useless-path-segments
import { MatxLoading } from '../../../matx';
import axios from '../../../axios';

const MatxSuspense = (props) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.loadbar) {
      axios.interceptors.request.use(
        (config) => {
          // spinning start to show
          setLoading(true);
          return config;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        },
      );

      axios.interceptors.response.use(
        (response) => {
          // spinning hide
          setLoading(false);

          return response;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        },
      );
    }
  }, []);

  return (
    <Suspense fallback={<MatxLoading />}>
      {loading && props.loadbar && <LinearProgress />}
      {props.children}
    </Suspense>
  );
};

export default MatxSuspense;
