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

  //TODO: Show errors with the response 

  useEffect(() => {
    setIsLoading(true);
    bc.auth().getAcademyStudents({
      limit: query.get("limit") !== null ? query.get("limit") : 10,
      offset: query.get("offset") !== null ? query.get("offset") : 0,
      like: query.get("like") !== null ? query.get("like") : ""
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

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    console.log("page: ", rowsPerPage);
    bc.auth().getAcademyStudents({
      limit: rowsPerPage,
      offset: page * rowsPerPage
    })
      .then(({ data }) => {
        setIsLoading(false);
        setUserList(data.results);
        setTable({ count: data.count, page: page });
        history.replace(`/admin/students?limit=${rowsPerPage}&offset=${page * rowsPerPage}`)
      }).catch(error => {
        setIsLoading(false);
      })
  }

  const handlePageChangeByName = (newName) => {
    setIsLoading(true);
    bc.auth().getAcademyStudents({
      like: newName
    })
      .then(({ data }) => {
        setIsLoading(false);
        console.log("data", data)
        setUserList(data);
        console.log("userList", userList);
        history.replace(`/admin/students?name=${newName}`);
      }).catch(error => {
        setIsLoading(false);
      })
  }

  const searchByName = (e, newName) => {
    if (e.key == "Enter") {
      handlePageChangeByName(newName)
    }
  }

  const resendInvite = (user) => {
    bc.auth().resendInvite(user)
      .then(({ data }) => console.log(data))
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
            <div className="flex-grow"></div>
            <Tooltip title="Resend Invite">
              <IconButton onClick={() => resendInvite(item.id)}>
                <Icon>refresh</Icon>
              </IconButton>
            </Tooltip>
          </div>) : <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to={`/admin/students/${item.user !== null ? item.user.id : ""}`}>
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
              serverSide: true,
              elevation: 0,
              count: table.count,
              page: table.page,
              rowsPerPage: parseInt(query.get("limit"), 10) || 10,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
              return <CustomToolbar selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} items={userList} key={userList} history={history}/>
              },
              onTableChange: (action, tableState) => {
                console.log(action, tableState)
                switch (action) {
                  case "changePage":
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(tableState.page, tableState.rowsPerPage);
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
                      onChange={({ target: { value } }) => {handleSearch(value)}}
                      onKeyPress={(e) => {searchByName(e, e.target.value)}}
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
