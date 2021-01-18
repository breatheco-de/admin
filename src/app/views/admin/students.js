import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { MatxLoading } from "matx";
import { Avatar, Grow, Icon, IconButton, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(process.env.REACT_APP_API_HOST+"/v1/auth/user").then(({ data }) => {
      console.log(data)
      setIsLoading(false);
      if (isAlive) setUserList(data);
    });
    return () => setIsAlive(false);
  }, [isAlive]);

  const columns = [
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let user = userList[dataIndex];

          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.imgUrl} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{user?.first_name} {user?.last_name}</h5>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
            let item = userList[dataIndex];
            return <div className="flex items-center">
                <div className="flex-grow"></div>
                <Link to={`/admin/students/${item.id}/${item.first_name} ${item.last_name}`}>
                    <IconButton>
                        <Icon>edit</Icon>
                    </IconButton>
                </Link>
                <Link to="/pages/view-customer">
                    <IconButton>
                        <Icon>arrow_right_alt</Icon>
                    </IconButton>
                </Link>
            </div>
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <div>
            <Breadcrumb
            routeSegments={[
                { name: "Admin", path: "/" },
                { name: "Students" },
            ]}
            />
        </div>

        <div className="">
        <Link to={`/admin/students/new`}>
            <Button variant="contained" color="primary">
                Add new student
            </Button>
        </Link>
        </div>
      </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
        {isLoading && <MatxLoading />}
        <MUIDataTable
            title={"All Students"}
            data={userList}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              // selectableRows: "none", // set checkbox for each row
              // search: false, // set search option
              // filter: false, // set data filter option
              // download: false, // set download option
              // print: false, // set print option
              // pagination: true, //set pagination option
              // viewColumns: false, // set column option
              elevation: 0,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customSearchRender: (
                searchText,
                handleSearch,
                hideSearch,
                options
              ) => {
                return (
                  <Grow appear in={true} timeout={300}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={({ target: { value } }) => handleSearch(value)}
                      InputProps={{
                        style: {
                          paddingRight: 0,
                        },
                        startAdornment: (
                          <Icon className="mr-2" fontSize="small">
                            search
                          </Icon>
                        ),
                        endAdornment: (
                          <IconButton onClick={hideSearch}>
                            <Icon fontSize="small">clear</Icon>
                          </IconButton>
                        ),
                      }}
                    />
                  </Grow>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
