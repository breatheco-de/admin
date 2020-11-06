import React from "react";
import { Card, Button, Icon, Avatar, MenuItem } from "@material-ui/core";
import { MatxMenu, GoogleIcon } from "matx";
import { Link } from "react-router-dom";
import { Twitter } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  google: {
    color: "#ec412c",
  },
  twitter: {
    color: "#039ff5",
  },
}));

const ProfileCard1 = ({ user }) => {
  const classes = useStyles();

  return (
    <Card className="p-5">
      <div className="flex justify-between mb-4">
        <Avatar className="h-56 w-56" src={user?.imgUrl} />
        <div>
          <MatxMenu
            menuButton={<Icon className="cursor-pointer">more_horiz</Icon>}
          >
            <MenuItem>
              <Icon fontSize="small"> account_circle </Icon>
              <span className="pl-4"> View Profile </span>
            </MenuItem>
            <MenuItem>
              <Icon fontSize="small"> person_add </Icon>
              <span className="pl-4"> Add to Team </span>
            </MenuItem>
            <MenuItem>
              <Icon fontSize="small"> edit </Icon>
              <span className="pl-4"> Edit Profile </span>
            </MenuItem>
          </MatxMenu>
        </div>
      </div>
      <div>
        <h5 className="m-0 capitalize">{user?.name}</h5>
        <p className="text-muted">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <div className="mb-4">
          <Link className="flex mb-1 items-center" to="/">
            <GoogleIcon
              fontSize="small"
              className={clsx("text-14", classes.google)}
            />
            <span className="ml-2">ui-lib@gmail.com</span>
          </Link>
          <Link className="flex items-center" to="/">
            <Twitter
              fontSize="small"
              className={clsx("text-14", classes.twitter)}
            />
            <span className="ml-2">uilib</span>
          </Link>
        </div>
        <div className="flex flex-wrap">
          <Button
            size="small"
            className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
          >
            CHAT
          </Button>
          <Button
            size="small"
            className="bg-light-primary hover-bg-primary text-primary px-5"
          >
            PROFILE
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard1;
