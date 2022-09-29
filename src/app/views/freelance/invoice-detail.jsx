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
  TextField,
  Grid
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
import Alert from "app/components/Alert"
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';


const relativeTime = require('dayjs/plugin/relativeTime');
const duration = require('dayjs/plugin/duration');

dayjs.extend(relativeTime);
dayjs.extend(duration)

const InvoiceDetail = () => {
  const { invoiceID } = useParams();
  const history = useHistory();
  const [invoice, setInvoice] = useState(null);
  const [members, setMembers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMembers = async () => {
    try {
      setLoading(true);
      const { data } = await bc.freelance().getInvoiceMembers({ invoice: invoiceID });
      if (data) setMembers(data.reduce((prev, curr) => ({ ...prev, [curr.freelancer.id]: curr }), {}));
      setLoading(false);
    } catch (e) {
      setError("Error retriving members");
      setLoading(false);
    }
  }
  useEffect(() => getMembers(), [invoiceID]);

  const getInvoice = async () => {
    try {
      setLoading(true);
      const { data } = await bc.freelance().getSingleInvoice(invoiceID);
      if (data) setInvoice(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Error retriving invoice");
      setLoading(false);
    }
  }

  useEffect(() => getInvoice(), [invoiceID]);

  const InputAccounted = ({ issue, index }) => {
    const [value, setValue] = useState(Math.trunc(dayjs.duration({seconds: issue.accounted_duration}).asMinutes()));
    const [focus, setFocus] = useState(false);

    const submit = async (accounted) => {
      await bc.mentorship().updateMentorSession(issue.id,
        {
          accounted_duration: dayjs.duration({minutes: accounted}).asSeconds(),
          mentor: issue.mentor.id
        });

      getInvoice();
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

  // if (loading) return <MatxLoading />

  let segments = [{ name: 'Freelance', path: '#' }, { name: 'Projects', path: `/freelance/project` }]
  if(invoice) segments.concat([{ name: invoice.project.title, path: `/freelance/project/${invoice.project.id}` }, { name: `Invoice ${invoice.id}`, path: "#" }]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={segments} />
          </div>
        </div>
      </div>
      <Grid md={10} lg={8} className="mx-auto">
        {error && <Alert className="mb-3" severity="error">{error.msg || error}</Alert>}
        <Card>
          <div className="p-5">
            <div className="flex justify-between mb-4">
              <IconButton>
                <ArrowBack
                  onClick={() => {
                    history.goBack();
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
                <p>{`#${invoice?.id}`}</p>
              </div>
              <div className="" id="order-status">
                <h5 className="font-normal mb-4 capitalize" ><strong>Order Status: </strong>{invoice?.status}</h5>
                <h5 className="font-normal mb-4 capitalize" ><strong>Order Date: </strong>{dayjs(invoice?.created_at).format('MMMM D, YYYY')}</h5>
              </div>
            </div>
          </div>
          <Divider />
          {/* <div className="flex justify-between p-5" id="invoice-detail">
            <div id="invoice-to">
              <h5 className="mb-2" >Bill To</h5>
              <p>{`${invoice?.mentor?.user.first_name} ${invoice?.mentor?.user.last_name}`}</p>
              <p className="m-0" >{invoice?.mentor?.user.email}</p>
            </div>
          </div> */}
          <div id="table" className='p-4'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="px-0">Item</TableCell>
                  <TableCell className="px-0" align="right">Accounted Duration</TableCell>
                  <TableCell className="px-0" align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice?.issues?.map(({ freelancer, ...issue }, index) => {
                  let price = invoice.project?.total_client_hourly_price;
                  if(members && members[freelancer.id] && members[freelancer.id].total_client_hourly_price && members[freelancer.id].total_client_hourly_price > 0)
                    price = members[freelancer.id].total_client_hourly_price

                  return (
                    <TableRow>
                      <TableCell className="pl-0 p-inherit" align="left">
                        <p className='mb-0'><a href={issue.url} target="_blank" rel="noopener">{issue.title}</a></p>
                        <small className="text-muted">by {freelancer.user?.first_name} {freelancer.user?.last_name}</small>
                      </TableCell>
                      <TableCell className="pl-0" align="right">
                        <p className="mb-0">{issue.duration_in_hours} hrs</p>
                        {price && <small className="text-muted">at ${price} /hr</small>}
                      </TableCell>
                      <TableCell className="pl-0" align="right">
                        <p className="mb-0">${price * issue.duration_in_hours}</p>
                      </TableCell>
                    </TableRow>
                  )
                })}

              </TableBody>
            </Table>
          </div>
          <div className="flex-column p-4 items-end" id="total-info" >
            <p className="mb-0">{`Total duration in hours: ${Math.round(invoice?.total_duration_in_hours * 100) / 100}`}</p>
            {invoice?.overtime_hours && <small className="text-muted text-error">{`${invoice.overtime_hours} Hours of overtime`}</small>}
            <p>{`Total duration in minutes: ${Math.round(invoice?.total_duration_in_minutes * 100) / 100}`}</p>
            <p>{`Total: $${Math.round(invoice?.total_price * 100) / 100}`}</p>
          </div>
        </Card>
      </Grid>
      {loading && <MatxLoading />}
    </div>
  );
};

export default InvoiceDetail;