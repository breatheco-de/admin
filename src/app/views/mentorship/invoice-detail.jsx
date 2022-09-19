import {
  Button,
  IconButton,
  Tooltip,
  Card,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import School from '@material-ui/icons/School';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import AccessTime from '@material-ui/icons/AccessTime';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';
import { MatxLoading } from "matx";
import bc from 'app/services/breathecode';
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';


const relativeTime = require('dayjs/plugin/relativeTime');
const duration = require('dayjs/plugin/duration');

dayjs.extend(relativeTime);
dayjs.extend(duration)

const InvoiceDetail = () => {
  const { mentorID, invoiceID } = useParams();
  const history = useHistory();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBill = async () => {
    try {
      setLoading(true);
      const { data } = await bc.mentorship().getSingleAcademyMentorshipBill(invoiceID);
      if (data) setBill(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(async () => {
    getBill();
  }, []);

  const InputAccounted = ({ session, index }) => {
    const [value, setValue] = useState(Math.trunc(dayjs.duration({seconds: session.accounted_duration}).asMinutes()));
    const [focus, setFocus] = useState(false);

    const submit = async (accounted) => {
      await bc.mentorship().updateMentorSession(session.id,
        {
          accounted_duration: dayjs.duration({minutes: accounted}).asSeconds(),
          mentor: session.mentor.id
        });

      getBill();
    }

    return (
      <div className="flex">
        <div style={{ width: '45%' }}>
          <TextField
            name={`accounted-${index}`}
            size="small"
            variant="outlined"
            // value={Math.round(value * 100) / 100}
            value={value}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(function () {
              setFocus(false)
            }, 100)}
            onChange={(e) => {
              setValue(e.target.value)
            }}

          />
        </div>
        {focus && <Button style={{ marginLeft: '5px' }} size="small" variant="contained" color="primary" onClick={() => submit(value)}>Save</Button>}
      </div>

    )
  }

  const recalculateBill = async () => {
    try {
      setLoading(true);
      await bc.mentorship().generateBills({ id: mentorID });
      getBill();

    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  // if (loading) return <MatxLoading />

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Mentorship', path: '/mentors' }, { name: 'Mentor', path: `/mentors/${mentorID}` }, { name: 'Invoice' }]} />
          </div>
        </div>
      </div>
      <Card>
        <div className="p-5">
          <div className="flex justify-between mb-4">
            <IconButton>
              <ArrowBack
                onClick={() => {
                  history.push( `/mentors/${mentorID}`);
                }}
              />
            </IconButton>
            {/* <Button variant="contained" color="primary">
              Print Invoice
            </Button> */}
          </div>
          <div className="flex justify-between">
            <div className="" id="order-info">
              <h5 className="mb-2" >Order Info</h5>
              <p>Order Number</p>
              <p>{`#${bill?.id}`}</p>
            </div>
            <div className="" id="order-status">
              <h5 className="font-normal mb-4 capitalize" ><strong>Order Status: </strong>{bill?.status}</h5>
              <h5 className="font-normal mb-4 capitalize" ><strong>Order Date: </strong>{dayjs(bill?.created_at).format('MMMM D, YYYY')}</h5>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between p-5" id="bill-detail">
          <div id="bill-to">
            <h5 className="mb-2" >Bill To</h5>
            <p>{`${bill?.mentor?.user.first_name} ${bill?.mentor?.user.last_name}`}</p>
            <p className="m-0" >{bill?.mentor?.user.email}</p>
          </div>
        </div>
        <div id="table" className='p-4'>
          {bill?.status === 'RECALCULATE' && (
            <p className="text-error">
              <ErrorOutline style={{ verticalAlign:'middle' }} />
              This bill needs to be recalculated because some of the sessions were modified, please <a style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={recalculateBill}>click here to recalculate it</a>
            </p> 
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="px-0">Item</TableCell>
                <TableCell className="px-0 text-center"><p className="m-0 text-center">Notes</p></TableCell>
                <TableCell className="px-0">Accounted Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill?.sessions?.map((session, index) => {
                return (
                  <TableRow>
                    <TableCell className="pl-0 capitalize" align="left">
                      <p className='mb-0'>
                        {`${dayjs(session?.started_at.slice(0, -1)).format('MMMM D, YYYY, h:mm a')} with ${session.mentee?.first_name} ${session.mentee?.last_name}`}
                      </p>
                      <small className="text-muted">{`Meeting lasted: ${session?.duration_string}`}</small>
                    </TableCell>
                    <TableCell className="pl-0">
                      <div style={{textAlign: 'center'}}>
                        {session?.status_message && <Tooltip title={session.status_message}><MonetizationOn /></Tooltip>}
                        {session?.summary && <Tooltip title={session.summary}><School /></Tooltip>}
                        {session?.extra_time && <Tooltip title={session.extra_time}><AccessTime /></Tooltip>}
                        {session?.mentor_late && <Tooltip title={session.mentor_late.replace('<br />', '')}><DirectionsRun /></Tooltip>}
                        {session?.rating && session.rating.score && <Tooltip title={`Score: ${session.rating.score}`}>{session.rating.score <= 7 ? <SentimentVeryDissatisfied /> : <SentimentSatisfiedAlt />}</Tooltip>}
                      </div>
                    </TableCell>
                    <TableCell className="pl-0">
                      {session && <InputAccounted key={session.id} session={session} index={index} />}
                      <small className={`text-muted ${session.suggested_accounted_duration !== session.accounted_duration && "text-error"}`}>{`Suggested: ${Math.trunc(dayjs.duration({seconds: session.suggested_accounted_duration}).asMinutes())}`}</small>
                    </TableCell>
                  </TableRow>
                )
              })}

            </TableBody>
          </Table>
        </div>
        <div className="flex-column p-4 items-end" id="total-info" >
          <p className="mb-0">{`Total duration in hours: ${Math.round(bill?.total_duration_in_hours * 100) / 100}`}</p>
          {bill?.overtime_hours && <small className="text-muted text-error">{`${bill.overtime_hours} Hours of overtime`}</small>}
          <p>{`Total duration in minutes: ${Math.round(bill?.total_duration_in_minutes * 100) / 100}`}</p>
          <p>{`Total: $${Math.round(bill?.total_price * 100) / 100}`}</p>
        </div>
      </Card>
      {loading && <MatxLoading />}
    </div>
  );
};

export default InvoiceDetail;