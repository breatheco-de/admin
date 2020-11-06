import React, { useState } from "react";
import { Dialog, Button, IconButton, Icon, Fab } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { RichTextEditor } from "matx";

const InboxComposeDialog = ({ open, handleClose }) => {
  const [state, setState] = useState({
    to: "",
    subject: "",
    content: "",
    attachment: null,
  });

  const handleSubmit = (event) => {
    // console.log(state);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleContentChange = (contentHtml) => {
    setState({
      ...state,
      content: contentHtml,
    });
  };

  const handleAttachmentSelection = (event) => {
    setState({
      ...state,
      attachment: event.target.files[0],
    });
  };

  let { to, subject, content, attachment } = state;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
      {/* <RichTextEditor placeholder="insert text here..." /> */}
      <div className="p-6">
        <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
          <TextValidator
            className="mb-4 w-full"
            label="To"
            onChange={handleChange}
            type="email"
            name="to"
            value={to}
            validators={["required", "isEmail"]}
            errorMessages={["this field is required", "email is not valid"]}
          />
          <TextValidator
            className="mb-4 w-full"
            label="Subject"
            onChange={handleChange}
            type="text"
            name="subject"
            value={subject}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
          <RichTextEditor
            content={content}
            handleContentChange={handleContentChange}
            placeholder="insert text here..."
          />
          <div className="mt-4 flex flex-wrap justify-between">
            <Button onClick={handleClose}>Cancel</Button>

            <div className="flex items-center">
              {attachment && <p className="mr-6">{attachment.name}</p>}
              <label htmlFor="attachment">
                <IconButton className="mr-2" component="span">
                  <Icon>attachment</Icon>
                </IconButton>
              </label>
              <input
                onChange={handleAttachmentSelection}
                className="hidden"
                id="attachment"
                type="file"
              />
              <Fab size="medium" color="secondary" type="submit">
                <Icon>send</Icon>
              </Fab>
            </div>
          </div>
        </ValidatorForm>
      </div>
    </Dialog>
  );
};

export default InboxComposeDialog;
