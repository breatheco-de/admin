import React from 'react'
import PropTypes from 'prop-types'

const SessionBill = ({ session }) => {

    return (
        <div>
            {session?.billed_str}
            {session?.extra_time ?
                <small style={{ display: 'block', fontSize: '8px' }} className="text-danger">overtime
                </small> : ''}
            <small>
                meeting lasted: {session?.duration_string}
            </small>
        </div>
    )
}

SessionBill.propTypes = {
    session: PropTypes.object
}

export default SessionBill