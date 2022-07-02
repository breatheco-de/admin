import React from "react";
import {
    Card,
    Button,
    Avatar,
    Grid,
    LinearProgress,
    Divider,
} from "@material-ui/core";
import { GoogleIcon } from "matx";
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

const SkillCard = ({ user }) => {
    const classes = useStyles();

    return (
        <Card className="mb-4 pb-4">
            <div className="p-3">
                <Grid container spacing={3} alignItems="center">
                    <Grid item sm={4} xs={12}>
                        <div className="flex items-center m-2">
                            <Avatar className="h-56 w-56" src={user.imgUrl} />
                            <div className="ml-4">
                                <h5 className="m-0">{user.name}</h5>
                                <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                    {user.company?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="m-0 font-medium text-muted">Progressbar</p>
                            <p className="m-0 text-muted">40%</p>
                        </div>
                        <div>
                            <LinearProgress
                                color="primary"
                                value={35}
                                variant="determinate"
                            />
                        </div>
                    </Grid>
                    <Grid item sm={4} xs={12}>
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
                    </Grid>
                </Grid>
            </div>

            <Divider className="mb-4" />

            <div className="flex flex-wrap justify-between items-center px-5 m--2">
                <p className="text-muted m-0 m-2">Registered 3 mins ago</p>
                <div className="flex flex-wrap m-2">
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
            {/* <div className="flex justify-between mb-4">
        <Avatar className="h-56 w-56" src={user?.imgUrl} />
        <div>
          <MatxMenu
            menuButton={<Icon className="cursor-pointer">more_horiz</Icon>}
          >
            <MenuItem>
              <Icon fontSize="small"> person_pin </Icon>
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
      </div> */}
        </Card>
    );
};

export default SkillCard;