import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import Axios from "axios";
import MUIDataTable from "mui-datatables";
import { TableRow, TableCell } from "@material-ui/core";

const ExpandableMuiTable = () => {
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
            { name: "Expandable Mui Table" },
          ]}
        />
      </div>
      <MUIDataTable
        title={"User Report"}
        data={userList}
        columns={columns}
        options={{
          filter: true,
          filterType: "textField",
          responsive: "simple",
          expandableRowsHeader: false,
          expandableRows: true, // set rows expandable
          expandableRowsOnClick: true,
          selectableRows: false,
          renderExpandableRow: (rowData, { dataIndex }) => {
            const colSpan = rowData.length + 1;
            console.log(rowData);
            return (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <p className="mx-4 my-2">
                    {rowData[0]} has ${rowData[3]} in his wallet
                  </p>
                </TableCell>
              </TableRow>
            );
          },
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

export default ExpandableMuiTable;
