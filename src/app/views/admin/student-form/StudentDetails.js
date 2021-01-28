import React,{useState} from "react";
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
import { Formik } from "formik";
import axios from "../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const StudentDetails = ({ name, std_id }) => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const updateStudentProfile = (values) => {
    console.log(values)
    axios.put(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/student/${std_id}`, { ...values })
        .then(data => {
          console.log(data)
          setMsg({ alert: true, type: "success", text: "User profile updated successfully"})
      })
        .catch(error => {
            console.log(error)
            setMsg({ alert: true, type: "error", text: error.detail || `${error.first_name[0]}: First Name` || error.email[0] || error.phone[0]})
        })
}
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src="/assets/images/faces/10.jpg" />
        <h5 className="mt-4 mb-2">{name}</h5>
        <small className="text-muted">Student</small>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => updateStudentProfile(values)}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setSubmitting,
          setFieldValue,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>
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
                    <TableCell>
                      <TextField
                        label={item.title}
                        name={item.name}
                        size="small"
                        variant="outlined"
                        defaultValue=""
                        required
                        value={values[item.name]}
                        onChange={handleChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex-column items-start px-4 mb-4">
              <Button color="primary" variant="contained" type="submit">
                Save Student Details
                  </Button>
            </div>
          </form>
        )}
      </Formik>
      {msg.alert ? (<Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                        {msg.text}
                    </Alert>
                </Snackbar> ): ""}
    </Card>
  );
};

const initialValues = {
  "first_name": "",
  "last_name": "",
  "address": "",
  "phone": ""
}
const customerInfo = [
  {
    title: "First Name",
    name: "first_name",
    value: initialValues.first_name,
  },
  {
    title: "Last Name",
    name: "last_name",
    value: initialValues.last_name,
  },
  {
    title: "Phone number",
    name: "phone",
    value: initialValues.phone,
  },
  {
    title: "Address",
    name: "address",
    value: initialValues.address,
  },
];

export default StudentDetails;