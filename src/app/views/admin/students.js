import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import Axios from "axios";
import MUIDataTable from "mui-datatables";

const SimpleMuiTable = () => {
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
            { name: "Data Table", path: "/pages" },
            { name: "Simple Mui Table" },
          ]}
        />
      </div>
      <MUIDataTable
        title={"User Report"}
        data={userList}
        columns={columns}
        options={{
          filterType: "textField",
          responsive: "simple",
          selectableRows: "none", // set checkbox for each row
          // search: false, // set search option
          // filter: false, // set data filter option
          // download: false, // set download option
          // print: false, // set print option
          // pagination: true, //set pagination option
          // viewColumns: false, // set column option
          elevation: 0,
          rowsPerPageOptions: [10, 20, 40, 80, 100],
        }}
      />
    </div>
  );
};

const columns = [
  {
    name: "name", // field name in the row object
    label: "Name", // column title that will be shown in table
    options: {
      filter: true,
    },
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: true,
    },
  },
  {
    name: "company",
    label: "Company",
    options: {
      filter: true,
    },
  },
  {
    name: "balance",
    label: "Balance",
    options: {
      filter: true,
    },
  },
];

export default SimpleMuiTable;
