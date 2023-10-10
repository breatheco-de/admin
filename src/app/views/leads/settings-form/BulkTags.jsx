import React, { useState, useEffect } from "react";
import {

  Card,
   Icon,IconButton
} from "@material-ui/core";
import dayjs from "dayjs";
import { SmartMUIDataTable } from "../../../components/SmartDataTable";
import bc from "../../../services/breathecode";
import { useQuery } from "../../../hooks/useQuery";



const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: "bg-danger text-white",
  DONE: "text-white bg-green",
  PENDING: "bg-warning text-dark",
};


export const BulkTags = (props) => {
  const query = useQuery();
  const [bulkItems, setBulkItems] = useState([]);
 
  const [isHovering, setIsHovering] = useState(-1);

  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const loadBulkData = async () => {

    const { data } = await bc.monitoring().get_bulk_upload();
    let dataSorted = data.reverse();
    setBulkItems(dataSorted);
    return data;
  };
  

  
  const columns = [
    {
      name: "file name", // field name in the row object
      label: "File Name", // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = bulkItems[dataIndex];
         

          return (
            <>
              <div className="text-center">
                <p className="mb-1">{item.name} </p>
              </div>
            </>
          );
        },
      },
    },
    {
      name: "status", // field name in the row object
      label: "Status", // column title that will be shown in table
      options: {
        filter: true,
        filterType: "dropdown",
        filterList: query.get("status") !== null ? [query.get("status")] : [],
        filterOptions: {
          names: ["APROVED", "DISPUTED"],
        },
        customBodyRender: (value, tableMeta) => {
          const item = bulkItems[tableMeta.rowIndex];
      
          return (
            <div className="flex items-center">
              <div
                className="ml-3"
                onMouseOver={() => setIsHovering(tableMeta.rowIndex)}
                onMouseOut={() => setIsHovering(-1)}
              >
                <small
                  className={`border-radius-4 px-2 py-1 ${statusColors[value]}`}
                >
                  {item.status}
                </small>
                {isHovering == tableMeta.rowIndex  ? <small
                  className={`border-radius-4 px-2 py-1 `}
                >
                  {item.status_message ? item.status_message : "no status message"}
                </small> : ""}
                                
              </div>
            </div>
          );
        },
      },
    },

    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: false,
        customBodyRenderLite: (i) => {
          const item = bulkItems[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.created_at
                    ? dayjs(item.created_at).format("MM-DD-YYYY")
                    : "--"}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "Download file",
      label: "Download file",
      options: {
        filter: false,
        customBodyRenderLite: (i) => {
          const item = bulkItems[i];
          
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  <a href={item.url}>
                     <IconButton size="small" variant="outlined">
                          <Icon>download</Icon>
                     </IconButton>

                  </a>
                </h5>
              </div>
            </div>
          );
        },
      },
    },
  ];


  let bulkStatus = sessionStorage.getItem('bulkStatus');

  useEffect(() => {
    if(bulkStatus){
      loadBulkData();
      sessionStorage.setItem('bulkStatus', false);
    }
  }, [bulkStatus]);
  
  useEffect(() => {

      loadBulkData();
  }, []);

  



  return (
    <Card container className="p-4">
     
  
      <SmartMUIDataTable
        title="Your recent uploads:"
        columns={columns}
        items={bulkItems}
      
        options={{
          print: false,
          viewColumns: false,
          search: false,
          filter: false,
          customToolbar:false
        }}
        singlePage=""
      
      //  page crashes when search prop is deleted
        search={async (querys) => {
          const { data } = await bc.auth().getAcademyStudents(querys);
          
          return data;
        }}
      />
    </Card>
  );
};
