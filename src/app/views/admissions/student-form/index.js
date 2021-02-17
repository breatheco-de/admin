import React, { useState, useEffect } from "react";
import { Dialog, Icon, Button, Grid, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
import { useParams } from "react-router-dom";
import StudentCohorts from "./StudentCohorts";
import StudentDetails from "./StudentDetails";
import DowndownMenu from "../../../components/DropdownMenu"
import axios from "../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import bc from "app/services/breathecode";
import dayjs from "dayjs";

const options = [
  { label: "Send password reset", value: "password_reset" },
  { label: "Open student profile", value: "student_profile" },
];

let LocalizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(LocalizedFormat)

const Student = () => {
  const { std_id } = useParams();
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [member, setMember] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getMemberById = () => {
    bc.auth().getAcademyMember(std_id)
    .then(({ data }) => setMember(data))
      .catch(error => setMsg({ alert: true, type: "error", text: error.details || "Unknown error" }))
  }
  const passwordReset = () => {
    axios.post(`${process.env.REACT_APP_API_HOST}/v1/user/password/reset`, { email: member?.user.email })
      .then(({ data }) => setMsg({ alert: true, type: "success", text: "Password reset sent"}))
      .catch(error => setMsg({ alert: true, type: "error", text: error.details || "Unknown error" }))
      setOpenDialog(false)
  }
  useEffect(() => {
    getMemberById();
  }, [])
  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        {msg.alert ? (<Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
          <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
            {msg.text}
          </Alert>
        </Snackbar>) : ""}
        {/* This Dialog opens the modal to delete the user in the cohort */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            An email to reset password will be sent to
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {member?.user.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
                    </Button>
            <Button color="primary" autoFocus onClick={() => passwordReset()}>
              Send
                    </Button>
          </DialogActions>
        </Dialog>
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">{member?.user.first_name + " " + member?.user.last_name}</h3>
          <div className="flex">
            Member since: {dayjs(member?.created_at).format('LL')}
          </div>
        </div>
        <DowndownMenu options={options} icon="more_horiz" onSelect={({ value }) => setOpenDialog(value === "password_reset" ? true : false)}>
          <Button>
            <Icon>playlist_add</Icon>
                Additional Actions
            </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <StudentDetails std_id={std_id} user={member} />
        </Grid>
        <Grid item md={8} xs={12}>
          <StudentCohorts std_id={std_id} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Student;
