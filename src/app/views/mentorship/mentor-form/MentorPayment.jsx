import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import dayjs from "dayjs";
import bc from '../../../services/breathecode'
import DataTable from 'app/components/SmartMUIDataGrid';

export const MentorPayment = ({ mentor, staffId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(async () => {
    const { data } = await bc.mentorship().getAllAcademyMentorshipBills({ mentor: staffId });
    setPayments(data || []);
  }, [])

  const paymentStatusOptions = ['ACTIVE', 'INNACTIVE', "UNLISTED"];
  const statusColors = {
    PAID: 'text-white bg-green',
    DUE: 'text-white orange',
  };
  const _MOCKDATA = [
    {
      id: 44,
      status: "PAID",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 2,
      total_price: 20,
      started_at: "2022-01-27T00:38:02Z",
      ended_at: "2022-01-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-01-12T00:39:43.621955Z"
    },
    {
      id: 22,
      status: "PAID",
      total_duration_in_minutes: 120,
      total_duration_in_hours: 2,
      total_price: 120,
      started_at: "2022-01-01T00:38:02Z",
      ended_at: "2022-01-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-01-12T00:39:43.621955Z"
    },
    {
      id: 2982,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 1,
      total_price: 10,
      started_at: "2022-02-01T00:38:02Z",
      ended_at: "2022-02-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-02-12T00:39:43.621955Z"
    },
    {
      id: 2982,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 1,
      total_price: 10,
      started_at: "2022-02-01T00:38:02Z",
      ended_at: "2022-02-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-02-12T00:39:43.621955Z"
    },
    {
      id: 32342,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 2,
      total_price: 10,
      started_at: "2022-03-01T00:38:02Z",
      ended_at: "2022-04-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-04-12T00:39:43.621955Z"
    },
    {
      id: 123134,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 2,
      total_price: 10,
      started_at: "2022-10-01T00:38:02Z",
      ended_at: "2022-10-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-10-12T00:39:43.621955Z"
    },
    {
      id: 123115,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 2,
      total_price: 10,
      started_at: "2022-03-01T00:38:02Z",
      ended_at: "2022-04-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-04-12T00:39:43.621955Z"
    },
    {
      id: 12313216,
      status: "DUE",
      total_duration_in_minutes: 60,
      total_duration_in_hours: 2,
      total_price: 10,
      started_at: "2022-07-01T00:38:02Z",
      ended_at: "2022-07-27T00:38:42Z",
      overtime_minutes: 58,
      paid_at: null,
      created_at: "2022-04-12T00:39:43.621955Z"
    }
  ];

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
      <h1>Date range picker here</h1>
      <DataTable
        data={payments || []}
        columns={columns}
        rows={rows} />
    </>
  )
}

MentorPayment.Proptypes = {}