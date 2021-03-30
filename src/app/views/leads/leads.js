import React,{useState, useEffect} from "react";
import { Grow, Icon, IconButton, TextField } from "@material-ui/core";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import bc from "../../services/breathecode";
import dayjs from "dayjs";
import { useQuery } from '../../hooks/useQuery';
import {useHistory} from 'react-router-dom';

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const stageColors = {
  'google': 'bg-gray',
  'facebook': 'bg-secondary',
  'coursereport': 'text-white bg-warning',
  'ActiveCampaign': 'text-white bg-error',
  'bing':'text-white bg-green'
}

const Leads = () => {
  const [items, setItems] = useState([]);
  const [isAlive, setIsAlive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [querys, setQuerys] = useState({});
  const query = useQuery();
  const history = useHistory();

  useEffect(()=>{
    setIsLoading(true);
    bc.marketing().getAcademyLeads().
    then(({data}) =>{
      setIsLoading(false);
      if (isAlive){ 
        setItems(data);
      };
    })
    .catch(error => setIsLoading(false)) 
    return () => setIsAlive(false);
  },[])
  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].id}</span>
        ),
      },
    },
    {
      name: "location",
      label: "Location",
      options: {
        filter: true,
        filterType: "multiselect",
        filterList:query.get("location") !== null ? [query.get("location")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].location}</span>
        ),
      },
    },
    {
      name: "course",
      label: "Course",
      options: {
        filterList:query.get("course") !== null ? [query.get("course")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].course !== null ? items[dataIndex].course !== null : "---"}</span>
        ),
      },
    },
    {
      name: "utm_medium",
      label: "Utm Medium",
      options: {
        filterList:query.get("utm_medium") !== null ? [query.get("utm_medium")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].utm_medium !== null ? items[dataIndex].utm_medium: "---"}</span>
        ),
      },
    },
    {
      name: "utm_source",
      label: "Utm Source",
      options: {
        filter: true,
        filterType: "multiselect",
        filterList:query.get("utm_source") !== null ? [query.get("utm_source")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className={`ellipsis ${stageColors[items[dataIndex].utm_source]} border-radius-4 px-2 pt-2px text-center`} >{items[dataIndex].utm_source !== null ? items[dataIndex].utm_source: "---"}</span>
        ),
      },
    },
    {
      name: "tags",
      label: "Tags",
      options: {
        filter: true,
        filterType: "multiselect",
        filterList:query.get("tags") !== null ? [query.get("tags")] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].tags}</span>
        ),
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
        filterList:query.get("created_at") !== null ? [query.get("created_at")] : [],
        customBodyRenderLite: i =>
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(items[i].created_at).format("MM-DD-YYYY")}</h5>
              <small className="text-muted">{dayjs(items[i].created_at).fromNow()}</small>
            </div>
          </div>
      },
    }
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "Order List" },
          ]}
        />
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <MUIDataTable
            title={"All Orders"}
            data={items}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              elevation: 0,
              onFilterChange: (changedColumn, filterList, type, changedColumnIndex) => {
                let q = { [changedColumn]: filterList[changedColumnIndex][0]}
                setQuerys(q)
                history.replace(`/leads/list?${Object.keys(q).map(key => `${key}=${q[key]}`).join('&')}`)
              },
              rowsPerPageOptions: [10, 20, 40, 80, 100],
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

export default Leads;
