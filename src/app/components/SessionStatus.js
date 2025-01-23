import React, { useState } from 'react';
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
import FileCopyIcon from '@material-ui/icons/FileCopy';
import dayjs from 'dayjs';
import { hasExtraTime, isMentorLate } from '../views/mentorship/session-details/SessionNotes';
import { openDialog } from 'app/redux/actions/DialogActions';
import { CopyDialog } from './CopyDialog';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const SessionStatus = ({ handleClose, session = {} }) => {
  const extraTimeHelper = hasExtraTime(session);
  const mentorLateHelper = isMentorLate(session)
  const [copyDialog, setCopyDialog] = useState({
    title: 'Mentoring Session Survey URL',
    openDialog: false,
  });
    return <Dialog
      onClose={handleClose}
      open={true}
      aria-labelledby="simple-dialog-title"
    >
      <CopyDialog
        title={copyDialog.title}
        value={copyDialog.url}
        isOpened={copyDialog.openDialog}
        onClose={() => setCopyDialog({ ...copyDialog, openDialog: false })}
      />
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
            {session?.extra_time !== null && extraTimeHelper &&
              <p><Icon fontSize="small" className='red'>access_time</Icon> {session.extra_time || extraTimeHelper}</p>
            }
            {session?.mentor_late !== null && mentorLateHelper &&
              <p><Icon fontSize="small" className='red'>directions_run</Icon> {session.mentor_late || mentorLateHelper}</p>
            }
          </div>
          <div>
          <h3>Mentee comments:</h3>
            <div className="comments">
              {session.rating == null ?
                <p className='bg-light p-2'>No survey about the session has been found.</p>
                :
                session.rating.score == null ?
                  <div className='bg-light p-2'>Survey was sent, but student has not replied 
                    <Button
                      className='ml-2'
                      variant='outlined'
                      size='small'
                      onClick={() => setCopyDialog({ 
                        ...openDialog,
                        url: `https://nps.4geeks.com/survey/${session.rating.id}`,
                        openDialog: true
                      })}
                    >
                      <FileCopyIcon /> Copy the survey link
                    </Button>  
                  </div>
                  :<>
                    <p>The student gave a <span className={`strong p-1 bg-${session.rating.score >= 8 ? `green` : session.rating.score == 7 ? 'orange' : 'red'}`}>{session.rating.score} / 10</span> rating with the following comments:</p>
                    <p className='bg-light p-2'>{session.rating.comment}</p>
                  </>
              }
            </div>
          </div>
          <div>
            <h3>Mentor comments:</h3>
            <div className="comments">
              <div className="mb-4 bg-light p-2">
              {session.summary == null ?
                <p>The mentor has not provided any feedback about the session.</p>
                :
                <p>{session.summary}</p>
              }
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
