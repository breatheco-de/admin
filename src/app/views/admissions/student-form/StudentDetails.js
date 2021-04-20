import React,{useState, useEffect} from "react";
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
import bc from "app/services/breathecode";

const StudentDetails = ({ user, std_id }) => {
  const initialValues = {
    "first_name": user?.first_name,
    "last_name": user?.last_name,
    "address": user?.address,
    "phone": user?.phone
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
  const [crt_user, setCrtUser] = useState({});
  useEffect(() =>{
   user ?  setCrtUser(user) : setCrtUser({});
  }, [user])
  const updateStudentProfile = (values) => {
    console.log(values);
    console.log(std_id)
    bc.auth().updateAcademyStudent(std_id, values)
        .then(({data}) => {
          setCrtUser({...crt_user, ...data });
          console.log(crt_user);
      })
        .catch(error => error)
}
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src={user?.user?.github?.avatar_url || ''}/>
        <h5 className="mt-4 mb-2">{crt_user?.first_name + " " + crt_user?.last_name}</h5>
        <small className="text-muted">{user?.role.name.toUpperCase()}</small>
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
                    <div>{user?.user.email}</div>
                    <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                      EMAIL VERIFIED
                    </small>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Github</TableCell>
                  <TableCell>
                    <div>{user?.user.github?.username}</div>
                    {user?.user.github == undefined ?
                      <small className="px-1 py-2px bg-light-error text-red border-radius-4">
                      GITHUB UNVERIFIED
                    </small>: 
                      <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                      GITHUB VERIFIED
                    </small>
                    }
                  </TableCell>
                </TableRow>
                {customerInfo.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell className="pl-4">{item.title}</TableCell>
                    <TableCell>
                      <TextField
                        placeholder={item.title}
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
    </Card>
  );
};




export default StudentDetails;