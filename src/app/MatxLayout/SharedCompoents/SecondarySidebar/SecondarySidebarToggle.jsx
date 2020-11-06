/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { Fab, IconButton, Icon, useMediaQuery } from "@material-ui/core";
import { merge } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  toggle: {
    position: "fixed",
    right: "-30px",
    bottom: "20px",
    zIndex: 9999,
    transition: "all 0.15s ease",
    "&.open": {
      right: "10px",
    },
  },
}));

const SecondarySidebarToggle = () => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const classes = useStyles();
  const dispatch = useDispatch();
  const { settings } = useSelector(({ layout }) => layout);

  const toggle = () => {
    dispatch(
      setLayoutSettings(
        merge({}, settings, {
          secondarySidebar: { open: !settings.secondarySidebar.open },
        })
      )
    );
  };

  useEffect(() => {
    dispatch(
      setLayoutSettings(
        merge({}, settings, {
          secondarySidebar: { open: !isMobile },
        })
      )
    );
  }, [isMobile, setLayoutSettings]);

  return (
    <div
      className={clsx({
        [classes.toggle]: true,
        open: settings.secondarySidebar.open,
      })}
    >
      {settings.secondarySidebar.open && (
        <IconButton onClick={toggle} size="small" aria-label="toggle">
          <Icon>arrow_right</Icon>
        </IconButton>
      )}
      {!settings.secondarySidebar.open && (
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add"
          className="pr-9"
          onClick={toggle}
        >
          <Icon>arrow_left</Icon>
        </Fab>
      )}
    </div>
  );
};

export default SecondarySidebarToggle;
