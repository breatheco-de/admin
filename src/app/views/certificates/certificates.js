import React, { useState, useEffect } from "react";
import { useQuery } from '../../hooks/useQuery';
import { useHistory } from 'react-router-dom';
import { Breadcrumb } from "matx";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import { Avatar, Grow, Icon, IconButton, TextField, Button } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { MatxLoading } from "matx";
import bc from "app/services/breathecode";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const Certificates = () => {
    const [isAlive, setIsAlive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    let { cohortId } = useParams();

    const [table, setTable] = useState({
        count: 100,
        page: 0
      });

    const query = useQuery();
    const history = useHistory();
    const [queryLimit, setQueryLimit] = useState(query.get("limit") || 10);
    const [queryOffset, setQueryOffset] = useState(query.get("offset") || 0);
    const [queryLike, setQueryLike] = useState(query.get("like") || "");
    
    
    // useEffect(() => {
    //     setIsLoading(true);
    //     if (cohortId !== null && cohortId !== undefined) {
    //         console.log("ey");
    //         axios.get(process.env.REACT_APP_API_HOST + "/v1/certificate/cohort/" + cohortId)
    //             .then(({ data }) => {
    //                 setIsLoading(false);
    //                 if (isAlive){
    //                     setItems(data);
    //                     console.log(items);
    //                 } 
    //             });
    //     } 
    //     else {
    //         console.log("ey");
    //         axios.get(process.env.REACT_APP_API_HOST + "/v1/certificate")
    //             .then(({ data }) => {
    //                 setIsLoading(false);
    //                 if (isAlive){
    //                     setItems(data);
    //                     console.log(items);
    //                 } 
    //             });
    //     }
    //     return () => setIsAlive(false);
    // }, [isAlive]);

    useEffect(() => {
        setIsLoading(true);
        bc.certificates().getAllCertificates({
          limit: queryLimit,
          offset: queryOffset,
          like: queryLike
        })
          .then(({ data }) => {
            setIsLoading(false);
            if (isAlive) {
                setItems(data)
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
        bc.certificates().getAllCertificates(query)
          .then(({ data }) => {
            setItems(data);
            setIsLoading(false);
            setTable({ count: data.count, page: page });
            history.replace(`/certificates?${Object.keys(query).map(key => key + "=" + query[key]).join("&")}`)
          }).catch(error => {
            setIsLoading(false);
          })
      }


    const columns = [
        {
            name: "specialty",
            label: "Specialty",
            options: {
                filter: true,
                customBodyRenderLite: i => items[i].specialty ?.name
            },
        },
        {
            name: "user",
            label: "User",
            options: {
                filter: true,
                customBodyRenderLite: i => items[i] && items[i].user.first_name + " " + items[i].user.last_name 
            },
        },
        {
            name: "academy", // field name in the row object
            label: "Academy", // column title that will be shown in table

            options: {
                filter: true,
                customBodyRenderLite: i => items[i].academy ?.name
                },
        },
        {
            name: "status", // field name in the row object
            label: "Status", // column title that will be shown in table

            options: {
                filter: true,
                filterType: "multiselect",
                 customBodyRender: (value, tableMeta, updateValue) => (
                    value
            
          ),
                },
        },
        {
            name: "expires_at",
            label: "Expires at",
            options: {
                filter: true,
                customBodyRenderLite: i => {
                    let item = items[i]

                    return (
                        <div className="flex items-center">
                            <div className="ml-3">
                                <h5 className="my-0 text-15">{item.expires_at !== null ? dayjs(item.expires_at).format("MM-DD-YYYY") : "-"}</h5>
                                <small className="text-muted">{item.expires_at !== null ? dayjs(item.expires_at).format("MM-DD-YYYY") : "-"}</small>
                            </div>
                        </div>

                    )
                }
            },
        },
        {
            name: "cohort", // field name in the row object
            label: "Cohort", // column title that will be shown in table
            options: {
                filter: true,
                filterType: "multiselect",
                 customBodyRender: (value, tableMeta, updateValue) => (
                    value.name
            
          ),
                    
                },
        },
        {
            name: "preview_url",
            label: "Preview",
            options: {
                filter: true,
                customBodyRenderLite: i => <a href={items[i].preview_url}>{items[i].preview_url !== null ? "preview" : "not available"}</a>
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
                                { name: "Certificates", path: "/certificates" },
                            ]}
                        />
                    </div>

                    <div className="">
                        <Link to="/certificates/new/single" color="primary" className="btn btn-primary">
                            <Button style={{ marginRight: 5 }} variant="contained" color="primary">
                                Add studend certificate
                            </Button>
                        </Link>
                        <Link to="/certificates/new/all" color="primary" className="btn btn-primary">
                            <Button variant="contained" color="primary">
                                Add cohort Certificates
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="overflow-auto">
                <div className="min-w-750">
                    {isLoading && <MatxLoading />}
                    <MUIDataTable
                        title={"All Certificates"}
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
                            count: table.count,
                            page: table.page,
                            elevation: 0,
                            rowsPerPage: parseInt(query.get("limit"), 10) || 10,
                            rowsPerPageOptions: [10, 20, 40, 80, 100],
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
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
                                            onChange={({ target: { value } }) => handleSearch(value)}
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

export default Certificates;
