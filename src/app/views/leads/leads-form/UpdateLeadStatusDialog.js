import React, {useState} from "react";
import {
    Dialog, DialogTitle, DialogContent, FormControl, 
    TextField, Button, DialogActions
  } from '@material-ui/core';

import Alert from "../../../components/Alert";

export default ({status, onClose}) => {
    const [ msg, setMsg ] = useState("");
    return <Dialog
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth="md"
        >
        <DialogTitle className="ml-2" id="alert-dialog-title">
            Why is this lead status being marked as {status}?
        </DialogTitle>
        <DialogContent>
            {msg === "" && <Alert className="mb-1" severity="error">Message is mandatory</Alert>}
            <TextField
                name="Storage Status Message"
                variant="outlined"
                multiline={true}
                fullWidth={true}
                value={msg}
                minRows={4}
                maxRows={4}
                onChange={(e) => setMsg(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button
                color="primary" tma
                variant="contained"
                autoFocus
                onClick={() => msg && msg!="" && onClose(msg)}
            >
                Update to {status}
            </Button>
        </DialogActions>
    </Dialog>;
}