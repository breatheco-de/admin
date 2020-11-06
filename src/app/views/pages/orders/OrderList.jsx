import React from "react";
import { Grow, Icon, IconButton, TextField, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";

const OrderList = () => {
  const columns = [
    {
      name: "_id",
      label: "Order No.",
      options: {
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{orderList[dataIndex]._id}</span>
        ),
      },
    },
    {
      name: "customerName",
      label: "Customer",
      options: {
        filter: true,
      },
    },
    {
      name: "productName",
      label: "Product",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{orderList[dataIndex].productName}</span>
        ),
      },
    },
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {format(orderList[dataIndex].date, "dd MMM, yyyy")}
          </span>
        ),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let status = orderList[dataIndex].status;

          switch (status) {
            case "delivered":
              return (
                <small className="capitalize text-white bg-green border-radius-4 px-2 py-2px">
                  {status}
                </small>
              );
            case "processing":
              return (
                <small className="capitalize bg-secondary border-radius-4 px-2 py-2px">
                  {status}
                </small>
              );
            case "cancelled":
              return (
                <small className="capitalize text-white bg-error border-radius-4 px-2 py-2px">
                  {status}
                </small>
              );

            default:
              break;
          }
        },
      },
    },
    {
      name: "method",
      label: "Method",
      options: {
        filter: true,
      },
    },
    {
      name: "total",
      label: "Total",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span>${orderList[dataIndex].total.toFixed(2)}</span>
        ),
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow"></div>
            <Tooltip title="Mark as Delivered">
              <IconButton>
                <Icon className="text-green" fontSize="small">
                  done
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Order">
              <IconButton>
                <Icon color="error" fontSize="small">
                  clear
                </Icon>
              </IconButton>
            </Tooltip>
            <Link to={`/invoice/${orderList[dataIndex]._id}`}>
              <Tooltip title="View Order">
                <IconButton>
                  <Icon fontSize="small">arrow_right_alt</Icon>
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "Order List" },
          ]}
        />
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <MUIDataTable
            title={"All Orders"}
            data={orderList}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              elevation: 0,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              onRowsDelete: (data) => console.log(data),
              customSearchRender: (
                searchText,
                handleSearch,
                hideSearch,
                options
              ) => {
                return (
                  <Grow appear in={true} timeout={300}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={({ target: { value } }) => handleSearch(value)}
                      InputProps={{
                        style: {
                          paddingRight: 0,
                        },
                        startAdornment: (
                          <Icon className="mr-2" fontSize="small">
                            search
                          </Icon>
                        ),
                        endAdornment: (
                          <IconButton onClick={hideSearch}>
                            <Icon fontSize="small">clear</Icon>
                          </IconButton>
                        ),
                      }}
                    />
                  </Grow>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const orderList = [
  {
    _id: "lkfjdfjdsjdslgkfjdskjfds",
    date: new Date(),
    customerName: "Ben Schieldman",
    productName: "Bit Bass Headphone",
    method: "PayPal",
    total: 15.25,
    status: "delivered",
  },
  {
    _id: "fkjjirewoigkjdhvkcxyhuig",
    date: new Date(),
    customerName: "Joyce Watson",
    productName: "Comlion Watch",
    method: "Visa Card",
    total: 75.25,
    status: "cancelled",
  },
  {
    _id: "fdskjkljicuviosduisjd",
    date: new Date(),
    customerName: "Kayle Brown",
    productName: "Beats Headphone",
    method: "Master Card",
    total: 45.25,
    status: "processing",
  },
  {
    _id: "fdskfjdsuoiucrwevbgd",
    date: new Date(),
    customerName: "Ven Helsing",
    productName: "BMW Bumper",
    method: "Master Card",
    total: 2145.25,
    status: "delivered",
  },
];
export default OrderList;
