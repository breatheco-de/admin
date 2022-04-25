import React, { useEffect, useState } from 'react';
import { Button, Divider, TextField, MenuItem } from '@material-ui/core';
import dayjs from "dayjs";
import bc from '../../../services/breathecode'
import DataTable from 'app/components/SmartMUIDataGrid';
import { getSession } from 'app/redux/actions/SessionActions';

export const MentorPayment = ({ mentor, staffId }) => {
  const [session] = useState(getSession());
  const [payments, setPayments] = useState([]);
  const currentYear = dayjs().get('year')
  const [paymentRange, setPaymentRange] = useState({
    label: 'This Year',
    after: `${currentYear}-01-01`,
    before: `${currentYear + 1}-01-01`
  });

  const billingPeriods = [
    {
      label: "This Year",
      year: `${currentYear}-01-01`
    },
    {
      label: "Previous Year",
      year: `${currentYear - 1}-01-01`
    }
  ];

  function handleYearChange(e) {
    if (e.target.value === 'This Year') {
      setPaymentRange({
        ...paymentRange,
        label: e.target.value,
        after: `${currentYear}-01-01`,
        before: `${currentYear + 1}-01-01`,
      })
    }
    if (e.target.value === 'Previous Year') {
      setPaymentRange({
        label: e.target.value,
        after: `${currentYear - 1}-01-01`,
        before: `${currentYear}-01-01`
      })
    }
    fetchBills()
  }

  const fetchBills = async () => {
    const { data } = await bc.mentorship()
      .getAllAcademyMentorshipBills({
        mentor: staffId,
        before: paymentRange?.before,
        after: paymentRange?.after,
        token: session.token
      });
    return data
  }

  useEffect(async () => {
    const { data } = await bc.mentorship()
      .getAllAcademyMentorshipBills({
        mentor: staffId,
        before: paymentRange?.before,
        after: paymentRange?.after,
        token: session.token
      });
    setPayments(data || []);
  }, [paymentRange])

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
      field: "total_price",
      headerName: "Amount",
      width: 130,
      valueGetter: function (params) {
        return `$${params.row.total_price}`
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130
    },
    {
      field: "invoice",
      headerName: "View invoice",
      description: "Open invoice to view session details.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const token = session.token.length > 0 ? `?token=${session.token}` : null;
        let billUrl = `${process.env.REACT_APP_API_HOST}/v1/mentorship/academy/bill/${params.row.id}/html${token || ''}`
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => window.open(billUrl)}
          >
            Open
          </Button>
        )
      }
    },
  ];
  return (
    <>
      <TextField
        className='m-1'
        label="Billing Period"
        style={{ width: '25%', margin: '0.5em' }}
        data-cy="billing_period"
        size="small"
        required
        variant="outlined"
        value={paymentRange.label}
        onChange={(e) => { handleYearChange(e) }}
        select
      >
        {billingPeriods.map((period) => (
          <MenuItem value={period.label} key={period.label}>
            {period.label}
          </MenuItem>
        ))}
      </TextField>
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