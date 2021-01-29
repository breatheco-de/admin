import React from 'react';
import { Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

export default function ResponseDialog({ openDialog, setOpenDialog, responseData, isLoading }) {

  const handleClose = () => {
    setOpenDialog(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (openDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialog]);

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Results</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            children={<ResponseContent responseData={responseData} isLoading={isLoading} />}
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ResponseContent = ({ responseData, isLoading }) => {

    const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

    const classes = useStyles();


  const getMuiThemeError = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FF0000"
        }
      }
    }
  })

  const getMuiThemeSuccess = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#32CD32"
        }
      }
    }
  })

  const { data } = responseData

  const successData = data.success.map((item) => {
    return {
      student: `${item.user.first_name} ${item.user.last_name}`,
      status: "success",
      message: "certificate created"
    }
  })
  const errorData = data.error.map((item) => {
    return {
      student: `${item.first_name} ${item.last_name}`,
      status: "failure",
      message: item.msg
    }
  })

  console.log("errorData:", errorData)

  const columnsSuccess = [
    {
      name: "student",
      label: "student",

    },
    {
      name: "status",
      label: "status",

    },
    {
      name: "message",
      label: "message",

    },
  ]
  const columnsError = [
    {
      name: "student",
      label: "student",

    },
    {
      name: "status",
      label: "status",

    },
    {
      name: "message",
      label: "message",

    },
  ]

  return (
    <>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Student</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {errorData.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell >{row.student}</TableCell>
              <TableCell >{row.status}</TableCell>
              <TableCell >{row.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* <MuiThemeProvider theme={getMuiThemeSuccess()}>
        <MUIDataTable
          title={"Certificates Created"}
          data={successData}
          columns={columnsSuccess}
        />
      </MuiThemeProvider> */}
      {/* <MuiThemeProvider theme={getMuiThemeError()}>
        <MUIDataTable
          title={"Pending Certificates"}
          data={errorData}
          columns={columnsError}
        />
      </MuiThemeProvider> */}
    </>
  )
}

