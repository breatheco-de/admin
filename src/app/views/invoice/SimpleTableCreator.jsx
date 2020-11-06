import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const SimpleTableGenerator = ({ column = [], dataField = [], data = [] }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {column.map((col, index) =>
            index !== 0 ? (
              <TableCell className="px-0">{col}</TableCell>
            ) : (
              <TableCell className="pl-sm-24">{col}</TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {dataField.map(field => (
              <TableCell className="pl-sm-24 capitalize" align="left">
                {field === "auto" ? index + 1 : item[field]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SimpleTableGenerator;
