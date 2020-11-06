import React from "react";
import {
  FormControlLabel,
  Checkbox,
  IconButton,
  Icon,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  topbar: {
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
}));

const InboxTopBar = ({
  toggleSidenav,
  handleMasterCheckbox,
  masterCheckbox,
}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        "py-1 mx-1 flex items-center relative bg-primary",
        classes.topbar
      )}
    >
      <Hidden smUp>
        <IconButton className="text-white" onClick={toggleSidenav}>
          <Icon>short_text</Icon>
        </IconButton>
      </Hidden>
      <FormControlLabel
        className="text-white ml-4"
        control={
          <Checkbox
            checked={masterCheckbox}
            onChange={handleMasterCheckbox}
            color="secondary"
          />
        }
        label="All"
      />
      <IconButton>
        <Icon className="text-white">delete</Icon>
      </IconButton>
      <IconButton>
        <Icon className="text-white">folder_special</Icon>
      </IconButton>
      <IconButton>
        <Icon className="text-white">archive</Icon>
      </IconButton>
      <IconButton>
        <Icon className="text-white">error</Icon>
      </IconButton>
    </div>
  );
};

export default InboxTopBar;
