import React, { useEffect, useState } from 'react';
import { Button, Divider } from '@material-ui/core';
import dayjs from "dayjs";
import bc from '../../../services/breathecode'
import DataTable from 'app/components/SmartMUIDataGrid';
import DateFnsUtils from '@date-io/date-fns';
import { getSession } from 'app/redux/actions/SessionActions';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export const MentorPayment = ({ mentor, staffId }) => {
  const [session] = useState(getSession());
  const [payments, setPayments] = useState([]);
  const lastYear = dayjs().year() - 1;
  const [paymentRange, setPaymentRange] = useState({
    before: dayjs(),
    after: dayjs()
  });

  useEffect(async () => {
    const { data } = await bc.mentorship()
      .getAllAcademyMentorshipBills({
        mentor: staffId,
        // before: paymentRange?.before.format('YYYY-MM-DD'),
        // after: paymentRange?.after.format('YYYY-MM-DD'),
        token: session.token
      });
    setPayments(data || []);
  }, [paymentRange])

  // total amount, overtime, due, status


  const columns = [
    {
      field: "id",
      headerName: "Month",
      width: 90,
      valueGetter: function (params) {
        return dayjs(params.row.started_at).format("MMMM");
      },
    },
    {
      field: "total_price", headerName: "Amount", width: 130,
      valueGetter: function (params) {
        return `$${params.row.total_price}`
      },
    },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "invoice",
      headerName: "View invoice",
      description: "Open invoice to view session details.",
      sortable: false,
      width: 160,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => window.open(`${process.env.REACT_APP_API_HOST}/v1/mentorship/academy/bill/${params.row.id}/html`)}
        >
          View bill
        </Button>
      ),
    },
  ];
  return (
    <>
     // TODO: change to drop down with options ( this year, last year, previous years)
      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className="m-2"
          margin="none"
          label="After"
          inputVariant="outlined"
          type="text"
          size="small"
          clearable
          data-cy="after"
          autoOk
          value={paymentRange.after}
          format="yyyy-MMM-dd"
          onChange={(date) =>
            setPaymentRange({
              ...paymentRange,
              after: date,
            })
          }
        />
      </MuiPickersUtilsProvider> */}
      <Divider />
      <DataTable
        before={paymentRange.before}
        after={paymentRange.after}
        columns={columns}
        rows={payments || []} />
    </>
  )
}

MentorPayment.Proptypes = {}