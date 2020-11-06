import React, { useState, useEffect } from "react";
import {
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  Divider,
  RadioGroup,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { getInvoiceById, addInvoice, updateInvoice } from "./InvoiceService";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useCallback } from "react";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  invoiceEditor: {
    "& h5": {
      fontSize: 15,
    },
  },
}));

const InvoiceEditor = ({ isNewInvoice, toggleInvoiceEditor }) => {
  const [isAlive, setIsAlive] = useState(true);
  const [state, setState] = useState(initialValues);

  const history = useHistory();
  const { id } = useParams();
  const classes = useStyles();

  const generateRandomId = useCallback(() => {
    let tempId = Math.random().toString();
    let id = tempId.substr(2, tempId.length - 1);
    setState((state) => ({ ...state, id }));
  }, []);

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSellerBuyerChange = (event, fieldName) => {
    event.persist();
    setState({
      ...state,
      [fieldName]: {
        ...state[fieldName],
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleIvoiceListChange = (event, index) => {
    let tempItemList = [...state.item];
    tempItemList.map((element, i) => {
      if (index === i) element[event.target.name] = event.target.value;
      return element;
    });

    setState({
      ...state,
      item: tempItemList,
    });
  };

  const addItemToInvoiceList = () => {
    let tempItemList = [...state.item];
    tempItemList.push({
      name: "",
      unit: "",
      price: "",
    });
    setState({
      ...state,
      item: tempItemList,
    });
  };

  const deleteItemFromInvoiceList = (index) => {
    let tempItemList = [...state.item];
    tempItemList.splice(index, 1);

    setState({
      ...state,
      item: tempItemList,
    });
  };

  const handleDateChange = (date) => {
    setState({ ...state, date });
  };

  const handleSubmit = () => {
    setState({ ...state, loading: true });
    let tempState = { ...state };
    delete tempState.loading;
    if (isNewInvoice)
      addInvoice(tempState).then(() => {
        setState({ ...state, loading: false });
        history.push(`/invoice/${state.id}`);
        toggleInvoiceEditor();
      });
    else
      updateInvoice(tempState).then(() => {
        setState({ ...state, loading: false });
        toggleInvoiceEditor();
      });
  };

  useEffect(() => {
    if (!isNewInvoice) {
      getInvoiceById(id).then(({ data }) => {
        if (isAlive) setState({ ...data });
      });
    } else {
      generateRandomId();
    }
  }, [id, isNewInvoice, isAlive, generateRandomId]);

  useEffect(() => {
    return () => setIsAlive(false);
  }, []);

  let subTotalCost = 0;
  let {
    orderNo,
    buyer,
    seller,
    item: invoiceItemList = [],
    status,
    vat,
    date,
    currency,
    loading,
  } = state;

  return (
    <div className={clsx("invoice-viewer py-4", classes.invoiceEditor)}>
      <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
        <div className="viewer_actions px-4 flex justify-end">
          <div className="mb-6">
            <Button
              type="button"
              className="mr-4 py-2"
              variant="text"
              onClick={() => toggleInvoiceEditor()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="py-2"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="viewer__order-info px-4 mb-4 flex justify-between">
          <div>
            <h5 className="mb-2">Order Info</h5>
            <p className="mb-4">Order Number</p>
            <TextValidator
              label="Order No."
              type="text"
              fullWidth
              name="orderNo"
              value={orderNo}
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
          </div>
          <div>
            <FormControl component="fieldset" className="w-full mb-4">
              <RadioGroup
                aria-label="status"
                name="status"
                value={status}
                onChange={handleChange}
              >
                <FormControlLabel
                  className="h-32"
                  value="pending"
                  control={<Radio color="secondary" />}
                  label="Pending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  className="h-32"
                  value="processing"
                  control={<Radio color="secondary" />}
                  label="Processing"
                  labelPlacement="start"
                />
                <FormControlLabel
                  className="h-32"
                  value="delivered"
                  control={<Radio color="secondary" />}
                  label="Delivered"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>

            <div className="text-right">
              <h5 className="font-normal">
                <strong>Order date: </strong>
              </h5>
            </div>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="none"
                id="mui-pickers-date"
                label="Order Date"
                inputVariant="standard"
                type="text"
                autoOk={true}
                value={date}
                fullWidth
                format="MMMM dd, yyyy"
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>

        <Divider />

        <Grid
          className="px-4 py-5"
          container
          justify="space-between"
          spacing={4}
        >
          <Grid item>
            <div>
              <h5 className="mb-5 ">Bill From</h5>
              <TextValidator
                className="mb-5"
                label="Seller Name"
                onChange={(event) => handleSellerBuyerChange(event, "seller")}
                type="text"
                name="name"
                fullWidth
                value={seller ? seller.name : null}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                label="Seller Name"
                type="text"
                onChange={(event) => handleSellerBuyerChange(event, "seller")}
                name="address"
                fullWidth
                multiline={true}
                rowsMax={4}
                value={seller ? seller.address : null}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </div>
          </Grid>
          <Grid item>
            <div className="text-right">
              <h5 className="mb-5">Bill To</h5>
              <TextValidator
                className="mb-5"
                label="Buyer Name"
                onChange={(event) => handleSellerBuyerChange(event, "buyer")}
                type="text"
                name="name"
                fullWidth
                value={buyer ? buyer.name : null}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                label="Buyer Address"
                onChange={(event) => handleSellerBuyerChange(event, "buyer")}
                type="text"
                name="address"
                fullWidth
                multiline={true}
                rowsMax={4}
                value={buyer ? buyer.address : null}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </div>
          </Grid>
        </Grid>

        {/* Item list for editing */}
        <Table className="mb-4">
          <TableHead>
            <TableRow className="bg-default">
              <TableCell className="pl-sm-24">#</TableCell>
              <TableCell className="px-0">Item Name</TableCell>
              <TableCell className="px-0">Unit Price</TableCell>
              <TableCell className="px-0">Unit</TableCell>
              <TableCell className="px-0">Cost</TableCell>
              <TableCell className="px-0">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoiceItemList.map((item, index) => {
              subTotalCost += item.price * item.unit;
              return (
                <TableRow key={index}>
                  <TableCell className="pl-sm-24 capitalize" align="left">
                    {index + 1}
                  </TableCell>

                  <TableCell className="pl-0 capitalize" align="left">
                    <TextValidator
                      label="Item Name"
                      onChange={(event) => handleIvoiceListChange(event, index)}
                      type="text"
                      name="name"
                      fullWidth
                      value={item ? item.name : null}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </TableCell>

                  <TableCell className="pl-0 capitalize" align="left">
                    <TextValidator
                      label="Item Price"
                      onChange={(event) => handleIvoiceListChange(event, index)}
                      type="number"
                      name="price"
                      fullWidth
                      value={item ? item.price : null}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </TableCell>

                  <TableCell className="pl-0 capitalize" align="left">
                    <TextValidator
                      label="Item Unit"
                      onChange={(event) => handleIvoiceListChange(event, index)}
                      type="number"
                      name="unit"
                      fullWidth
                      value={item ? item.unit : null}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </TableCell>

                  <TableCell className="pl-0 capitalize" align="left">
                    {item.unit * item.price}
                  </TableCell>

                  <TableCell className="pl-0 capitalize" align="left">
                    <Button onClick={() => deleteItemFromInvoiceList(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end px-4 mb-4">
          <Button onClick={addItemToInvoiceList}>Add Item</Button>
        </div>

        {/* total cost calculation */}
        <div className="px-4 flex justify-end">
          <div className="flex">
            <div className="pr-12">
              <p className="mb-8">Sub Total:</p>
              <p className="mb-12">Vat(%):</p>
              <p className="mb-5">currency:</p>
              <strong>
                <p>Grand Total:</p>
              </strong>
            </div>
            <div>
              <p className="mb-4">{subTotalCost}</p>
              <TextValidator
                className="mb-4"
                label="Vat"
                onChange={handleChange}
                type="number"
                name="vat"
                value={vat}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <br />
              <TextValidator
                label="Currency"
                onChange={handleChange}
                type="text"
                name="currency"
                value={currency}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <p className="mt-4">
                <strong>
                  {currency}
                  {subTotalCost + (subTotalCost * vat) / 100}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </ValidatorForm>
    </div>
  );
};

const initialValues = {
  id: "",
  orderNo: "",
  buyer: {
    name: "",
    address: "",
  },
  seller: {
    name: "",
    address: "",
  },
  item: [],
  status: "",
  vat: "",
  date: new Date(),
  currency: "",
  loading: false,
};

export default InvoiceEditor;
