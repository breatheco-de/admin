import React from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";

const StudentDetails = ({name}) => {
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src="/assets/images/faces/10.jpg" />
        <h5 className="mt-4 mb-2">{name}</h5>
        <small className="text-muted">Student</small>
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
          <TableRow>
            <TableCell className="pl-4">Github</TableCell>
            <TableCell>
              <div>github.com/alesanchezr</div>
              <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                GITHUB VERIFIED
              </small>
            </TableCell>
          </TableRow>
          {customerInfo.map((item, ind) => (
            <TableRow key={ind}>
              <TableCell className="pl-4">{item.title}</TableCell>
              <TableCell>                  <TextField
                    label={item.title}
                    name={item.title}
                    size="small"
                    variant="outlined"
                    defaultValue=""
                    value={item.value}
                  /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex-column items-start px-4 mb-4">
        <Button color="primary" variant="contained" type="submit">
            Save Student Details
        </Button>
      </div>
    </Card>
  );
};

const customerInfo = [
  {
    title: "First Name",
    value: "",
  },
  {
      title: "Last Name",
      value: "",
    },
    {
    title: "Phone number",
    value: "+1 439 327 546",
    },
    {
        title: "Address",
        value: "House #19",
    },
];

export default StudentDetails;