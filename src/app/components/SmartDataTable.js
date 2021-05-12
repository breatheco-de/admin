import React, { useState, useEffect } from "react";
import { useQuery } from '../hooks/useQuery';
import { useHistory } from 'react-router-dom';
import PropTypes from "prop-types";

import CustomToolbar from "./CustomToolbar";
import MUIDataTable from "mui-datatables";
import { Grow, Icon, IconButton, TextField } from "@material-ui/core";

import { DownloadCsv } from "./DownloadCsv";

export const SmartMUIDataTable = (props) => {
    const [isAlive, setIsAlive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [table, setTable] = useState({
        count: 100,
        page: 0
      }); 
    const query = useQuery();
    const history = useHistory();
    const [queryLimit, setQueryLimit] = useState(query.get("limit") || 10);
    const [queryOffset, setQueryOffset] = useState(query.get("offset") || 0);
    const [queryLike, setQueryLike] = useState(query.get("like") || "");
    const [querys, setQuerys] = useState({
      limit: queryLimit,
      offset: queryOffset,
      like: queryLike
    });
  
    useEffect(() => {
      setIsLoading(true);
      props.search(querys)
        .then(( data ) => {
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
        setQuerys(query)
        props.search(query)
          .then(( data ) => {
            setIsLoading(false);
            setItems(data.results);
            setTable({ count: data.count, page: page });
            history.replace(`${props.historyReplace}?${Object.keys(query).map(key => key + "=" + query[key]).join("&")}`)
          }).catch(error => {
            setIsLoading(false);
          })
    }

    

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
            count: table.count,
            page: table.page,
            selectableRowsHeader:false,
            rowsPerPage: querys.limit === undefined ? 10 : querys.limit,
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
                history.replace(`${props.historyReplace}?${Object.keys(q)
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
                    handlePageChange(tableState.page, tableState.rowsPerPage, querys.like);
                    break;
                    case "changeRowsPerPage":
                    handlePageChange(tableState.page, tableState.rowsPerPage, querys.like);
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
                                  handlePageChange(querys.offset, querys.limit,  e.target.value)
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
    historyReplace: PropTypes.string,
    search: PropTypes.any,
};
