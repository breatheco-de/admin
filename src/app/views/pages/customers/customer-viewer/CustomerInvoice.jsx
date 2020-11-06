import {
  Card,
  Fade,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import clsx from "clsx";
import { format } from "date-fns";
import React from "react";

const CustomerInvoice = () => {
  return (
    <Fade in timeout={300}>
      <Card elevation={3} className="w-full overflow-auto">
        <h5 className="p-4 mt-0 mb-2">Billing</h5>

        <Table className="min-w-1050">
          <TableHead>
            <TableRow>
              <TableCell className="pl-4" colSpan={2}>
                No.
              </TableCell>
              <TableCell colSpan={2}>Date</TableCell>
              <TableCell colSpan={3}>Description</TableCell>
              <TableCell colSpan={1}>Method</TableCell>
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell colSpan={1}>Status</TableCell>
              <TableCell colSpan={1}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceList.map((invoice, index) => (
              <TableRow key={invoice._id}>
                <TableCell
                  className="pl-4 py-2 capitalize"
                  align="left"
                  colSpan={2}
                >
                  #{invoice._id}
                </TableCell>
                <TableCell className="py-2 capitalize" align="left" colSpan={2}>
                  {format(new Date(invoice.date), "dd MMM, yyyy | hh:mm aa")}
                </TableCell>
                <TableCell className="py-2 capitalize" align="left" colSpan={3}>
                  {invoice.description}
                </TableCell>
                <TableCell className="py-2 capitalize" align="left" colSpan={1}>
                  {invoice.method}
                </TableCell>
                <TableCell className="py-2 capitalize" align="left" colSpan={1}>
                  ${invoice.total.toFixed(2)}
                </TableCell>
                <TableCell className="py-2 capitalize" colSpan={1}>
                  <small
                    className={clsx({
                      "border-radius-4  text-white px-2 py-2px": true,
                      "bg-green": invoice.status === "paid",
                      "bg-error": invoice.status === "unpaid",
                    })}
                  >
                    {invoice.status}
                  </small>
                </TableCell>
                <TableCell className="py-2" colSpan={1}>
                  <IconButton>
                    <Icon>arrow_right_alt</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Fade>
  );
};

const invoiceList = [
  {
    _id: "5ece2cef3e562cbd61996dfds",
    date: new Date(),
    description: "Bit Bass Headphone",
    method: "PayPal",
    total: 15.25,
    status: "paid",
  },
  {
    _id: "5ece2cef3efdsfsdfcbd61996",
    date: new Date(),
    description: "Comlion Watch",
    method: "Visa Card",
    total: 75.25,
    status: "unpaid",
  },
  {
    _id: "5ece2cef3e56dsfdsfds61996",
    date: new Date(),
    description: "Beats Headphone",
    method: "Master Card",
    total: 45.25,
    status: "paid",
  },
];
export default CustomerInvoice;
