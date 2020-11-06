import {
  Card,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import clsx from "clsx";
import { format } from "date-fns";
import React from "react";

const CustomerLogs = () => {
  return (
    <Fade in timeout={300}>
      <Card elevation={3} className="w-full overflow-auto">
        <h5 className="p-4 mt-0 mb-2">Customer Activity Log</h5>

        <Table className="min-w-1050">
          <TableBody>
            {logList.map((eventLog, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4 capitalize" align="left" colSpan={1}>
                  <b>{eventLog.type}</b>
                </TableCell>
                <TableCell className="capitalize" colSpan={1}>
                  <small
                    className={clsx({
                      "border-radius-4 text-white px-2 py-1px": true,
                      "bg-green": eventLog.status.toString().includes(2),
                      "bg-error": eventLog.status.toString().includes(4),
                    })}
                  >
                    {eventLog.status}
                  </small>
                </TableCell>

                <TableCell align="left" colSpan={3}>
                  {eventLog.description}
                </TableCell>

                <TableCell className="capitalize" align="left" colSpan={1}>
                  {eventLog.ip}
                </TableCell>

                <TableCell className="capitalize" align="left" colSpan={1}>
                  {format(new Date(eventLog.date), "dd MMM, yyyy | hh:mm aa")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Fade>
  );
};

const logList = [
  {
    type: "POST",
    date: new Date(),
    description: "/api/shop",
    method: "PayPal",
    ip: "110.145.15.25",
    status: 200,
  },
  {
    type: "POST",
    date: new Date(),
    description: "/api/customer",
    method: "Visa Card",
    ip: "110.145.75.25",
    status: 401,
  },
  {
    type: "GET",
    date: new Date(),
    description: "/api/get-customer-details",
    method: "Master Card",
    ip: "110.145.45.25",
    status: 200,
  },
  {
    type: "DELETE",
    date: new Date(),
    description: "/api/delete-customer",
    method: "Master Card",
    ip: "110.145.45.25",
    status: 200,
  },
];
export default CustomerLogs;
