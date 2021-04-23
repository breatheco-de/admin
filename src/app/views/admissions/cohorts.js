import React, { useState, useEffect } from "react";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { Grow, Icon, IconButton, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { MatxLoading } from "matx";
import bc from "app/services/breathecode";
import { useQuery } from '../../hooks/useQuery';
import { useHistory } from 'react-router-dom';


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const stageColors = {
  'INACTIVE': 'bg-gray',
  'PREWORK': 'bg-secondary',
  'STARTED': 'text-white bg-warning',
  'FINAL_PROJECT': 'text-white bg-error',
  'ENDED': 'text-white bg-green',
  'DELETED': 'light-gray',
}

const Cohorts = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page:0
  });
  const [querys, setQuerys] = useState({});

  const query = useQuery();
  const history = useHistory();

  const [queryLimit, setQueryLimit] = useState(query.get("limit") || 10);
  const [queryOffset, setQueryOffset] = useState(query.get("offset") || 0);
  const [queryLike, setQueryLike] = useState(query.get("like") || "");


  useEffect(() => {
    setIsLoading(true);
    bc.admissions().getAllCohorts({
      limit: queryLimit,
      offset: queryOffset,
      like: queryLike
    })
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems({...data});
          //setTable({...table,count: data.count});
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
    setQuerys(query);
    bc.admissions().getAllCohorts(query)
      .then(({ data }) => {
        setIsLoading(false);
        setItems({...data, page:page});
        history.replace(`/admin/cohorts?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`)
      }).catch(error => {
        setIsLoading(false);
      })
  }

  const columns = [
    {
      name: "id", // field name in the row object
      label: "ID", // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: "stage", // field name in the row object
      label: "Stage", // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get("stage") !== null ? [query.get("stage")] : [],
        customBodyRenderLite: (dataIndex) => {
          let item = items.results[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={"border-radius-4 px-2 pt-2px " + stageColors[item?.stage]}>{item?.stage}</small><br />
                {
                  ((dayjs().isBefore(dayjs(item?.kickoff_date)) && ['INACTIVE', 'PREWORK'].includes(item?.stage)) ||
                    (dayjs().isAfter(dayjs(item?.ending_date)) && !['ENDED', 'DELETED'].includes(item?.stage))) &&
                  <small className="text-warning pb-2px"><Icon>error</Icon>Out of sync</small>
                }
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "slug", // field name in the row object
      label: "Slug", // column title that will be shown in table
      options: {
        filter: true,
        filterList: query.get("slug") !== null ? [query.get("slug")] : [],
        customBodyRenderLite: i => {
          let item = items.results[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">{item?.name}</h5>
                <small className="text-muted">{item?.slug}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "kickoff_date",
      label: "Kickoff Date",
      options: {
        filter: true,
        filterList: query.get("kickoff_date") !== null ? [query.get("kickoff_date")] : [],
        customBodyRenderLite: i =>
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items.results[i].kickoff_date).format("MM-DD-YYYY")}</h5>
              <small className="text-muted">{dayjs(items.results[i].kickoff_date).fromNow()}</small>
            </div>
          </div>
      },
    },
    {
      name: "certificate",
      label: "Certificate",
      options: {
        filter: true,
        filterList: query.get("certificate") !== null ? [query.get("certificate")] : [],
        customBodyRenderLite: i => items.results[i].certificate?.name
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to={"/admin/cohorts/" + items.results[dataIndex].slug}>
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
        ),
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
                { name: "Admin", path: "/admin" },
                { name: "Cohorts" },
              ]}
            />
          </div>

          <div className="">
            <Link to="/admin/cohorts/new" color="primary" className="btn btn-primary">
              <Button variant="contained" color="primary">
                Add new cohort
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title={"All Cohorts"}
            data={items.results}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              serverSide: true,
              elevation: 0,
              page: items.page,
              count: items.count,
              onFilterChange: (changedColumn, filterList, type, changedColumnIndex) => {
                let q = {...querys,  [changedColumn]: filterList[changedColumnIndex][0] };
                setQuerys(q);
                history.replace(`/admin/cohorts?${Object.keys(q).map(key => `${key}=${q[key]}`).join('&')}`)
              },
              rowsPerPage: querys.limit === undefined ? 10 : querys.limit,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              onTableChange: (action, tableState) => {
                switch (action) {
                  case "changePage":
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike);
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(tableState.page, tableState.rowsPerPage, queryLike);
                    break;
                  case "filterChange":
                  //console.log(action, tableState)
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

export default Cohorts;