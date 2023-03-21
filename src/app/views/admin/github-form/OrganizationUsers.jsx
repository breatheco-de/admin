import React, { useState } from "react";
import {
  Grid,
  Icon,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlineRounded from '@material-ui/icons/DeleteOutlineRounded';
import AlarmOffRounded from '@material-ui/icons/AlarmOffRounded';
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import BulkAction from "./BulkAction"
import bc from '../../../services/breathecode';
import dayjs from 'dayjs';
import config from '../../../../config.js';
import { faLastfmSquare } from "@fortawesome/free-brands-svg-icons";

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  SYNCHED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

const RenderTooltip = ({user}) => {
  return <ul class="p-0 m-0 no-list-style" style={{width: "300px"}}>
    {user.storage_log.map(l => <li>
      <small style={{width: "250px"}}>{l.msg} on {dayjs(l.at).format('MMM D')}</small>
    </li>
    )}
  </ul>
}

const getStatus = (u) => {
  let message = '';
  if(u.storage_status == 'PENDING'){
    return 'Pending to '+u.storage_action.toLowerCase()
  }
  else if(u.storage_status == 'ERROR'){
    return 'Error during '+u.storage_action.toLowerCase()
  }
  else if(u.storage_status == 'UNKNOWN'){
    return 'Needs specification'
  }
  else if(u.storage_status == 'SYNCHED'){
    let action = u.storage_action.toLowerCase()
    return action[0].toUpperCase() + action.substring(1) + 'ed'
  }
  return u.storage_status + " -> " + u.storage_action
}

const OrganizationUsers = ({ organization }) => {
  const [items, setItems] = useState([]);
  

  const columns = [
    {
      name: 'name', // field name in the row object
      label: 'Full Name name', // column title that will be shown in table
      options: {
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div>
              {item.user !== null && <h5 className="mb-0"><Link to={"/admissions/students/"+item.user.id}>{item.user.first_name + " " + item.user.last_name}</Link></h5>}
              <small>{item.username}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div className="flex items-center">
              <Tooltip title={<RenderTooltip user={item} />}>
                <small className={`border-radius-4 px-2 pt-2px${statusColors[item.storage_status]}`}>
                  {getStatus(item)}
                </small>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ]

  const loadData = async (querys=null) => {
    if(!querys) querys = window.location.search;

    const { data } = await bc.auth().getGithubUsers(querys);
    const _results = data.results || data;
    if (Array.isArray(_results)) setItems(_results);
    return data;
  }

  return (
    <Grid item md={12} className="mt-2">
        <SmartMUIDataTable
            title="All Github Organization Users"
            columns={columns}
            items={items}
            options={{
              print: false,
              search: true,
              filter: false,
              download: false,
              viewColumns: false,
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                return (
                  <div className='ml-auto'>
                    <BulkAction
                      title="Add users to Github"
                      iconComponent={AddCircleOutlineIcon}
                      onConfirm={(ids) => 
                        bc.auth().updateGithubUser(ids,{ storage_action: 'ADD' })
                          .then(() => loadData())
                      }
                      selectedRows={selectedRows}
                      items={items}
                    />
                    <BulkAction
                      title="Delete users from Github"
                      iconComponent={DeleteOutlineRounded}
                      onConfirm={(ids) => 
                        bc.auth().updateGithubUser(ids,{ storage_action: 'DELETE' })
                          .then(() => loadData())
                      }
                      selectedRows={selectedRows}
                      items={items}
                    />
                    <BulkAction
                      title="Ignore Github user"
                      iconComponent={AlarmOffRounded}
                      onConfirm={(ids) => 
                        bc.auth().updateGithubUser(ids,{ storage_action: 'IGNORE' })
                          .then(() => loadData())
                      }
                      selectedRows={selectedRows}
                      items={items}
                    />
                  </div>);
              }
            }}
            search={loadData}
        />
    </Grid>
  );
};
export default OrganizationUsers;