import { Button, Grow, Icon, IconButton, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MatxLoading } from "matx";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { DownloadCsv } from "./DownloadCsv";
import BulkDelete from "./ToolBar/BulkDelete";

const defaultToolbarSelectStyles = {
    iconButton: {},
    iconContainer: {
        marginRight: "24px",
    },
    inverseIcon: {
        transform: "rotate(90deg)",
    },
};

const DefaultToobar = ({ children, ...props }) => (
    <div className={props.classes.iconContainer}>
        <BulkDelete onBulkDelete={props.onBulkDelete} {...props} />
        {children}
    </div>
);

const StyledDefaultToobar = withStyles(defaultToolbarSelectStyles, {
    name: "SmartMUIDataTable",
})(DefaultToobar);

export const getParams = (url = window.location) => {
    // Create a params object
    let params = {};

    new URL(url).searchParams.forEach(function (val, key) {
        params[key] = val;
    });

    return params;
};

export const SmartMUIDataTable = (props) => {
    const query = useQuery();
    const [isAlive, setIsAlive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [table, setTable] = useState({
        count: 100,
        page: query.get("offset")/query.get("limit") || 0,
    });
    const history = useHistory();
    const [searchBoxValue, setSearchBoxValue] = useState(
        query.get("like") || ""
    );
    const [querys, setQuerys] = useState({
        limit: query.get("limit") || props.defaultLimit || 10,
        offset: query.get("offset") || 0,
    });

    if (!Array.isArray(props.items)) {
        console.log("SmartMUIDataTable.props.items:", props.items);
        throw Error("Property items must be an array on SmartMUIDataTable");
    }

    let getSort = () => {
        let sort = {};
        let value = query.get("sort");
        if (value) {
            if (value[0] === "-") {
                value = value.substring(1);
                sort = {
                    name: value,
                    direction: "desc",
                };
            } else {
                sort = {
                    name: value,
                    direction: "asc",
                };
            }
        }
        return sort;
    };

    const loadData = () => {
        setIsLoading(true);
        props
            .search({ ...querys, ...getParams() })
            .then((data) => {
                setIsLoading(false);
                if (isAlive) {
                    setTable({ count: data.count });
                }
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadData();
        return () => {
            setIsAlive(false);
        };
    }, [isAlive]);

    const handlePageChange = (page, rowsPerPage, like, sort) => {
        console.log("####### I excuted");
        setIsLoading(true);
        const { limit, offset, ...restParams } = getParams();
        delete restParams.sort;
        const q = {
            limit: rowsPerPage,
            offset: rowsPerPage * page,
            ...restParams,
            ...(like && { like }),
            ...(sort && { sort }),
        };
        setQuerys(q);
        props
            .search(q)
            .then((data) => {
                setIsLoading(false);
                setTable({ count: data.count, page });
                history.replace(
                    `${history.location.pathname}?${Object.keys(q)
                        .map((key) => `${key}=${q[key]}`)
                        .join("&")}`
                );
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    const handleFilterSubmit = () => {
        setIsLoading(true);
        props
            .search(querys)
            .then((result) => {
                setTable({ count: result.count, page: 0 });
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    const handleChange = (e) => {
        setSearchBoxValue(e.target.value);
    };
    const clearSearchBox = () => {
        setSearchBoxValue("");
        query.delete("like");
        history.replace({
            search: query.toString(),
        });
        handlePageChange(0, querys.limit);
    };
    return (
        <>
            {isLoading && <MatxLoading />}
            <MUIDataTable
                title={props.title}
                data={props.items}
                columns={props.columns}
                options={{
                    sortOrder: getSort(),
                    download: false,
                    filterType: "textField",
                    responsive: "vertical",
                    serverSide: true,
                    elevation: 0,
                    count: table.count,
                    page: table.page,
                    selectableRowsHeader: false,
                    rowsPerPage: querys.limit === undefined ? 10 : querys.limit,
                    rowsPerPageOptions: [10, 20, 40, 80, 100],
                    onFilterChipClose: () => {
                        handlePageChange(0, querys.limit);
                    },
                    onTableChange: (action, tableState) => {
                        switch (action) {
                            case "changePage":
                                handlePageChange(
                                    tableState.page,
                                    tableState.rowsPerPage,
                                    querys.like,
                                    querys.sort
                                );
                                break;
                            case "changeRowsPerPage":
                                handlePageChange(
                                    tableState.page,
                                    tableState.rowsPerPage,
                                    querys.like,
                                    querys.sort
                                );
                                break;
                            default:
                                break;
                        }
                    },
                    customToolbar: () => (
                        <DownloadCsv
                            getAllPagesCSV={() =>
                                props.downloadCSV(querys.like)
                            }
                            getSinglePageCSV={() => props.downloadCSV(querys)}
                        />
                    ),

                    onColumnSortChange: (changedColumn, direction) => {
                        if (direction === "asc") {
                            handlePageChange(
                                querys.offset,
                                querys.limit,
                                querys.like,
                                changedColumn
                            );
                        } else if (direction === "desc") {
                            handlePageChange(
                                querys.offset,
                                querys.limit,
                                querys.like,
                                `-${changedColumn}`
                            );
                        } else {
                            query.delete("sort");
                            history.replace({
                                search: query.toString(),
                            });
                            handlePageChange(
                                querys.offset,
                                querys.limit,
                                querys.like
                            );
                        }
                    },

                    onFilterChange: (
                        changedColumn,
                        filterList,
                        type,
                        changedColumnIndex
                    ) => {
                        let q;
                        if (type === "reset") {
                            q = {
                                limit: querys.limit ? querys.limit : 10,
                                offset: querys.offset ? querys.offset : 0,
                            };
                        } else if (
                            filterList[changedColumnIndex][0] === undefined ||
                            type === "chip"
                        ) {
                            q = { ...querys };
                            delete q[changedColumn];
                        } else {
                            q = {
                                ...querys,
                                [changedColumn]:
                                    filterList[changedColumnIndex][0],
                            };
                        }
                        setQuerys(q);
                        history.replace(
                            `${props.historyReplace}?${Object.keys(q)
                                .map((key) => `${key}=${q[key]}`)
                                .join("&")}`
                        );
                    },

                    customToolbarSelect: (
                        selectedRows,
                        displayData,
                        setSelectedRows
                    ) => {
                        let children = null;
                        if (props.options?.customToolbarSelect) {
                            children = props.options.customToolbarSelect(
                                selectedRows,
                                displayData,
                                setSelectedRows,
                                loadData
                            );
                        }
                        return (
                            <StyledDefaultToobar
                                selectedRows={selectedRows}
                                displayData={displayData}
                                setSelectedRows={setSelectedRows}
                                items={props.items}
                                onBulkDelete={loadData}
                                deleting={props.deleting}
                                bulkActions={props.bulkActions}
                            >
                                {children}
                            </StyledDefaultToobar>
                        );
                    },
                    customFilterDialogFooter: () => (
                        <div style={{ marginTop: "40px" }}>
                            <Button
                                variant="contained"
                                onClick={() => handleFilterSubmit()}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    ),
                    customSearchRender: () => (
                        <Grow appear in timeout={300}>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchBoxValue}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handlePageChange(
                                            querys.offset,
                                            querys.limit,
                                            e.target.value,
                                            querys.sort
                                        );
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
                                        <IconButton
                                            onClick={() => clearSearchBox()}
                                        >
                                            <Icon fontSize="small">clear</Icon>
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grow>
                    ),
                    ...props.options,
                }}
            />
        </>
    );
};

SmartMUIDataTable.propTypes = {
    title: PropTypes.string,
    items: PropTypes.array,
    selectableRows: PropTypes.bool,
    columns: PropTypes.any,
    search: PropTypes.any,
    options: PropTypes.object,
    defaultLimit: PropTypes.number,
    view: PropTypes.string,
    historyReplace: PropTypes.string,
    children: PropTypes.element,
};
SmartMUIDataTable.defaultProps = {
    selectableRows: true,
    defaultLimit: 10,
    downloadCsv: true
};
