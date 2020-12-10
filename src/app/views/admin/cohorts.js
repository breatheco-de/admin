import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import {  Grow, Icon, IconButton, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { MatxLoading } from "matx";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const stageColors = {
    'INACTIVE': 'bg-gray',
    'PREWORK': 'bg-secondary',
    'STARTED': 'text-white bg-warning',
    'FINAL_PROJECT': 'text-white bg-error',
    'ENDED': 'text-white bg-green',
    'DELETED': 'light-gray',
}

const CustomerList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
      setIsLoading(true);
      axios.get(process.env.REACT_APP_API_HOST+"/v1/admissions/cohort").then(({ data }) => {
        setIsLoading(false);
        if (isAlive) setItems(data);
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
      name: "stage", // field name in the row object
      label: "Stage", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
            let item = items[dataIndex];

            return (
                <div className="flex items-center">
                    <div className="ml-3">
                        <small className={"border-radius-4 px-2 pt-2px "+stageColors[item?.stage]}>{item?.stage}</small><br />
                        {
                            ((dayjs().isBefore(dayjs(item?.kickoff_date)) && ['INACTIVE', 'PREWORK'].includes(item?.stage))  || 
                            (dayjs().isAfter(dayjs(item?.ending_date)) && !['ENDED', 'DELETED'].includes(item?.stage)))  && 
                                <small className="text-warning pb-2px"><Icon>error</Icon>Out of sync</small>
                        }
                    </div>
                </div>
            );
        },
      },
    },
    {
      name: "slug", // field name in the row object
      label: "Slug", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: i => {
            let item = items[i];
            return (
                <div className="flex items-center">
                    <div className="ml-3">
                        <h5 className="my-0 text-15">{item?.name}</h5>
                        <small className="text-muted">{item?.slug}</small>
                    </div>
                </div>
            );
        },
      },
    },
    {
      name: "kickoff_date",
      label: "Kickoff Date",
      options: {
        filter: true,
        customBodyRenderLite: i => 
            <div className="flex items-center">
                <div className="ml-3">
                    <h5 className="my-0 text-15">{dayjs(items[i].kickoff_date).format("MM-DD-YYYY")}</h5>
                    <small className="text-muted">{dayjs(items[i].kickoff_date).fromNow()}</small>
                </div>
            </div>
      },
    },
    {
      name: "certificate",
      label: "Certificate",
      options: {
        filter: true,
        customBodyRenderLite: i => items[i].certificate?.name
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
            <Link to={"/admin/cohorts/"+items[dataIndex].slug}>
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
            {isLoading && <MatxLoading />}
          <MUIDataTable
            title={"All Students"}
            data={items}
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
