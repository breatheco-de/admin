import React, { useState } from "react";
import { Dialog, IconButton, Button, Icon, Grid } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { addNewEvent, updateEvent, deleteEvent } from "./CalendarService";

const EventEditorDialog = ({ event = {}, open, handleClose }) => {
  const [state, setState] = useState(event);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    let { id } = state;

    if (id) {
      updateEvent({
        ...state,
      }).then(() => {
        handleClose();
      });
    } else {
      addNewEvent({
        id: generateRandomId(),
        ...state,
      }).then(() => {
        handleClose();
      });
    }
  };

  const handleDeleteEvent = () => {
    if (state.id) {
      deleteEvent(state).then(() => {
        handleClose();
      });
    }
  };

  const handleDateChange = (date, name) => {
    setState({
      ...state,
      [name]: date,
    });
  };

  const generateRandomId = () => {
    let tempId = Math.random().toString();
    let id = tempId.substr(2, tempId.length - 1);
    return id;
  };

  let { title, start, end, location, note } = state;

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
      <div className="flex justify-between items-center pl-4 pr-2 py-2 bg-primary">
        <h4 className="m-0 text-white">Add Events</h4>
        <IconButton onClick={handleClose}>
          <Icon className="text-white">clear</Icon>
        </IconButton>
      </div>

      <div className="p-4">
        <ValidatorForm onSubmit={handleFormSubmit}>
          <TextValidator
            className="mb-6 w-full"
            label="Title"
            onChange={handleChange}
            type="text"
            name="title"
            value={title || ""}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />

          <Grid container spacing={4}>
            <Grid item sm={6} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  margin="none"
                  id="start-date"
                  label="Start date"
                  inputVariant="standard"
                  type="text"
                  autoOk={true}
                  value={start || ""}
                  fullWidth
                  onChange={(date) => handleDateChange(date, "start")}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item sm={6} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  margin="none"
                  id="end-date"
                  label="End date"
                  inputVariant="standard"
                  type="text"
                  autoOk={true}
                  value={end || ""}
                  fullWidth
                  onChange={(date) => handleDateChange(date, "end")}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <div className="py-2" />
          <TextValidator
            className="mb-6 w-full"
            label="Location"
            onChange={handleChange}
            type="text"
            name="location"
            value={location || ""}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />

          <TextValidator
            className="mb-9 w-full"
            label="Note"
            onChange={handleChange}
            type="text"
            name="note"
            value={note || ""}
            rowsMax={2}
            multiline={true}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />

          <div className="flex justify-between items-center">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button onClick={handleDeleteEvent}>
              <Icon className="mr-2 align-middle">delete</Icon>
              Delete
            </Button>
          </div>
        </ValidatorForm>
      </div>
    </Dialog>
  );
};

export default EventEditorDialog;
