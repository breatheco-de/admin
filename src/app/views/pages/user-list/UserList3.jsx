import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Avatar,
  Divider,
  Button,
  Icon,
  TablePagination,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import Axios from "axios";
import ProfileCard1 from "./ProfileCard1";

const UserList3 = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
            { name: "User List 3" },
          ]}
        />
      </div>
      <Grid container spacing={2}>
        <Grid item md={3} sm={12} xs={12}>
          <Card className="pb-8">
            <div className="p-8 flex-column items-center">
              <Avatar
                className="h-56 w-56 mb-6"
                src="/assets/images/face-1.png"
              />
              <p className="mt-0 mb-2 text-muted font-normal capitalize">
                Project manager
              </p>
              <h5 className="m-0">Asiya Wolff</h5>
            </div>
            <Divider className="mb-8" />
            <div className="mb-8">
              <p className="text-muted mt-0 mb-3 ml-3">TEAMS</p>
              <Button variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">people</Icon>
                <span className="ml-2">Alpha</span>
              </Button>
              <Button variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">people</Icon>
                <span className="ml-2">Beta</span>
              </Button>
              <Button variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">people</Icon>
                <span className="ml-2">Sales</span>
              </Button>
              <Button variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">people</Icon>
                <span className="ml-2">Report</span>
              </Button>
            </div>
            <div>
              <p className="text-muted mt-0 mb-3 ml-3">MY TEAM</p>
              <Button variant="text" className="w-full justify-start px-3">
                <Icon fontSize="small">favorite</Icon>
                <span className="ml-2">Favorite</span>
              </Button>
            </div>
          </Card>
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <Grid container spacing={2}>
            {userList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, ind) => (
                <Grid key={user.id} item sm={6} xs={12}>
                  <ProfileCard1 user={user} />
                </Grid>
              ))}
          </Grid>
          <div className="mt-4">
            <TablePagination
              className="px-4"
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={userList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserList3;
