import React from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";

const CustomerInfo = () => {
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src="/assets/images/faces/10.jpg" />
        <h5 className="mt-4 mb-2">Ben Peterson</h5>
        <small className="text-muted">CEO, Brack Ltd.</small>
      </div>

      <Divider />
      <Table className="mb-4">
        <TableBody>
          <TableRow>
            <TableCell className="pl-4">Email</TableCell>
            <TableCell>
              <div>ui-lib@example.com</div>
              <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                EMAIL VERIFIED
              </small>
            </TableCell>
          </TableRow>
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
            lock_open
          </Icon>{" "}
          Reset & Send Password
        </Button>

        <Button className="mb-4" variant="text">
          <Icon className="mr-2" fontSize="small">
            person
          </Icon>{" "}
          Login as Customer
        </Button>
      </div>
    </Card>
  );
};

const customerInfo = [
  {
    title: "Phone",
    value: "+1 439 327 546",
  },
  {
    title: "Country",
    value: "USA",
  },
  {
    title: "State/Region",
    value: "New York",
  },
  {
    title: "Address 1",
    value: "Street Tailwood, No. 17",
  },
  {
    title: "Address 2",
    value: "House #19",
  },
];

export default CustomerInfo;
