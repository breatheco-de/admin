import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { MatxLoading } from "matx";
import { Avatar, Grow, Icon, IconButton, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import bc from "app/services/breathecode";

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const statusColors = {
  'INVITED': 'text-white bg-error',
  'ACTIVE': 'text-white bg-green',
}
const roleColors = {
  'admin': 'text-black bg-gray',
}

const name = (user) => {
    if(user && user.first_name && user.first_name != "") return user.first_name + " " + user.last_name;
    else return "No name";
}

const Staff = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });

  const getAcademyMembers = () => {
    bc.auth().getRoles()
      .then((res) => {
        const roles = res.data.filter(r => r.slug !== "student").map(r => r.slug);
        if(res.status === 200) 
          bc.auth().getAcademyMembers({roles: roles.join()})
            .then(({ data }) => {
              console.log(data);
              setIsLoading(false);
              if (isAlive) {
                let filterUserNull = data.filter(item => item.user !== null)
                setUserList(filterUserNull)
              };
            }).catch(error => {
              setIsLoading(false);
            })
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    setIsLoading(true);
    getAcademyMembers();
    return () => setIsAlive(false);
  }, [isAlive]);


  const columns = [
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let { user } = userList[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.imgUrl} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{name(user)}</h5>
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
      name: "role",
      label: "Role",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let item = userList[dataIndex]
          return <small className={"border-radius-4 px-2 pt-2px "+(roleColors[item.role.slug] || "bg-light")}>{item.role.name.toUpperCase()}</small>
        }
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
                <small className={"border-radius-4 px-2 pt-2px"+statusColors[item.status]}>{item.status.toUpperCase()}</small>
                { item.status == 'INVITED' && <small className="text-muted d-block">Needs to accept invite</small>}
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
          let item = userList[dataIndex];
          return <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to={`/admin/staff/${item.user.id}`}>
              <IconButton>
                <Icon>edit</Icon>
              </IconButton>
            </Link>
          </div>
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
        <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
          {msg.text}
        </Alert>
      </Snackbar> : ""}
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Admin", path: "/" },
                { name: "Staff" },
              ]}
            />
          </div>

          <div className="">
            <Link to={`/admin/staff/new`}>
                <Button variant="contained" color="primary">
                    Add new staff member
                </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title={"Staff Members"}
            data={userList}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
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

export default Staff;
