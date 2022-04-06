import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Icon } from '@material-ui/core'


const SessionNotes = ({ session }) => {
    console.log(session);
    return (
        <div>
            {session && session.summary ?
                <Tooltip title={session.summary}>
                    <Icon fontSize="small">speaker_notes</Icon>
                </Tooltip> : ''
            }
            {session.extra_time !== null ?
                <Tooltip title={session.extra_time}>
                    <Icon fontSize="small" className='red'>access_time</Icon>
                </Tooltip> : ''
            }
            {session.mentor_late !== null ?
                <Tooltip title={session.mentor_late}>
                    <Icon fontSize="small" className='red'>directions_run</Icon>
                </Tooltip> : ''
            }
        </div>
    )
}

SessionNotes.propTypes = {}

export default SessionNotes