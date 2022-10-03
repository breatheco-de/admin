import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration)

const SessionBill = ({ session }) => {
    if(!session) return "no session";
    
    const getDuration = (start, end) => {
        if(!start) return "Never started";
        if(!end) return "Never ended";
        return dayjs(end).diff(start, 'm') + " min"
    }
    return (
        <div>
            {(!session.bill || session.bill.status == "DUE") ? 
                <small className="d-block text-warning">Not Billed</small>
                :
                <Link to={`/mentors/${session.mentor.id}/invoice/${session.bill.id}`} className="text-primary underline d-block">Billed</Link>
            }
            {session?.extra_time && <small style={{ display: 'block', fontSize: '8px' }} className="text-danger">overtime</small>}
            <small>
                Lasted: {getDuration(session.started_at, session.ended_at)}
            </small>
        </div>
    )
}

SessionBill.propTypes = {
    session: PropTypes.object
}

export default SessionBill