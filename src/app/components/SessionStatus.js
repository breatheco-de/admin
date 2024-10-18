import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { hasExtraTime, isMentorLate } from '../views/mentorship/session-details/SessionNotes';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const SessionStatus = ({ handleClose, session = {} }) => {
  const extraTimeHelper = hasExtraTime(session);
  const mentorLateHelper = isMentorLate(session)
    return <Dialog
      onClose={handleClose}
      open={true}
      aria-labelledby="simple-dialog-title"
    >
      <div className="px-sm-24 pt-sm-24">
        <div className="flex items-center">
          <div className="flex items-center flex-grow">
            <p className="m-0 mb-4 text-small text-muted">
              Mentoring Session {session.id}
            </p>
          </div>
          <IconButton size="small" onClick={handleClose}>
            <Icon>clear</Icon>
          </IconButton>
        </div>
        <DialogTitle>
          <Grid container spacing={3}>
            <Grid item md={6} xs={6}>
              <div className="flex items-center">
                <Avatar className="w-48 h-48" src={session.mentor?.user.profile.avatar_url} />
                <div className="ml-3">
                  <span>Mentor</span>
                  <h3 className="my-0 text-15">
                    {session.mentor.user.first_name}
                    {' '}
                    {session.mentor.user.last_name}
                  </h3>
                  <p className='text-small text-muted m-0 p-0'>{session.mentor_joined_at ? `Joined on` : 'Never joined'}</p>
                  {session.mentor_joined_at && <p className='text-small text-muted m-0 p-0'>{dayjs(session.mentor_joined_at).format('lll')}</p>}
                </div>
              </div>
            </Grid>
            <Grid item md={6} xs={6}>
              <div className="flex items-center">
                <Avatar className="w-48 h-48" src={session.mentee?.profile?.avatar_url} />
                <div className="ml-3">
                  <span>Mentee</span>
                  {session.mentee ? 
                    <h3 className="my-0 text-15">
                      {session.mentee.first_name}
                      {' '}
                      {session.mentee.last_name}
                    </h3>
                    :
                    <h3>Uknown</h3>
                  }
                  <p className='text-small text-muted m-0 p-0'>{session.started_at ? `Joined on` : 'Never joined'}</p>
                  {session.started_at && <p className='text-small text-muted m-0 p-0'>{dayjs(session.started_at).format('lll')}</p>}
                </div>
              </div>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <div>
            <div className="comments">
              {session?.extra_time !== null && extraTimeHelper &&
                <p><Icon fontSize="small" className='red'>access_time</Icon> {session.extra_time || extraTimeHelper}</p>
              }
              {session?.mentor_late !== null && mentorLateHelper &&
                <p><Icon fontSize="small" className='red'>directions_run</Icon> {session.mentor_late || mentorLateHelper}</p>
              }
              <div className="mb-4">
                <div className="mb-2">
                  <h3 className="m-0"><Icon fontSize="small">speaker_notes</Icon>{session.summary}</h3>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-3 bg-primary text-white"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </div>
    </Dialog>
}

SessionStatus.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  answer: PropTypes.object,
};

export default SessionStatus;
