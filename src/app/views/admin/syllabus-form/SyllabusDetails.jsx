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
//    first_name: user?.first_name,
  };

  const [roleDialog, setRoleDialog] = useState(false);
  // const [role, setRole] = useState('');

  return (
    <Card className="pt-6" elevation={3}>
      <Formik>
        {({ values, handleChange, handleSubmit }) => (
          <form className="p-4" onSubmit={handleSubmit}>
            <Table className="mb-4">
              <TableBody>
                <TableRow>
                  <TableCell className="pl-4">Slug</TableCell>
                  <TableCell>
                    <div>full-stack</div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Name</TableCell>
                  <TableCell>
                    <div>IMF Prework</div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Total hours</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      variant="outlined"
                      defaultValue=""
                      required
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Weekly hours</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      variant="outlined"
                      defaultValue=""
                      required
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Total Days</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      variant="outlined"
                      defaultValue=""
                      required
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Owner</TableCell>
                  <TableCell>
                    4Geeks Academy Miami
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Github URL</TableCell>
                  <TableCell>
                    <TextField
                      placeholder={"https://github.com/repo"}
                      size="small"
                      variant="outlined"
                      defaultValue=""
                      required
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex-column items-start px-4 mb-4">
              <Button color="primary" variant="contained" type="submit">
                Save Syllabus Details
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
        <DialogTitle id="simple-dialog-title">Change Syllabus Visibility</DialogTitle>
        <List>
          {['Private', 'Public']?.map((slug) => (
            <ListItem
              button
              onClick={() => {
                updateRole(slug);
                setRoleDialog(false);
                setOpenRoleDialog(false);
              }}
              key={slug}
            >
              <ListItemText primary={slug} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
