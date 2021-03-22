import React,{useState, useEffect} from "react";
import { Grow, Icon, IconButton, TextField, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import bc from "../../services/breathecode";
import dayjs from "dayjs";

let relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const Leads = () => {
  const [items, setItems] = useState([]);
  useEffect(()=>{
    bc.marketing().getAcademyLeads().
    then(({data}) => setItems(data))
    .catch(error => error) 
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
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
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
