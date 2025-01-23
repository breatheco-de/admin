import React from 'react'
import PropTypes from 'prop-types'
import dayjs from "dayjs";
import calcMeetingDuration from 'app/utils/calcMeetingDuration';

const duration = require("dayjs/plugin/duration");
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const utc = require("dayjs/plugin/utc");

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);



const SessionDetails = ({ session }) => {
    let now = dayjs.utc();
    // now.format();
    // now.local().format();
    let startDate = session?.starts_at || null;
    let joiningDate = session?.started_at || session?.mentor_joined_at;
    let daysAgo = dayjs(startDate || joiningDate).from(now);

    return (
        <div>
            <p className='no-margin'>
                {startDate ? dayjs(startDate).format('lll') : joiningDate ? dayjs(joiningDate).format('lll') : 'Never started'} with <strong>
                    {session?.mentee?.first_name} {session?.mentee?.last_name}</strong>
            </p>
            <small>
                {startDate || joiningDate && daysAgo}{' '}
                {!joiningDate && <span className='red'>Neither the mentor or mentee every joined</span>}
            </small>
        </div>
    )
}

SessionDetails.propTypes = {
    session: PropTypes.object
}

export default SessionDetails