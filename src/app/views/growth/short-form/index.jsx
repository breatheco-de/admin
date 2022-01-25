import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios.js';
import {
  Grid,
  Icon,
  Select,
  DialogTitle,
  Dialog,
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import { getToken, getSession } from '../../../redux/actions/SessionActions';
import { MatxLoading } from '../../../../matx';
import DowndownMenu from '../../../components/DropdownMenu';
import Short from './editShort'
import { useHistory } from 'react-router-dom';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const useStyles = makeStyles(() => ({
  dialogue: {
    color: 'rgba(52, 49, 76, 1)',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  select: {
    width: '15rem',
  },
}));



const IndexShort = () => {
  const { slug, destination } = useParams();
  const classes = useStyles();
  const history = useHistory();

  const [isPrivate, setPrivate] = useState(true);
  const [checked, setChecked] = useState(false);


  const [short, setShort] = useState(null
    // {
    //   slug: '',
    //   destination: '',
    //   hits: 0,
    //   private: false,
    //   author: 1,
    //   utm_campaign: '',
    //   utm_campaign: '',
    //   utm_medium: '',
    //   utm_content: '',
    //   utm_source: '',
      
    // },
  );
  
  // const handlePrivate = (event) => {
  //   setChecked(event.target.checked);
  //   setShort({
  //     ...short,
  //     isPrivate: true,
  //   });
  // };

  // const editShort = (event) => {
  //   setShort({ ...short, [event.target.name]: event.target.value });
  // };

  const token = getToken();
  const session = getSession();
  

  useEffect(() => {
    bc.marketing()
      .getAcademyShort()
      .then(({ data }) => {
        console.log("esta es data", data)
        console.log("esta es author", )
        setShort(data);
      })
      .catch((error) => console.error(error));
  }, []);


  

  const updateShort = (values) => {
    // const { ending_date, ...rest } = values;
    if (values) {
      bc.marketing()
        .updateShort(values)
        .then((data) => data)
        .catch((error) => console.error(error));
    } 
  };

  
  
  return (
    <>
      <div className="m-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          
          
        </div>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            {short && (
              <Short
                slug={slug}
                destination={short.destination}
                // hits={short.hits}
                author={1}
                utm_campaign={short.utm_campaign}
                utm_medium={short.utm_medium}
                utm_content={short.utm_content}
                utm_source={short.utm_source}
                // isPrivate={short.isPrivate}
                onSubmit={updateShort}
              />
            )}
          </Grid>
          <Grid item md={8} xs={12}>
            {/* {short && <CohortStudents slug={slug} shortId={short.id} />} */}
          </Grid>
        </Grid>
      </div>
      <Dialog
        // onClose={() => setStageDialog(false)}
        // open={stageDialog}
        // aria-labelledby="simple-dialog-title"
      >
        {/* <DialogTitle id="simple-dialog-title">Select a Cohort Stage</DialogTitle> */}
        <Formik
          initialValues={{
              // slug: slug,
              // destination: destination,
              // // isPrivate: short.isPrivate,
              // utm_campaign: short.utm_campaign,
              // utm_medium: short.utm_medium,
              // utm_content: short.utm_content,
              // utm_source: short.utm_source,
          }}
          enableReinitialize
          // validationSchema={ProfileSchema}
          onSubmit={() => {
            updateShort({
              slug: short.slug,
              destination: short.destination,
              // isPrivate: short.isPrivate,
              utm_campaign: short.utm_campaign,
              utm_medium: short.utm_medium,
              utm_content: short.utm_content,
              utm_source: short.utm_source,
            });
          }}
        >
         
        </Formik>
      </Dialog>
      
    </>
  );
};

export default IndexShort;
