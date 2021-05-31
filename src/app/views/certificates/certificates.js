import React, { useState, useEffect } from "react";
import { useQuery } from "../../hooks/useQuery";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "matx";
import { DownloadCsv } from "../../components/DownloadCsv";
import CustomToolbar from "../../components/CustomToolbar";
import axios from "../../../axios";
import MUIDataTable from "mui-datatables";
import {
  Avatar,
  Grow,
  Icon,
  IconButton,
  TextField,
  Button,
  Tooltip,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { MatxLoading } from "matx";

import bc from "../../services/breathecode";
import CustomToolbarSelect from "app/components/CustomToolbar";
import ResponseDialog from "./ResponseDialog";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const statusColors = {
  ERROR: "text-white bg-error",
  PERSISTED: "text-white bg-green",
  PENDING: "text-white bg-secondary",
};

const Certificates = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  let { cohortId } = useParams();

  const [table, setTable] = useState({
    count: 100,
    page: 0,
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
  const handleLoadingData = () => {
    setIsLoading(true);
    bc.certificates()
      .getAllCertificates({
        limit: queryLimit,
        offset: queryOffset,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (isAlive) {
          setItems(data.results);
          setTable({ count: data.count });
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
    return () => setIsAlive(false);
  };

  useEffect(() => {
    handleLoadingData();
  }, [isAlive]);

  const handlePageChange = (page, rowsPerPage, _like) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    setQueryLike(_like);
    let query = {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      like: _like,
    };
    bc.certificates()
      .getAllCertificates(query)
      .then(({ data }) => {
        setItems(data.results);
        setIsLoading(false);
        setTable({ count: data.count, page: page });
        history.replace(
          `/certificates?${Object.keys(query)
            .map((key) => key + "=" + query[key])
            .join("&")}`
        );
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      name: "specialty",
      label: "Specialty",
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].specialty?.name,
      },
    },
    {
      name: "user",
      label: "User",
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          return (
            <Link
              to={`/admissions/students/${
                items[i].user !== null ? items[i].user.id : ""
              }`}
            >
              {items[i] &&
                items[i].user.first_name + " " + items[i].user.last_name}
            </Link>
          );
        },
      },
    },
    {
      name: "status", // field name in the row object
      label: "Status", // column title that will be shown in table

      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRender: (value, tableMeta, updateValue) => {
          let item = items[tableMeta.rowIndex];
          return (
            <div className='flex items-center'>
              <div className='ml-3'>
                {item.status_text !== null ? (
                  <Tooltip title={item.status_text}>
                    <small
                      className={
                        "border-radius-4 px-2 pt-2px" + statusColors[value]
                      }
                    >
                      {value.toUpperCase()}
                    </small>
                  </Tooltip>
                ) : (
                  <small
                    className={
                      "border-radius-4 px-2 pt-2px" + statusColors[value]
                    }
                  >
                    {value.toUpperCase()}
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "expires_at",
      label: "Expires at",
      options: {
        filter: true,
        display: false,
        customBodyRenderLite: (i) => {
          let item = items[i];

          return (
            <div className='flex items-center'>
              <div className='ml-3'>
                <h5 className='my-0 text-15'>
                  {item.expires_at !== null
                    ? dayjs(item.expires_at).format("MM-DD-YYYY")
                    : "-"}
                </h5>
                <small className='text-muted'>
                  {item.expires_at !== null
                    ? dayjs(item.expires_at).format("MM-DD-YYYY")
                    : "-"}
                </small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "cohort", // field name in the row object
      label: "Cohort", // column title that will be shown in table
      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRender: (value, tableMeta, updateValue) => {
          let item = items[tableMeta.rowIndex];
          return (
            <Link to={"/admissions/cohorts/" + item.cohort.slug}>
              {value.name}
            </Link>
          );
        },
      },
    },
    {
      name: "preview_url",
      label: "Preview",
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          return (
            <div className='flex items-center'>
              <div className='flex-grow'></div>
              {items[i].preview_url !== null &&
              items[i].preview_url !== undefined ? (
                <>
                  <a
                    href={items[i].preview_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Tooltip
                      title={
                        items[i].preview_url !== null
                          ? "Preview Available"
                          : "Preview Not available"
                      }
                    >
                      <IconButton>
                        <Icon>image</Icon>
                      </IconButton>
                    </Tooltip>
                  </a>

                  <a
                    href={`https://certificate.breatheco.de/${items[
                      i
                    ].preview_url.slice(56)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Tooltip title='Image'>
                      <IconButton>
                        <Icon>search</Icon>
                      </IconButton>
                    </Tooltip>
                  </a>
                </>
              ) : null}
            </div>
          );
        },
      },
    },
  ];

  return (
    <div className='m-sm-30'>
      <div className='mb-sm-30'>
        <div className='flex flex-wrap justify-between mb-6'>
          <div>
            <Breadcrumb
              routeSegments={[{ name: "Certificates", path: "/certificates" }]}
            />
          </div>

          <div className=''>
            <Link
              to='/certificates/new/single'
              color='primary'
              className='btn btn-primary'
            >
              <Button
                style={{ marginRight: 5 }}
                variant='contained'
                color='primary'
              >
                Add studend certificate
              </Button>
            </Link>
            <Link
              to='/certificates/new/all'
              color='primary'
              className='btn btn-primary'
            >
              <Button variant='contained' color='primary'>
                Add cohort Certificates
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='overflow-auto'>
        <div className='min-w-750'>
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title={"All Certificates"}
            data={items}
            columns={columns}
            options={{
              customToolbar: () => {
                let singlePageTableCsv = `/v1/certificate/?limit=${queryLimit}&offset=${queryOffset}&like=${queryLike}`;
                let allPagesTableCsv = `/v1/certificate?like=${queryLike}`;
                return (
                  <DownloadCsv
                    singlePageTableCsv={singlePageTableCsv}
                    allPagesTableCsv={allPagesTableCsv}
                  />
                );
              },
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                return <CustomToolbar 
                          selectedRows={selectedRows} 
                          displayData={displayData} 
                          setSelectedRows={setSelectedRows} 
                          items={items} 
                          key={items} 
                          history={history}
                         />
              },
              filterType: "textField",
              responsive: "standard",
              // selectableRows: "none", // set checkbox for each row
              // search: false, // set search option
              // filter: false, // set data filter option
              download: false, // set download option
              // print: false, // set print option
              // pagination: true, //set pagination option
              viewColumns: true, // set column option
              elevation: 0,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (
                selectedRows,
                displayData,
                setSelectedRows
              ) => {
                return (
                  <CustomToolbar
                    selectedRows={selectedRows}
                    displayData={displayData}
                    setSelectedRows={setSelectedRows}
                    items={items}
                    key={items}
                    history={history}
                    id={"certificates"}
                    reRender={handleLoadingData}
                  />
                );
              },
              onTableChange: (action, tableState) => {
                switch (action) {
                  case "changePage":
                    handlePageChange(
                      tableState.page,
                      tableState.rowsPerPage,
                      queryLike
                    );
                    break;
                  case "changeRowsPerPage":
                    handlePageChange(
                      tableState.page,
                      tableState.rowsPerPage,
                      queryLike
                    );
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
                      variant='outlined'
                      size='small'
                      fullWidth
                      onKeyPress={(e) => {
                        if (e.key == "Enter") {
                          handlePageChange(
                            queryOffset,
                            queryLimit,
                            e.target.value
                          );
                        }
                      }}
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

export default Certificates;
