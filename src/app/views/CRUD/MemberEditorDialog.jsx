import React, { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getUserById, updateUser, addNewUser } from "./TableService";
import { generateRandomId } from "utils";

const MemberEditorDialog = ({ uid, open, handleClose }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    balance: "",
    age: "",
    company: "",
    address: "",
    isActive: false,
  });

  const handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      setState({
        ...state,
        isActive: event.target.checked,
      });
      return;
    }

    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = () => {
    let { id } = state;
    if (id) {
      updateUser({
        ...state,
      }).then(() => {
        handleClose();
      });
    } else {
      addNewUser({
        id: generateRandomId(),
        ...state,
      }).then(() => {
        handleClose();
      });
    }
  };

  useEffect(() => {
    getUserById(uid).then((data) => setState({ ...data.data }));
  }, [uid]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className="p-6">
        <h4 className="mb-5">Update Member</h4>
        <ValidatorForm onSubmit={handleFormSubmit}>
          <Grid className="mb-4" container spacing={4}>
            <Grid item sm={6} xs={12}>
              <TextValidator
                className="w-full mb-4"
                label="Name"
                onChange={handleChange}
                type="text"
                name="name"
                value={state?.name}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                className="w-full mb-4"
                label="Email"
                onChange={handleChange}
                type="text"
                name="email"
                value={state?.email}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextValidator
                className="w-full mb-4"
                label="Phone"
                onChange={handleChange}
                type="text"
                name="phone"
                value={state?.phone}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextValidator
                className="w-full mb-4"
                label="Balance"
                onChange={handleChange}
                type="number"
                name="balance"
                value={state?.balance}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextValidator
                className="w-full mb-4"
                label="Age"
                onChange={handleChange}
                type="number"
                name="age"
                value={state?.age}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                className="w-full mb-4"
                label="Company"
                onChange={handleChange}
                type="text"
                name="company"
                value={state?.company}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextValidator
                className="w-full mb-4"
                label="Address"
                onChange={handleChange}
                type="text"
                name="address"
                value={state?.address}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <FormControlLabel
                className="my-5"
                control={
                  <Switch
                    checked={state?.isActive}
                    onChange={(event) => handleChange(event, "switch")}
                  />
                }
                label="Active Customer"
              />
            </Grid>
          </Grid>

          <div className="flex justify-between items-center">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </div>
        </ValidatorForm>
      </div>
    </Dialog>
  );
};

export default MemberEditorDialog;
