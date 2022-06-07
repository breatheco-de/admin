import React, { useEffect, useState } from 'react';

import { Button, Divider, TextField, MenuItem, IconButton, } from '@material-ui/core';
import dayjs from "dayjs";
import bc from '../../../services/breathecode'
import DataTable from 'app/components/SmartMUIDataGrid';
import { getSession } from 'app/redux/actions/SessionActions';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import SingleDelete from '../../../components/ToolBar/ConfirmationDialog';
import Delete from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

export const MentorPayment = ({ mentor, staffId, bills }) => {
  const [session] = useState(getSession());
  const [payments, setPayments] = useState([]);
  const [bulk, setBulk] = useState('');
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [toDelete, setToDelete] = useState(null);
  const currentYear = dayjs().get('year');
  const [paymentRange, setPaymentRange] = useState({
    label: 'This Year',
    after: `${currentYear}-01-01`,
    before: `${currentYear + 1}-01-01`
  });
  const history = useHistory();

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

  const bulkActions = [{
    label: "Mark as Paid",
    value: `PAID`
  },
  {
    label: "Mark as Due",
    value: `DUE`
  },
  {
    label: "Mark as approved",
    value: `APPROVED`
  },
  {
    label: "Mark as ignored",
    value: `IGNORED`
  },
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
  }, [paymentRange, bills]);

  useEffect(() => {
    const onBulk = async () => {

      let bills = selectionModel.map((s)=>{
        return {id:s, status: bulk}
      });
      
      const { data } = await bc.mentorship()
      .updateMentorshipBills(bills);

      let itemsCopy = [...payments];

      data.map((bill)=>{
        const pos = payments.map((e) => { return e.id; }).indexOf(bill.id);
        itemsCopy[pos].status = bill.status;
      });

      setPayments([...itemsCopy])
      
      setBulk('');
      setSelectionModel([])
    }
    if(bulk !== '') onBulk();
  }, [bulk]);

  const deleteBill = async (bill) => {

    const pos = payments.map((e) => { return e.id; }).indexOf(bill.id);

    let itemsCopy = [...payments];

    itemsCopy.splice(pos,1);

    const res = await bc.mentorship().deleteMentorshipBill(bill.id);

    return res.status !== 400 ? setPayments([...itemsCopy]) : console.log(res);
  }

  const columns = [
    {
      field: "id",
      headerName: "Month",
      width: 90,
      valueGetter: function (params) {
        return dayjs(params.row.started_at).utc().format("MMMM")
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
      headerName: "Actions",
      description: "Open invoice to view session details.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const token = session.token.length > 0 ? `?token=${session.token}` : null;
        // let billUrl = `${process.env.REACT_APP_API_HOST}/v1/mentorship/academy/bill/${params.row.id}/html${token || ''}`
        return (     
          <div>
            <IconButton
              aria-label="Open"
              onClick={() => {
                // window.open(billUrl)
                history.push(`/mentors/${staffId}/invoice/${params.row.id}`)
              }}
            >
              <OpenInBrowser />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={() => {
                setToDelete(params.row); 
              }}
            >
              <Delete />
            </IconButton>
          </div>
        )
      }
    },
  ];
  return (
    <>
      <div className="flex justify-between">
      <TextField
          className='m-1'
          label="Bulk Action"
          style={{ width: '25%', margin: '0.5em' }}
          size="small"
          variant="outlined"
          value={bulk}
          disabled={!selectionModel.length > 0}
          onChange={(e) => { setBulk(e.target.value) }}
          select
        >
          {bulkActions.map((action) => (
            <MenuItem value={action.value} key={action.value}>
              {action.label}
            </MenuItem>
          ))}
        </TextField>
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
      </div>
      
      <Divider />
      <DataTable
        before={paymentRange.before}
        after={paymentRange.after}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        disableSelectionOnClick={true}
        rows={payments || []} />

      {toDelete && (
        <SingleDelete
          deleting={() => {
            deleteBill(toDelete);
          }}
          onClose={setToDelete}
          message="Are you sure you want to delete this Bill?"
        />
      )}
        
    </>
  )
}

MentorPayment.Proptypes = {}