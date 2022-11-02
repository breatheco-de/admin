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
import config from '../../../../config.js';
import Alert from '../../../components/Alert'
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

export const ProjectInvoices = ({ project, invoices }) => {
  
  const [selectionModel, setSelectionModel] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const history = useHistory();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 40,
      valueGetter: function (params) {
        return params.row.id
      },
    },
    {
      field: "total_price",
      headerName: "Amount",
      width: 130,
      valueGetter: function (params) {
        return `$${Math.round(params.row.total_price * 100) / 100}`
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
        return (     
          <div>
            <IconButton
              aria-label="Open"
              onClick={() => {
                // window.open(billUrl)
                history.push(`/invoice/${params.row.id}`)
              }}
            >
              <OpenInBrowser />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={() => setConfirmDelete(params.row)}
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
      {invoices.find((el) => el.status === 'RECALCULATE') && (
        <div className="mb-5">
          <Alert severity="error">
            Some bills need to be recalculated, please generate the bills again
          </Alert>
        </div>
      )}
      <div className="flex justify-between">
        {/* <TextField
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
        </TextField> */}
      </div>
      
      <DataTable
        // before={paymentRange.before}
        // after={paymentRange.after}
        columns={columns}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        disableSelectionOnClick={true}
        rows={invoices || []} />
    </>
  )
}

ProjectInvoices.Proptypes = {}
export default ProjectInvoices;