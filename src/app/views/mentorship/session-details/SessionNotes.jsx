import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs';
import { Tooltip, Icon } from '@material-ui/core'

const duration = require('dayjs/plugin/duration');
dayjs.extend(duration)

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  minutes = minutes - (hours * 60);

  const validHours = typeof hours === 'number' && hours > 0;
  const validMinutes = typeof minutes === 'number' && minutes > 0;

  return `${validHours ? ` ${hours} hr${validMinutes ? ',' : ''}` : ""}${validMinutes ? ` ${minutes} min` : ""}`;
}

const hasExtraTime = (sess) => {
  if (sess.extra_time !== undefined || sess.started_at === null || sess.ended_at === null) return null;
  const endedAt = new Date(sess.ended_at);
  const startedAt = new Date(sess.started_at);

  
  if ((endedAt - startedAt) / (1000 * 60 * 60 * 24) > 1) return 'Many days of extra time, probably it was never closed';
  if (!sess.service) return 'Please setup service for this session';


  if ((endedAt - startedAt) / 1000 > sess.service.duration) {
    const date1 = dayjs(sess.ended_at);
    const date2 = dayjs(sess.started_at).add(sess.service.duration, 'second');

    let minutes = date1.diff(date2, 'minute');

    return `Extra time of ${formatTime(minutes)}, the expected duration was ${formatTime(sess.service.duration / 60)}`;
  }

  return null;
}

const isMentorLate = (sess) => {
  const date1 = dayjs(sess.mentor_joined_at);
  const date2 = dayjs(sess.started_at);

  let minutes = date2.diff(date1, 'minute');

  let message = `Mentor Joined ${formatTime(minutes)} after the student`;

  if (new Date(sess.mentor_joined_at) < new Date(sess.started_at) && minutes >= 4) return message;
  return null;
}

const SessionNotes = ({ session }) => {
  const [extraTimeHelper, setExtraTimeHelper] = useState(hasExtraTime(session));
  const [mentorLateHelper, setMentorLateHelper] = useState(isMentorLate(session));

  return (
    <div>
      {session && session.summary ?
        <Tooltip title={session.summary}>
          <Icon fontSize="small">speaker_notes</Icon>
        </Tooltip> : ''
      }
      {session.extra_time !== null && extraTimeHelper ?
        <Tooltip title={session.extra_time || extraTimeHelper}>
          <Icon fontSize="small" className='red'>access_time</Icon>
        </Tooltip> : ''
      }
      {session.mentor_late !== null && mentorLateHelper ?
        <Tooltip title={session.mentor_late || mentorLateHelper}>
          <Icon fontSize="small" className='red'>directions_run</Icon>
        </Tooltip> : ''
      }
    </div>
  )
}

SessionNotes.propTypes = {
  session: PropTypes.object
}

export default SessionNotes