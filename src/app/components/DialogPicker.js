import React from "react";
import { 
    DialogTitle,
    Dialog,
    List,
    ListItem,
    ListItemText,
  } from "@material-ui/core";

const DialogPicker = ({ open, onClose, title, options }) => {
    return <Dialog
    onClose={() => onClose(false)}
    open={open}
  >
    <DialogTitle>{title}</DialogTitle>
    <List>
      {options.map((opt, i) => (
        <ListItem
          button
          onClick={() => onClose(opt)}
          key={i}
        >
          <ListItemText className="capitalize" primary={opt.label || opt} />
        </ListItem>
      ))}
    </List>
  </Dialog>;
}

export default DialogPicker;