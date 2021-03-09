import React  from "react";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const NotifyAlert = () => {
    return msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
      {msg.text}
    </Alert>
  </Snackbar> : ""
}

export default NotifyAlert;