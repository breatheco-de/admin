import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  root: {
    width: "32px",
    height: "6px",
    borderRadius: "6px",
    overflow: "hidden",
    marginRight: "8px",
  },
}));

const ScrumBoardLabelBar = ({ color = "primary" }) => {
  const classes = useStyles();

  return <div className={`bg-${color} ${classes.root}`}></div>;
};

export default ScrumBoardLabelBar;
