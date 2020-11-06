import React from "react";
import { Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  icon: {
    fontSize: "4rem",
  },
}));

const EmptyMessage = () => {
  const classes = useStyles();

  return (
    <div className="h-220 w-220 rounded elevation-z6 bg-default flex justify-center items-center">
      <Icon className={classes.icon} color="primary">
        chat
      </Icon>
    </div>
  );
};

export default EmptyMessage;
