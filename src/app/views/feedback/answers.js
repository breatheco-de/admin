import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { Avatar, Grow, Icon, IconButton, TextField, Button, LinearProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { MatxLoading } from "matx";
import bc from "app/services/breathecode";
import { useQuery } from '../../hooks/useQuery';
import {useHistory} from 'react-router-dom';
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

const Answers = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page:0
  });
  const [querys, setQuerys] = useState({});
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    let q = {
      limit: query.get("limit") !== null ? query.get("limit") : 10,
      offset: query.get("offset") !== null ? query.get("offset") : 0
    }
    setQuerys(q);
    bc.feedback().getAnswers(q)
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems({...data});
          //setTable({...table,count: data.count});
        };
      }).catch(error => {
        setIsLoading(false);
      })
    return () => setIsAlive(false);
  }, [isAlive]);

   const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    bc.feedback().getAnswers({
      limit: rowsPerPage,
      offset: page * rowsPerPage
    })
      .then(({ data }) => {
        setIsLoading(false);
        setItems({...data, page:page});
      }).catch(error => {
        setIsLoading(false);
      })
      let q = {...querys, limit:rowsPerPage, offset:page * rowsPerPage};
      setQuerys(q);
      history.replace(`/feedback/answers?${Object.keys(q).map(key => `${key}=${q[key]}`).join('&')}`)
  }
   

  const columns = [
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let { user } = items.results[dataIndex];
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
            {items.results[i].created_at ? 
                <div className="ml-3">
                    <h5 className="my-0 text-15">{dayjs(items.results[i].created_at).format("MM-DD-YYYY")}</h5>
                    <small className="text-muted">{dayjs(items.results[i].created_at).fromNow()}</small>
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
            const color = items.results[i].score > 7 ? "text-green" : items.results[i].score < 7 ? "text-error" : "text-orange";
            if(items.results[i].score)
                return <div className="flex items-center">
                    <LinearProgress
                        color="secondary"
                        value={parseInt(items.results[i].score) * 10}
                        variant="determinate"
                        />
                    <small className={color}>{items.results[i].score}</small>
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
            { items.results[i].comment ? 
                items.results[i].comment.substring(0, 100)
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
                { name: "Feedback", path: "/feedback" },
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
            title={"All Answers"}
            data={items.results}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              serverSide: true,
              elevation: 0,
              page: items.page,
              count: items.count,
              onFilterChange: (changedColumn, filterList, type, changedColumnIndex) => {
                let q = { [changedColumn]: filterList[changedColumnIndex][0] }
                setQuerys(q)
                history.replace(`/feedback/answers?${Object.keys(q).map(key => `${key}=${q[key]}`).join('&')}`)
              },
              rowsPerPage: parseInt(query.get("limit"), 10) || 10,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              onTableChange: (action, tableState) => {
                switch(action){
                  case "changePage":
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page,tableState.rowsPerPage);
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(tableState.page,tableState.rowsPerPage);
                    break;
                  case "filterChange":
                    //console.log(action, tableState)
                }
              }, 
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

export default Answers;
