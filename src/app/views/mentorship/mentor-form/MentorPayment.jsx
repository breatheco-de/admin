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
        before: paymentRange?.before.format('YYYY-MM-DD'),
        after: paymentRange?.after.format('YYYY-MM-DD'),
        token: session.token
      });
    setPayments(data || []);
  }, [paymentRange])

  const rows = [
    { id: 0, month: "January", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 1, month: "February", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 2, month: "March", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 3, month: "April", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 4, month: "May", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 5, month: "June", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 6, month: "July", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 7, month: "August", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 8, month: "September", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 9, month: "October", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 10, month: "November", amount_due: null, total_amount_paid: null, total_approved: null },
    { id: 11, month: "December", amount_due: null, total_amount_paid: null, total_approved: null },
  ];

  const columns = [
    {
      field: "id",
      headerName: "Month",
      width: 90,
      valueGetter: function (params) {
        return `${params.row.month}`;
      },
    },
    { field: "amount_due", headerName: "Amount due", width: 130, },
    { field: "total_approved", headerName: "Total approved", width: 130 },
    { field: "total_amount_paid", headerName: "Total paid", width: 130 },
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
        >
          Open
        </Button>
      ),
      // valueGetter: (params) => {
      //    return( `${params.row.amount_due || ""} ${params.row.amount_paid || ""}`)
      // },
    },
  ];
  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
      </MuiPickersUtilsProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className="m-2"
          margin="none"
          label="Before"
          inputVariant="outlined"
          type="text"
          size="small"
          data-cy="before"
          clearable
          autoOk
          value={paymentRange.before}
          format="yyyy-MMM-dd"
          onChange={(date) =>
            setPaymentRange({
              ...paymentRange,
              before: date,
            })
          }
        />
      </MuiPickersUtilsProvider>
      <Divider />
      <DataTable
        before={paymentRange.before}
        after={paymentRange.after}
        data={payments || []}
        columns={columns}
        rows={rows} />
    </>
  )
}

MentorPayment.Proptypes = {}