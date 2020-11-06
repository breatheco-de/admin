import React, { useState, useEffect } from "react";
import { Grid, Card, Avatar, Button } from "@material-ui/core";
import { Breadcrumb } from "matx";
import Axios from "axios";

const UserList2 = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);

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
            { name: "User List 2" },
          ]}
        />
      </div>
      <Grid container spacing={3}>
        {userList.map((user, ind) => (
          <Grid key={user.id} item sm={6} xs={12}>
            <Card>
              <div className="p-6 flex flex-wrap justify-between items-center m--2">
                <div className="flex items-center m-2">
                  <Avatar className="h-48 w-48" src={user.imgUrl} />
                  <div className="ml-4">
                    <h5 className="m-0">{user.first_name}</h5>
                    <p className="mb-0 mt-2 text-muted font-normal capitalize">
                      {user.company?.toLowerCase()}
                    </p>
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

export default UserList2;
