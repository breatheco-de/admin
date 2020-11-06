import React from "react";
import {
  Button,
  Card,
  Divider,
  Icon,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";

const CustomerEmailSender = () => {
  return (
    <Card elevation={3}>
      <h5 className="p-4 m-0">Billing</h5>

      <Divider className="mb-4" />

      <div className="flex-column items-start px-4 mb-4">
        <TextField
          className="mb-4"
          defaultValue="Resend Last Invoice"
          variant="outlined"
          size="small"
          fullWidth
          select
        >
          {menuItemList.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <Button className="bg-gray px-4" variant="text">
          <Icon className="mr-2" fontSize="small">
            mail_outline
          </Icon>{" "}
          Send Email
        </Button>
      </div>

      <Table>
        <TableBody>
          {customerInfo.map((item, ind) => (
            <TableRow key={ind}>
              <TableCell className="pl-4">{item.title}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const menuItemList = [
  "Resend Last Invoice",
  "Send Password Reset Email",
  "Send Verification Email",
];

const customerInfo = [
  {
    title: "27/10/2020 | 12:23",
    value: "Order Received",
  },
  {
    title: "11/05/2020 | 01:19",
    value: "Order Confirmation",
  },
];

export default CustomerEmailSender;
