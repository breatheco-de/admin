import {
  Avatar, Button, Icon,
  IconButton, Tooltip, TableCell,
} from '@material-ui/core';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'bg-secondary text-dark',
  ACTIVE: 'text-white bg-green',
  INNACTIVE: 'text-white bg-error',
};


const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const round = (num) => Math.round(num);

const Bills = () => {
  const [billList, setBillList] = useState([]);

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "50px" }}>
              {column.label}
            </TableCell>
          )
        },
      }
    },
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const freelancer = billList[dataIndex].freelancer;
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={freelancer.user?.profile?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{name(freelancer.user)}</h5>
                <small className="text-muted">{freelancer.project}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "120px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = billList[dataIndex];
          return (
            <div className="">
                <p>{item.status.toUpperCase()}</p>
                {item.status == "PAID" && item.paid_at &&
                  <small>
                    {dayjs(item.paid_at).fromNow()}
                  </small>}
            </div>
          );
        },
      },
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "120px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = billList[dataIndex];
          return (
            <div className="">
                <p className="m-0">${round(item.total_price)}</p>
                <small>{round(item.total_duration_in_hours)}hrs</small>
            </div>
          );
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }}>
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const item = billList[dataIndex];
          //! TODO REVERT THIS BEFORE PUSHING
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/payment/${item.id}`}>
                <Tooltip title="View">
                  <IconButton>
                    <Icon>arrow_right_alt</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Freelance', path: "#" }, { name: 'Payments', path: '/freelance/payments' }]} />
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="Freelancer Payments"
          columns={columns}
          selectableRows={true}
          items={billList}
          view="?"
          singlePage=""
          historyReplace="/freelance/bills"
          search={async (querys) => {
            const { data } = await bc.freelance().getAllBills(querys);
            setBillList(data.results || data);
            return data;
          }}
          deleting={async (querys) => {
            // const { status } = await bc
            //   .admissions()
            //   .deleteStaffBulk(querys);
            // return status;
          }}
        />
      </div>
    </div>
  );
};

export default Bills;
