import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Card,
} from "@material-ui/core";
import { getAllInvoice, deleteInvoice } from "./InvoiceService";
import { Link, useHistory } from "react-router-dom";
import { ConfirmationDialog } from "matx";
import clsx from "clsx";

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAlive, setIsAlive] = useState(true);

  const history = useHistory();

  useEffect(() => {
    getAllInvoice().then((res) => {
      if (isAlive) setInvoiceList(res.data);
    });

    return () => setIsAlive(false);
  }, [isAlive]);

  const handeViewClick = (invoiceId) => {
    history.push(`/invoice/${invoiceId}`);
  };

  const handeDeleteClick = (invoice) => {
    setInvoice(invoice);
    setOpen(true);
  };

  const handleConfirmationResponse = () => {
    deleteInvoice(invoice).then((res) => {
      if (isAlive) {
        setInvoiceList(res.data);
        setOpen(false);
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div className="m-sm-30">
      <Link to="/invoice/add">
        <Button className="mb-4" variant="contained" color="primary">
          Add Invoice
        </Button>
      </Link>
      <Card elevation={6} className="w-full overflow-auto">
        <Table className="min-w-750">
          <TableHead>
            <TableRow>
              <TableCell className="pl-sm-24">Order No.</TableCell>
              <TableCell className="px-0">Bill From</TableCell>
              <TableCell className="px-0">Bill To</TableCell>
              <TableCell className="px-0">Status</TableCell>
              <TableCell className="px-0">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceList.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell className="pl-sm-24 capitalize" align="left">
                  {invoice.orderNo}
                </TableCell>
                <TableCell className="pl-0 capitalize" align="left">
                  {invoice.seller.name}
                </TableCell>
                <TableCell className="pl-0 capitalize" align="left">
                  {invoice.buyer.name}
                </TableCell>
                <TableCell className="pl-0 capitalize">
                  <small
                    className={clsx({
                      "border-radius-4  text-white px-2 py-2px": true,
                      "bg-primary": invoice.status === "delivered",
                      "bg-secondary": invoice.status === "processing",
                      "bg-error": invoice.status === "pending",
                    })}
                  >
                    {invoice.status}
                  </small>
                </TableCell>
                <TableCell className="pl-0">
                  <Button
                    color="primary"
                    className="mr-2"
                    onClick={() => handeViewClick(invoice.id)}
                  >
                    Open
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handeDeleteClick(invoice)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <ConfirmationDialog
        open={open}
        onConfirmDialogClose={handleDialogClose}
        onYesClick={handleConfirmationResponse}
        text="Are you sure to delete?"
      />
    </div>
  );
};

export default InvoiceList;
