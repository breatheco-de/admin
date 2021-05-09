import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import PropTypes from "prop-types";

import CustomToolbar from "./CustomToolbar";
import MUIDataTable from "mui-datatables";
import { Grow, Icon, IconButton, TextField } from "@material-ui/core";

import { DownloadCsv } from "./DownloadCsv";

export const SmartMUIDataTable = (props) => {
    const history = useHistory();
    const [querys, setQuerys] = useState(props.querys)

  return (
    <MUIDataTable
        title={props.title}
        data={props.data}
        columns={props.columns}
        options={{
            download: false,
            filterType: "textField",
            responsive: "standard",
            serverSide: true,
            elevation: 0,
            count: props.table.count,
            page: props.table.page,
            selectableRowsHeader:false,
            rowsPerPage: props.querys.limit === undefined ? 10 : props.querys.limit,
            rowsPerPageOptions: [10, 20, 40, 80, 100],
            viewColumns: true,

            customToolbar: () => {
                return <DownloadCsv />;
              },

            onFilterChange: (
                changedColumn,
                filterList,
                type,
                changedColumnIndex
              ) => {
                let q = {
                  ...querys,
                  [changedColumn]: filterList[changedColumnIndex][0],
                };
                setQuerys(q);
                history.replace(`${props.queryUrl}?${Object.keys(q)
                    .map((key) => `${key}=${q[key]}`)
                    .join("&")}`
                );
              },

            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
            return <CustomToolbar 
                        selectedRows={selectedRows} 
                        displayData={displayData} 
                        setSelectedRows={setSelectedRows} 
                        items={props.data} 
                        key={props.data} 
                        history={history}/>
            },

            onTableChange: (action, tableState) => {
                switch (action) {
                    case "changePage":
                    props.handlePageChange(tableState.page, tableState.rowsPerPage, props.queryLike);
                    break;
                    case "changeRowsPerPage":
                    props.handlePageChange(tableState.page, tableState.rowsPerPage, props.queryLike);
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
                                    props.handlePageChange(props.queryOffset, props.queryLimit, e.target.value)
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
    );
}

SmartMUIDataTable.propTypes = {
    title: PropTypes.string,
    data: PropTypes.any,
    columns: PropTypes.any,
    handlePageChange: PropTypes.any,
    queryLimit: PropTypes.string,
    queryOffset: PropTypes.string,
    queryLike: PropTypes.string,
    querys: PropTypes.object,
    table: PropTypes.object,
    queryUrl: PropTypes.string,
};