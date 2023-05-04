import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Icon,
  Button,
  Grid,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import EventTypeDetails from './EventTypeDetails';
import JoinEvents from './ShareEventsCard';
import DowndownMenu from '../../../components/DropdownMenu';
import { Breadcrumb } from '../../../../matx';
import { MatxLoading } from '../../../../matx';
import ConfirmAlert from '../../../components/ConfirmAlert';
import { getSession } from '../../../redux/actions/SessionActions';


toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

// TODO: this require in this context is weird
const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Eventtype = () => {
  const { slug } = useParams();
  const session = getSession();
  const [eventype, setEventype] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDeleteVisibility, setOpenDialogDeleteVisibility] = useState(false);
  const [makePublicDialog, setMakePublicDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibilitySetting, setVisibilitySetting] = useState(null)

  //  const howManyDaysAgo = () => {
  //    if (!eventype) return 0;
  //   return dayjs().diff(eventype.created_at, 'days');

  //  };


  const options = [
    { label: `Make ${eventype?.private ? 'public' : 'private'}`, value: 'make_public' },
    { label: 'Edit Event Type Content', value: 'edit_eventype' },
  ];

  const fetchEventype = async () => {
    try {
      const response = await bc.events().getAcademyEventTypeSlug(slug);
      setEventype(response.data);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchEventypePromise = fetchEventype();
    fetchEventypePromise.then(() => setIsLoading(false));
  }, []);

  const updateEventype = async (values) => {
    try {
      values.academy = values.academy.id
      await bc.events().updateAcademyEventTypeSlug(slug, values);
      fetchEventype();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVisibilitySetting = async (visibilitySettingID) => {
    try {
      const response = await bc.events().deleteAcademyEventTypeVisibilitySetting(eventype.slug, visibilitySettingID);
      if (response.status === 204) {
        await fetchEventype();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAccept = () => updateEventype({ private: !eventype.private });

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        {isLoading && <MatxLoading />}
        {/* This Dialog opens the modal to delete the user in the cohort */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        </Dialog>
        <Dialog
          open={openDialogDeleteVisibility}
          onClose={() => setOpenDialogDeleteVisibility(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete this Visibility Setting from the Event Type?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenDialogDeleteVisibility(false)} color="primary">
              Disagree
            </Button>
            <Button color="primary" autoFocus onClick={() => {
              deleteVisibilitySetting(visibilitySetting.id);
              setOpenDialogDeleteVisibility(false);
              setVisibilitySetting(null);
            }}>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <div className='my-3'>
          <Breadcrumb routeSegments={[{ name: 'Event List', path: '/events/list' }, { name: 'Event Types', path: '/events/eventype' }, { name: `${eventype?.slug}` }]} />
          </div>
          <h3 className="mt-2 mb-2 font-medium text-28">
            {eventype?.slug}
          </h3>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            if (value === 'edit_eventtype') {
              window.open(`https://eventype.4geeks.com/?academy=${session.academy.id}&events/?eventype=${eventype?.slug}&token=${session.token}`, '_blank');
            } else if (value === 'make_public') {
              setMakePublicDialog(true);
            }
          }}
        >
        </DowndownMenu>
      </div>

      {eventype ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EventTypeDetails eventype={eventype} onSubmit={updateEventype} />
          </Grid>


          <Grid item xs={12} md={6}>
            <JoinEvents eventype={eventype} fetchEventype={fetchEventype} setEventype={setEventype} openDialogDeleteVisibility={openDialogDeleteVisibility} setOpenDialogDeleteVisibility={setOpenDialogDeleteVisibility} setVisibilitySetting={setVisibilitySetting} />
          </Grid>

        </Grid>
      ) : ''}
      <ConfirmAlert
        title={`Are you sure you want to make ${eventype?.private ? 'public' : 'private'} this eventype`}
        isOpen={makePublicDialog}
        setIsOpen={setMakePublicDialog}
        onOpen={onAccept}
      />
    </div>
  );
};

export default Eventtype;
