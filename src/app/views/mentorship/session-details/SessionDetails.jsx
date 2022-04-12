import React from 'react'
import PropTypes from 'prop-types'
import dayjs from "dayjs";
import calcMeetingDuration from 'app/utils/calcMeetingDuration';

const duration = require("dayjs/plugin/duration");
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(duration);
dayjs.extend(localizedFormat);


const SessionDetails = ({ session }) => {

    return (
        <div>
            <p className='no-margin'>
                {dayjs(session?.started_at).format('lll')} with <strong>
                    {session?.mentee?.first_name} {session?.mentee?.last_name}</strong>
            </p>
            <small>
                meeting lasted: {session?.duration_string}
            </small>
        </div>
    )
}

SessionDetails.propTypes = {
    session: PropTypes.object
}

export default SessionDetails