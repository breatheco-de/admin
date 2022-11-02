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

const BillDetail = () => {
  const { paymentID } = useParams();
  const history = useHistory();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBill = async (id) => {
    try {
      setLoading(true);
      const { data, ok } = await bc.freelance().getSingleBill(paymentID);
      if (ok && data) setBill(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError("Error retriving bill");
      setLoading(false);
    }
  }

  useEffect(() => getBill(), [paymentID]);

  // if (loading) return <MatxLoading />

  let segments = [{ name: 'Freelance', path: `#` }, { name: 'Payments', path: `/freelance/payments` }]
  if(bill) segments.concat([{ name: `bill ${bill.id}`, path: "#" }]);

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
                Print bill
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
              <p>{`${bill?.freelancer?.user.first_name} ${bill?.freelancer?.user.last_name}`}</p>
              <p className="m-0" >{bill?.freelancer?.user.email}</p>
            </div>
          </div>
          <div id="table" className='p-4'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="px-0">Item</TableCell>
                  <TableCell className="px-0" align="right">Accounted Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill?.issues?.map(({ freelancer, ...issue }, index) => {
                  return (
                    <TableRow>
                      <TableCell className="pl-0 p-inherit" align="left">
                        <a href={issue.url} target="_blank" rel="noopener">{issue.title}</a>
                      </TableCell>
                      <TableCell className="pl-0" align="right">
                        {issue.duration_in_hours}
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
      </Grid>
      {loading && <MatxLoading />}
    </div>
  );
};

export default BillDetail;