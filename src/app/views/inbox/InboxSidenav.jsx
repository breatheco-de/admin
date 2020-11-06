import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Icon,
  Button
} from "@material-ui/core";
import InboxComposeDialog from "./InboxComposeDialog";

const InboxSidenav = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="mr-4 bg-default">
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        className="py-2 bg-error w-full"
      >
        Compose
      </Button>
      <ListItem button>
        <ListItemIcon>
          <Icon>inbox</Icon>
        </ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon>folder_special</Icon>
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon>send</Icon>
        </ListItemIcon>
        <ListItemText primary="Sent" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon>inbox</Icon>
        </ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon>error</Icon>
        </ListItemIcon>
        <ListItemText primary="Spam" />
      </ListItem>

      <Divider />

      <ListItem button>
        <ListItemIcon>
          <Icon color="primary">people</Icon>
        </ListItemIcon>
        <ListItemText primary="Social" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon color="secondary">local_offer</Icon>
        </ListItemIcon>
        <ListItemText primary="Promotions" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon color="secondary">forums</Icon>
        </ListItemIcon>
        <ListItemText primary="Forums" />
      </ListItem>

      <InboxComposeDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default InboxSidenav;
