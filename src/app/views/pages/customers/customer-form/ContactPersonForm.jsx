import React, { Fragment } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Icon
} from "@material-ui/core";
import { FieldArray } from "formik";

const ContactPersonForm = ({ values, handleChange }) => {
  return (
    <FieldArray name="contacts">
      {arrayHelpers => (
        <Fragment>
          <Table className="whitespace-pre min-w-750">
            <TableHead>
              <TableRow>
                <TableCell colSpan={4}>Salutation</TableCell>
                <TableCell colSpan={4}>First Name</TableCell>
                <TableCell colSpan={4}>Last Name</TableCell>
                <TableCell colSpan={4}>Email Address</TableCell>
                <TableCell colSpan={4}>Work Phone</TableCell>
                <TableCell colSpan={4}>Mobile</TableCell>
                <TableCell colSpan={4}>Designation</TableCell>
                <TableCell colSpan={4}>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.contacts?.map((item, ind) => (
                <TableRow className="position-relative" key={ind}>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Salutation"
                      name={`contacts[${ind}].salutation`}
                      size="small"
                      variant="outlined"
                      select
                      defaultValue={item.salutation || ""}
                      onBlur={handleChange}
                      fullWidth
                    >
                      {salutationList.map((item, ind) => (
                        <MenuItem defaultValue={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="First Name"
                      name={`contacts[${ind}].firstName`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.firstName || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Last Name"
                      name={`contacts[${ind}].lastName`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.lastName || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Email"
                      name={`contacts[${ind}].email`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.email || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Work Phone"
                      name={`contacts[${ind}].phone`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.phone || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Mobile"
                      name={`contacts[${ind}].mobile`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.mobile || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Designation"
                      name={`contacts[${ind}].designation`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.designation || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className="p-0" align="left">
                    <TextField
                      label="Department"
                      name={`contacts[${ind}].department`}
                      size="small"
                      variant="outlined"
                      fullWidth
                      defaultValue={item.department || ""}
                      onBlur={handleChange}
                    />
                  </TableCell>
                  <TableCell colSpan={1} className="p-0" align="center">
                    <IconButton
                      size="small"
                      onClick={() => arrayHelpers.remove(ind)}
                    >
                      <Icon color="error" fontSize="small">
                        clear
                      </Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            className="mt-4"
            color="primary"
            variant="contained"
            onClick={() => arrayHelpers.push({})}
          >
            + Add New Contact
          </Button>
        </Fragment>
      )}
    </FieldArray>
  );
};

const salutationList = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."];

export default ContactPersonForm;
