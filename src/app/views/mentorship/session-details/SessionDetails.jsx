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
    let daysAgo = dayjs(session?.started_at).from(now);


    return (
        <div>
            <p className='no-margin'>
                {dayjs(session?.started_at).format('lll')} with <strong>
                    {session?.mentee?.first_name} {session?.mentee?.last_name}</strong>
            </p>
            <small>
                {daysAgo}
            </small>
        </div>
    )
}

SessionDetails.propTypes = {
    session: PropTypes.object
}

export default SessionDetails