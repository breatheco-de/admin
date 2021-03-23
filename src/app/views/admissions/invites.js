import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { MatxLoading } from "matx";
import { Avatar, Grow, Icon, IconButton, TextField} from "@material-ui/core";
import dayjs from "dayjs";
import bc from "app/services/breathecode";

let relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const Students = () => {
    const [isAlive, setIsAlive] = useState(true);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const resendInvite = (user) => {
        bc.auth().resendInvite(user)
        .then(({data}) => console.log(data))
        .catch(error => console.log(error))
    } 

    useEffect(() => {
        setIsLoading(true);
        bc.auth().getAcademyMembers({status: "invited"})
        .then(({ data }) => {
            console.log(data)
            setIsLoading(false);
            if (isAlive) {
                setUserList(data)
            };
        }).catch(error => {
            setIsLoading(false);
          })
        return () => setIsAlive(false);
    }, [isAlive]);

    const columns = [
        {
            name: "first_name", // field name in the row object
            label: "Name", // column title that will be shown in table
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let user = userList[dataIndex].user !== null ?
                        (userList[dataIndex]) :
                        ({ ...userList[dataIndex], user: { first_name: "", last_name: "", imgUrl: "" } });

                    return (
                        <div className="flex items-center">
                            <Avatar className="w-48 h-48" src={user.user?.imgUrl} />
                            <div className="ml-3">
                                <h5 className="my-0 text-15">{user.user?.first_name} {user.user?.last_name}</h5>
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
                    return <div className="MUIDataTableBodyCell-root-326">{item.role.name.toUpperCase()}</div>
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
                    return <div className="flex items-center">
                        <div className="flex-grow"></div>
                            <IconButton onClick={() => resendInvite(item.id)}>
                                <Icon>refresh</Icon>
                            </IconButton>
                    </div>
                },
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
                                { name: "Admin", path: "/" },
                                { name: "Invites" },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-auto">
                <div className="min-w-750">
                    {isLoading && <MatxLoading />}
                    <MUIDataTable
                        title={"Invites"}
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

export default Students;
