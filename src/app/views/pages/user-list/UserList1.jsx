import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Avatar,
  IconButton,
  Divider,
  Button,
  LinearProgress,
} from "@material-ui/core";
import { Twitter } from "@material-ui/icons";
import { Breadcrumb, FacebookIcon, GoogleIcon } from "matx";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  google: {
    color: "#ec412c",
    backgroundColor: "rgba(236,65,44,.1)",
    borderColor: "#ec412c",

    "&:hover": {
      background: `#ec412c`,
      color: "#ffffff",
    },
  },
  facebook: {
    color: "#3765c9",
    backgroundColor: "rgba(55,101,201,.1)",
    borderColor: "#3765c9",

    "&:hover": {
      background: `#3765c9`,
      color: "#ffffff",
    },
  },
  twitter: {
    color: "#039ff5",
    backgroundColor: "rgba(3,159,245,.1)",
    borderColor: "#039ff5",

    "&:hover": {
      background: `#039ff5`,
      color: "#ffffff",
    },
  },
}));

const UserList1 = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    Axios.get("/api/user/all").then(({ data }) => {
      if (isAlive) setUserList(data);
    });
    return () => setIsAlive(false);
  }, [isAlive]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "User List 1" },
          ]}
        />
      </div>
      <Grid container spacing={3}>
        {userList.map((user, ind) => (
          <Grid key={user.id} item sm={6} xs={12}>
            <Card>
              <div className="p-5 flex flex-wrap justify-between items-center m--2">
                <div className="flex items-center m-2">
                  <Avatar className="h-48 w-48" src={user.imgUrl} />
                  <div className="ml-4">
                    <h5 className="m-0">{user.first_name}</h5>
                    <p className="mb-0 mt-2 text-muted font-normal capitalize">
                      {user.company?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center m-2">
                  <IconButton className={clsx("p-2", classes.google)}>
                    <GoogleIcon className="text-14" />
                  </IconButton>
                  <IconButton className={clsx("p-2 mx-1", classes.facebook)}>
                    <FacebookIcon className="text-14" />
                  </IconButton>
                  <IconButton className={clsx("p-2", classes.twitter)}>
                    <Twitter className="text-14" />
                  </IconButton>
                </div>
              </div>
              <Divider />
              <div className="p-5 flex flex-wrap justify-between m--2">
                <div className="flex-grow max-w-220 m-2 mr-6">
                  <div className="flex justify-between items-center mb-2">
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
                </div>
                <div className="flex m-2">
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UserList1;
