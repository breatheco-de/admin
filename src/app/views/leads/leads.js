import React, { useState, useEffect } from "react";
import { Grow, Icon, IconButton, TextField, Button } from "@material-ui/core";
import { Breadcrumb } from "matx";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import bc from "../../services/breathecode";
import dayjs from "dayjs";
import { useQuery } from "../../hooks/useQuery";
import { useHistory } from "react-router-dom";
import { DownloadCsv } from "../../components/DownloadCsv";
import BulkDelete from "../../components/ToolBar/BulkDelete";
import CustomToolbar from "../../components/CustomToolbar";

let relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const stageColors = {
  google: "bg-gray",
  facebook: "bg-secondary",
  coursereport: "text-white bg-warning",
  ActiveCampaign: "text-white bg-error",
  bing: "text-white bg-green",
};

const Leads = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState({
    page: 0,
  });
  const [querys, setQuerys] = useState({});
  const query = useQuery();
  const history = useHistory();
  const [queryLimit, setQueryLimit] = useState(query.get("limit") || 10);
  const [queryOffset, setQueryOffset] = useState(query.get("offset") || 0);
  const [queryLike, setQueryLike] = useState(query.get("like") || "");

  const handleLoadingData = () => {
    setIsLoading(true);
    let q = {
      limit: query.get("limit") !== null ? query.get("limit") : 10,
      offset: query.get("offset") !== null ? query.get("offset") : 0,
    };
    setQuerys(q);
    bc.marketing()
      .getAcademyLeads(q)
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems({ ...data });
        }
      })
      .catch((error) => setIsLoading(false));
    return () => setIsAlive(false);
  };

  useEffect(() => {
    handleLoadingData();
  }, []);

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    bc.marketing()
      .getAcademyLeads({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data, page: page });
      })
      .catch((error) => {
        setIsLoading(false);
      });
    let q = { ...querys, limit: rowsPerPage, offset: page * rowsPerPage };
    setQuerys(q);
    history.replace(
      `/leads/list?${Object.keys(q)
        .map((key) => `${key}=${q[key]}`)
        .join("&")}`
    );
  };

  const handleFilterSubmit = () => {
    bc.marketing()
      .getAcademyLeads(querys)
      .then(({ data }) => {
        setIsLoading(false);
        setItems({ ...data });
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filterList: query.get("id") !== null ? [query.get("id")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>{items.results[dataIndex].id}</span>
        ),
      },
    },
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let lead = items.results[dataIndex];
          return (
            <div className='ml-3'>
              <h5 className='my-0 text-15'>
                {lead.first_name + " " + lead.last_name}
              </h5>
              <small className='text-muted'>{lead?.email || lead.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: "course",
      label: "Course",
      options: {
        display: false,
        filterList: query.get("course") !== null ? [query.get("course")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>{items.results[dataIndex].course}</span>
        ),
      },
    },
    {
      name: "lead_type",
      label: "Lead Type",
      options: {
        filterList:
          query.get("lead_type") !== null ? [query.get("lead_type")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>
            {items.results[dataIndex].lead_type
              ? items.results[dataIndex].lead_type
              : "---"}
          </span>
        ),
      },
    },
    {
      name: "utm_url",
      label: "Utm URL",
      options: {
        filterList: query.get("utm_url") !== null ? [query.get("utm_url")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>
            {items.results[dataIndex].utm_url
              ? items.results[dataIndex].utm_url
              : "---"}
          </span>
        ),
      },
    },
    {
      name: "utm_medium",
      label: "Utm Medium",
      options: {
        filterList:
          query.get("utm_medium") !== null ? [query.get("utm_medium")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>
            {items.results[dataIndex].utm_medium
              ? items.results[dataIndex].utm_medium
              : "---"}
          </span>
        ),
      },
    },
    {
      name: "utm_source",
      label: "Utm Source",
      options: {
        filter: true,
        filterType: "multiselect",
        filterList:
          query.get("utm_source") !== null ? [query.get("utm_source")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span
            className={`ellipsis ${
              stageColors[items.results[dataIndex].utm_source]
            } border-radius-4 px-2 pt-2px text-center`}
          >
            {items.results[dataIndex].utm_source
              ? items.results[dataIndex].utm_source
              : "---"}
          </span>
        ),
      },
    },
    {
      name: "tags",
      label: "Tags",
      options: {
        filter: true,
        filterType: "multiselect",
        filterList: query.get("tags") !== null ? [query.get("tags")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className='ellipsis'>
            {items.results[dataIndex].tags
              ? items.results[dataIndex].tags
              : "---"}
          </span>
        ),
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
        filterList:
          query.get("created_at") !== null ? [query.get("created_at")] : [],
        customBodyRenderLite: (i) => (
          <div className='flex items-center'>
            <div className='ml-3'>
              <h5 className='my-0 text-15'>
                {dayjs(items.results[i].created_at).format("MM-DD-YYYY")}
              </h5>
              <small className='text-muted'>
                {dayjs(items.results[i].created_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
  ];

  return (
    <div className='m-sm-30'>
      <div className='mb-sm-30'>
        <div className='flex flex-wrap justify-between mb-6'>
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Pages", path: "/leads/list" },
                { name: "Order List" },
              ]}
            />
          </div>
          <div className=''>
            <Link
              to='/leads/list/new'
              color='primary'
              className='btn btn-primary'
            >
              <Button variant='contained' color='primary'>
                Add new lead
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='overflow-auto'>
        <div className='min-w-750'>
          <MUIDataTable
            title={"All Leads"}
            data={items.results}
            columns={columns}
            options={{
              customToolbar: () => {
                let singlePageTableCsv = `/v1/marketing/academy/lead?limit=${queryLimit}&offset=${queryOffset}&like=${queryLike}`;
                let allPagesTableCsv = `/v1/marketing/academy/lead?like=${queryLike}`;
                return (
                  <DownloadCsv
                    singlePageTableCsv={singlePageTableCsv}
                    allPagesTableCsv={allPagesTableCsv}
                  />
                );
              },
              download: false,
              filterType: "textField",
              responsive: "standard",
              elevation: 0,
              serverSide: true,
              page: items.page,
              count: items.count,
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
                } else {
                  if (
                    filterList[changedColumnIndex][0] === undefined ||
                    type === "chip"
                  ) {
                    q = { ...querys };
                    delete q[changedColumn];
                  } else
                    q = {
                      ...querys,
                      [changedColumn]: filterList[changedColumnIndex][0],
                    };
                }
                setQuerys(q);
                history.replace(
                  `/leads/list?${Object.keys(q)
                    .map((key) => `${key}=${q[key]}`)
                    .join("&")}`
                );
              },
              rowsPerPage:
                querys.limit === undefined ? 10 : parseInt(querys.limit),
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (
                selectedRows,
                displayData,
                setSelectedRows
              ) => {
                return (
                  <BulkDelete
                    selectedRows={selectedRows}
                    displayData={displayData}
                    setSelectedRows={setSelectedRows}
                    items={items.results}
                    key={items.results}
                    history={history}
                    reRender={handleLoadingData}
                  />
                );
              },
              onTableChange: (action, tableState) => {
                switch (action) {
                  case "changePage":
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  case "filterChange":
                  //console.log(action, tableState)
                }
              },
              customFilterDialogFooter: (
                currentFilterList,
                applyNewFilters
              ) => {
                return (
                  <div style={{ marginTop: "40px" }}>
                    <Button
                      variant='contained'
                      onClick={() => handleFilterSubmit()}
                    >
                      Apply Filters
                    </Button>
                  </div>
                );
              },
              onRowsDelete: (data) => console.log(data),
              customSearchRender: (
                searchText,
                handleSearch,
                hideSearch,
                options
              ) => {
                return (
                  <Grow appear in={true} timeout={300}>
                    <TextField
                      variant='outlined'
                      size='small'
                      fullWidth
                      onChange={({ target: { value } }) => handleSearch(value)}
                      InputProps={{
                        style: {
                          paddingRight: 0,
                        },
                        startAdornment: (
                          <Icon className='mr-2' fontSize='small'>
                            search
                          </Icon>
                        ),
                        endAdornment: (
                          <IconButton onClick={hideSearch}>
                            <Icon fontSize='small'>clear</Icon>
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

export default Leads;
