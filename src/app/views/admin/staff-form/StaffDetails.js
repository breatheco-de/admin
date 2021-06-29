import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from '@material-ui/core';
import { Formik } from 'formik';
import bc from 'app/services/breathecode';

const StaffDetails = ({ user, staff_id }) => {
  const initialValues = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    address: user?.address === null ? '' : user?.address,
    phone: user?.phone === null ? '' : user?.phone,
  };
  const customerInfo = [
    {
      title: 'First Name',
      name: 'first_name',
      value: initialValues.first_name,
    },
    {
      title: 'Last Name',
      name: 'last_name',
      value: initialValues.last_name,
    },
    {
      title: 'Phone number',
      name: 'phone',
      value: initialValues.phone,
    },
    {
      title: 'Address',
      name: 'address',
      value: initialValues.address,
    },
  ];
  const [roleDialog, setRoleDialog] = useState(false);
  const [roles, setRoles] = useState(null);
  const [role, setRole] = useState('');
  const updateMemberProfile = (values) => {
    bc.auth()
      .updateAcademyMember(staff_id, { ...values, role: user.role.slug })
      .then((data) => data)
      .catch((error) => console.log(error));
  };
  const updateRole = (role) => {
    bc.auth()
      .updateAcademyMember(staff_id, { role })
      .then(({ data, status }) => {
        if (status >= 200 && status < 300) {
          setRole(roles.find((role) => role.slug === data.role).name);
        } else {
          throw Error('Could not update Role');
        }
      })
      .catch((error) => error);
  };
  useEffect(() => {
    bc.auth()
      .getRoles()
      .then(({ data }) => setRoles(data))
      .catch((error) => error);
  }, []);
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src="" />
        <h5 className="mt-4 mb-2">
          {`${user?.first_name} ${user?.last_name}`}
        </h5>
        <div
          className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3"
          onClick={() => setRoleDialog(true)}
          style={{ cursor: 'pointer' }}
        >
          {role.length ? role.toUpperCase() : user?.role.name.toUpperCase()}
        </div>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => updateMemberProfile(values)}
        enableReinitialize
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
                    {user?.user.github?.username == undefined
                    || !user?.user.github?.username ? (
                      <small className="px-1 py-2px bg-light-error text-red border-radius-4">
                        GITHUB UNVERIFIED
                      </small>
                      ) : (
                        <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                          GITHUB VERIFIED
                        </small>
                      )}
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
                Update Member Details
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={roleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Member Role</DialogTitle>
        <List>
          {roles?.map((role, i) => (
            <ListItem
              button
              onClick={() => {
                updateRole(role.slug);
                setRoleDialog(false);
              }}
              key={i}
            >
              <ListItemText primary={role.name.toUpperCase()} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

export default StaffDetails;
