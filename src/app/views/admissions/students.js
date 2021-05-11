import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { MatxLoading } from "matx";
import { Avatar, Grow, Icon, IconButton, TextField, Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import bc from "app/services/breathecode";
import { useQuery } from '../../hooks/useQuery';
import { useHistory } from 'react-router-dom';
import CustomToolbar from "../../components/CustomToolbar";

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const statusColors = {
  'INVITED': 'text-white bg-error',
  'ACTIVE': 'text-white bg-green',
}

const name = (user) => {
  if (user && user.first_name && user.first_name != "") return user.first_name + " " + user.last_name;
  else return "No name";
}

const Students = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [table, setTable] = useState({
    count: 100,
    page: 0
  }); 
  const query = useQuery();
  const history = useHistory();
  const [queryLimit, setQueryLimit] = useState(query.get("limit") || 10);
  const [queryOffset, setQueryOffset] = useState(query.get("offset") || 0);
  const [queryLike, setQueryLike] = useState(query.get("like") || "");
 
  
  //TODO: Show errors with the response 
 
  useEffect(() => {
    setIsLoading(true);
    bc.auth().getAcademyStudents({
      limit: queryLimit,
      offset: queryOffset,
      like: queryLike
    })
      .then(({ data }) => {
        console.log(data);
        setIsLoading(false);
        if (isAlive) {
          setUserList(data.results);
          setTable({ count: data.count });
        };
      }).catch(error => {
        setIsLoading(false);
      })
    return () => setIsAlive(false);
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage, _like) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    setQueryLike(_like);
    let query = {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      like: _like
    }
    bc.auth().getAcademyStudents(query)
      .then(({ data }) => {
        setIsLoading(false);
        setUserList(data.results);
        setTable({ count: data.count, page: page });
        history.replace(`/admissions/students?${Object.keys(query).map(key => key + "=" + query[key]).join("&")}`)
      }).catch(error => {
        setIsLoading(false);
      })
  }

  const resendInvite = (user) => {
    bc.auth().resendInvite(user)
      .then(({ data }) => console.log(data))
      .catch(error => console.log(error))
  }
  const getMemberInvite = (user) =>{
    bc.auth().getMemberInvite(user)
    .then(data => console.log(data))
    .catch(error => console.log(error))
  }

  const columns = [
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let { user, ...rest } = userList[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.imgUrl} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{user !== null ? name(user) : rest.first_name + " " + rest.last_name}</h5>
                <small className="text-muted">{user?.email || rest.email}</small>
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
        customBodyRenderLite: i =>
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(userList[i].created_at).format("MM-DD-YYYY")}</h5>
              <small className="text-muted">{dayjs(userList[i].created_at).fromNow()}</small>
            </div>
          </div>
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let item = userList[dataIndex]
          return <div className="flex items-center">
            <div className="ml-3">
              <small className={"border-radius-4 px-2 pt-2px" + statusColors[item.status]}>{item.status.toUpperCase()}</small>
              {item.status == 'INVITED' && <small className="text-muted d-block">Needs to accept invite</small>}
            </div>
          </div>
        }
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let item = userList[dataIndex].user !== null ?
            (userList[dataIndex]) :
            ({ ...userList[dataIndex], user: { first_name: "", last_name: "", imgUrl: "", id: "" } });
          return item.status === "INVITED" ? (<div className="flex items-center">
            <div className="flex-grow">

            </div>
            <Tooltip title="Copy invite link">
              <IconButton onClick={() => getMemberInvite(item.id)}>
                <Icon>assignment</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Resend Invite">
              <IconButton onClick={() => resendInvite(item.id)}>
                <Icon>refresh</Icon>
              </IconButton>
            </Tooltip>
          </div>) : <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to={`/admissions/students/${item.user !== null ? item.user.id : ""}`}>
              <Tooltip title="Edit">
                <IconButton>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        },
      },
    }
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Admissions", path: "/" },
                { name: "Students" },
              ]}
            />
          </div>

          <div className="">
            <Link to={`/admissions/students/new`}>
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
              serverSide: true,
              elevation: 0,
              count: table.count,
              page: table.page,
              selectableRowsHeader:false,
              rowsPerPage: parseInt(query.get("limit"), 10) || 10,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
              return <CustomToolbar selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} items={userList} key={userList} history={history}/>
              },
              onTableChange: (action, tableState) => {
                switch (action) {
                  case "changePage":
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike);
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike);
                    break;
                }
              },
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
                      onKeyPress={(e) => {
                        if(e.key == "Enter"){
                          handlePageChange(queryOffset, queryLimit, e.target.value)
                        }
                      }}
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

export default Students;
