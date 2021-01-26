import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { MatxLoading } from "matx";
import { Avatar, Grow, Icon, IconButton, TextField} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from "react-router-dom";

const Students = () => {
    const [isAlive, setIsAlive] = useState(true);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" });

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/member?roles=country_manager,student&status=invited`).then(({ data }) => {
            console.log(data)
            setIsLoading(false);
            if (isAlive) {
                setUserList(data)
            };
        }).catch(error => {
            setIsLoading(false);
            setMsg({ alert: true, type: "error", text: error.detail || "You dont have the permissions required to read students"});
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
            },
        },
        {
            name: "role",
            label: "Role",
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = userList[dataIndex]
                    return <div className="MUIDataTableBodyCell-root-326">{item.role.name}</div>
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
                        <Link to={`/admin/students/${item.user.id}/${item.user.first_name} ${item.user.last_name}`}>
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
