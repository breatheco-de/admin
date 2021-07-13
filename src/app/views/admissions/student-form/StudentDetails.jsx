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
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';

const propTypes = {
  user: PropTypes.string.isRequired,
  stdId: PropTypes.number.isRequired,
  openRoleDialog: PropTypes.number.isRequired,
  setOpenRoleDialog: PropTypes.number.isRequired,
};

const StudentDetails = ({
  user, stdId, openRoleDialog, setOpenRoleDialog,
}) => {
  const initialValues = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    address: user?.address,
    phone: user?.phone,
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
  const [crtUser, setCrtUser] = useState({});
  const [roles, setRoles] = useState(null);
  const [roleDialog, setRoleDialog] = useState(false);
  const [role, setRole] = useState('');

  const updateRole = (currentRole) => {
    bc.auth()
      .updateAcademyMember(stdId, { currentRole })
      .then(({ data, status }) => {
        if (status >= 200 && status < 300) {
          setRole(roles.find((newRole) => newRole.slug === data.role).name);
        } else {
          throw Error('Could not update Role');
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    bc.auth()
      .getRoles()
      .then((data) => {
        if (data.status >= 200 && data.status < 300) {
          setRoles(data.data);
        }
        throw Error('Items could not be retrieved');
      })
      .catch((error) => error);
  }, []);

  useEffect(() => {
    if (user) {
      setCrtUser(user);
    } else setCrtUser({});
  }, [user]);

  const updateStudentProfile = (values) => {
    bc.auth()
      .updateAcademyStudent(stdId, values)
      .then(({ data }) => {
        setCrtUser({ ...crtUser, ...data });
      })
      .catch((error) => error);
  };
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src={user?.user?.github?.avatar_url || ''} />
        <h5 className="mt-4 mb-2">{`${crtUser?.first_name} ${crtUser?.last_name}`}</h5>
        <button
          type="button"
          className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3"
          onClick={() => setRoleDialog(true)}
          style={{ cursor: 'pointer' }}
        >
          {role.length ? role.toUpperCase() : user?.role.name.toUpperCase()}
        </button>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => updateStudentProfile(values)}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit }) => (
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
                    {user?.user.github === undefined ? (
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
                {customerInfo.map((item) => (
                  <TableRow key={item}>
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
      <Dialog
        onClose={() => {
          setRoleDialog(false);
          setOpenRoleDialog(false);
        }}
        open={roleDialog || openRoleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Member Role</DialogTitle>
        <List>
          {roles?.map((presentRole) => (
            <ListItem
              button
              onClick={() => {
                updateRole(presentRole.slug);
                setRoleDialog(false);
                setOpenRoleDialog(false);
              }}
              key={presentRole}
            >
              <ListItemText primary={role.name.toUpperCase()} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
