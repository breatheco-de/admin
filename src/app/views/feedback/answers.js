import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { Avatar, Grow, Icon, IconButton, TextField, Button, LinearProgress } from "@material-ui/core";
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

const EventList = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios.get(process.env.REACT_APP_API_HOST + "/v1/feedback/academy/answer").then(({ data }) => {
      setIsLoading(false);
      if (isAlive) setItems(data);
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
          let { user } = items[dataIndex];
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
      label: "Sent date",
      options: {
        filter: true,
        customBodyRenderLite: i =>
          <div className="flex items-center">
            {items[i].created_at ? 
                <div className="ml-3">
                    <h5 className="my-0 text-15">{dayjs(items[i].created_at).format("MM-DD-YYYY")}</h5>
                    <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
                </div>
                :
                <div className="ml-3">
                    No information
                </div>
            }
          </div>
      },
    },
    {
      name: "score",
      label: "Score",
      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRenderLite: i => {
            const color = items[i].score > 7 ? "text-green" : items[i].score < 7 ? "text-error" : "text-orange";
            if(items[i].score)
                return <div className="flex items-center">
                    <LinearProgress
                        color="secondary"
                        value={parseInt(items[i].score) * 10}
                        variant="determinate"
                        />
                    <small className={color}>{items[i].score}</small>
                </div>
            else return "Not answered"
        }
      },
    },
    {
      name: "comment",
      label: "Comments",
      options: {
        filter: true,
        customBodyRenderLite: i =>
          <div className="flex items-center">
            { items[i].comment ? 
                items[i].comment.substring(0, 100)
                :
                "No comments"
            }
          </div>
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
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Feedback", path: "/" },
                { name: "Answer List" },
              ]}
            />
          </div>

          <div className="">
            <Link to="/feedback/survey/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary">
                Send new survey
              </Button>
          </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title={"All Events"}
            data={items}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              selectableRows: "none", // set checkbox for each row
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

export default EventList;
