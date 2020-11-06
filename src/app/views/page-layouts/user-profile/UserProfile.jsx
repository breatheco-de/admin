import React, { useState, useEffect } from "react";
import { Icon, IconButton, Hidden, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import UserProfileContent from "./UserProfileContent";
import UserProfileSidenav from "./UserProfileSidenav";

const usestyles = makeStyles(({ palette, ...theme }) => ({
  headerBG: {
    height: 345,
    "@media only screen and (max-width: 959px)": {
      height: 400,
    },
  },
}));

const UserProfile = () => {
  const [open, setOpen] = useState(true);

  const theme = useTheme();
  const classes = usestyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidenav = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  }, [isMobile]);

  return (
    <div className="relative">
      <MatxSidenavContainer>
        <MatxSidenav width="300px" open={open} toggleSidenav={toggleSidenav}>
          <div className={clsx("bg-primary text-right", classes.headerBG)}>
            <Hidden smUp>
              <IconButton onClick={toggleSidenav}>
                <Icon className="text-white">clear</Icon>
              </IconButton>
            </Hidden>
          </div>
          <UserProfileSidenav />
        </MatxSidenav>
        <MatxSidenavContent open={open}>
          <div className={clsx("bg-primary", classes.headerBG)} />
          <UserProfileContent toggleSidenav={toggleSidenav} />
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </div>
  );
};

export default UserProfile;
