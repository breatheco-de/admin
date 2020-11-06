import React from "react";
import {
  Button,
  Card,
  Divider,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";

const CustomerBillings = () => {
  return (
    <Card elevation={3}>
      <h5 className="p-4 m-0">Billing</h5>
      <Divider />
      <Table className="mb-4">
        <TableBody>
          {customerInfo.map((item, ind) => (
            <TableRow key={ind}>
              <TableCell className="pl-4">{item.title}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex-column items-start px-4">
        <Button className="mb-1" variant="text">
          <Icon className="mr-2" fontSize="small">
            attach_money
          </Icon>
          Create Invoice
        </Button>

        <Button className="mb-4" variant="text">
          <Icon className="mr-2" fontSize="small">
            receipt
          </Icon>
          Resend Due Invoices
        </Button>
      </div>
    </Card>
  );
};

const customerInfo = [
  {
    title: "Credit Card",
    value: "**** **** **** **** 4242",
  },
  {
    title: "Paid",
    value: "5 ($500.00)",
  },
  {
    title: "Draft",
    value: "2 ($150.00)",
  },
  {
    title: "Unpaid/Due",
    value: "1 ($355.00)",
  },
  {
    title: "Refunded",
    value: "0 ($0.00)",
  },
  {
    title: "Gross Income",
    value: "$2,100.00",
  },
];

export default CustomerBillings;
