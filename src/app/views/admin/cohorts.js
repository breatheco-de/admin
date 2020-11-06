import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { Avatar, Grow, Icon, IconButton, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_HOST+"/v1/admissions/cohort").then(({ data }) => {
      if (isAlive) setUserList(data);
    });
    return () => setIsAlive(false);
  }, [isAlive]);

  const columns = [
    {
      name: "id", // field name in the row object
      label: "ID", // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: "slug", // field name in the row object
      label: "Slug", // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: "name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
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
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to="/pages/new-customer">
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
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/" },
            { name: "Students" },
          ]}
        />
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
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
