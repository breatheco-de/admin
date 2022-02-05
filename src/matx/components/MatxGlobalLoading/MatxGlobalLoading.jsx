import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  loading: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 'calc(50% - 20px)',
    margin: 'auto',
    height: '40px',
    width: '40px',
    '& img': {
      position: 'absolute',
      height: '25px',
      width: 'auto',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
    },
  },
}));

const Loading = (props) => {
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      // spinning start to show
      setLoading(true);
      return config;
    }, (error) => Promise.reject(error));

    axios.interceptors.response.use((response) => {
      // spinning hide
      setLoading(false);

      return response;
    }, (error) => Promise.reject(error));
  }, []);

  return loading && <LinearProgress />;
};

export default Loading;
