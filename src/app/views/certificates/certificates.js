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
import CustomToolbar from "../../components/CustomToolbar";

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


    useEffect(() => {
        setIsLoading(true);
        bc.certificates().getAllCertificates({
          limit: queryLimit,
          offset: queryOffset,
        })
          .then(({ data }) => {
            console.log(data.results);
            setIsLoading(false);
            if (isAlive) {
                setItems(data.results)
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
              
            setItems(data.results);
            setIsLoading(false);
            setTable({ count: data.count, page: page });
            history.replace(`/certificates?${Object.keys(query).map(key => key + "=" + query[key]).join("&")}`)
          }).catch(error => {
            setIsLoading(false);
          })
      }

    console.log(items);

    const columns = [
        // {
        //     name: "specialty",
        //     label: "Specialty",
        //     options: {
        //         filter: true,
        //         customBodyRenderLite: i => items.specialty ?.name
        //     },
        // },
        // {
        //     name: "user",
        //     label: "User",
        //     options: {
        //         filter: true,
        //         customBodyRenderLite: i => items && items.user.first_name + " " + items.user.last_name 
        //     },
        // },
        {
            name: "academy", // field name in the row object
            label: "Academy", // column title that will be shown in table
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]                   
                    return (
                        <div className="flex items-center">
                            <div className="ml-1">
                                <h5 className="my-0 text-15">{ item.academy.name }</h5>
                            </div>
                        </div>
                    )
                },
            },
        },
        {
            name: "status", // field name in the row object
            label: "Status", // column title that will be shown in table
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]                   
                    return (
                        <div className="flex items-center">
                            <div className="ml-3">
                                <small>{ item.status }</small>
                            </div>
                        </div>
                    )
                },
            },
        },
        {
            name: "expires_at",
            label: "Expires at",
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]
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
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]                   
                    return (
                        <div className="flex items-center">
                            <div className="ml-1">
                                <h5 className="my-0 text-15">{ item.cohort.name }</h5>
                            </div>
                        </div>
                    )
                },
            }
        },
        {
            name: "cohort", // field name in the row object
            label: "Cohort", // column title that will be shown in table
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]                   
                    return (
                        <div className="flex items-center">
                            <div className="ml-1">
                                <h5 className="my-0 text-15">{ item.cohort.slug }</h5>
                            </div>
                        </div>
                    )
                },
            }
        },
        {
            name: "preview_url",
            label: "Preview",
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let item = items[dataIndex]
                    return <a href={item.preview_url}>{item.preview_url !== null ? "preview" : "not available"}</a>
                } 
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
                            serverSide: true,
                            elevation: 0,
                            count: table.count,
                            page: table.page,
                            rowsPerPage: parseInt(query.get("limit"), 10) || 10,
                            rowsPerPageOptions: [10, 20, 40, 80, 100],
                            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                                return <CustomToolbar selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} items={items} key={items} history={history}/>
                                },
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
