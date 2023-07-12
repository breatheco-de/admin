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
import ConfirmAlert from '../../../components/ConfirmAlert';
import BulkAction from "./BulkAction"
import bc from '../../../services/breathecode';
import dayjs from 'dayjs';
import config from '../../../../config.js';
import { faLastfmSquare } from "@fortawesome/free-brands-svg-icons";
import { PickCohortUserModal } from "./PickCohortUserModal";
import {CopyDialog} from "../../../components/CopyDialog"
import HelpIcon from '../../../components/HelpIcon';

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
  const [ userToAdd, setUserToAdd] = useState(false);
  const [ confirm, setConfirm] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);

  const syncOrganizationUsers = async () => {
    const { data } = await bc.auth().syncOrganizationUsers();
  }

  const columns = [
    {
      name: 'name', // field name in the row object
      label: 'Full Name name', // column title that will be shown in table
      options: {
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div>
              {item.user !== null ? 
                <h5 className="mb-0"><Link to={"/admissions/students/"+item.user.id}>{(item.user.first_name && item.user.first_name != '') ? item.user.first_name + " " + item.user.last_name : item.user.email}</Link></h5>
                :
                <h5 className="mb-0 text-danger">Not a 4Geeks user<HelpIcon message={`This user was found on github organization but no matching user was found on 4Geeks.com platform`} /></h5>
              }
              {item.github ? 
                <small className="px-1 py-2px bg-light-green text-green border-radius-4">{item.github.username}</small> 
                : item.username ? <>
                  <small className="bg-warning px-1 border-radius-4">Backup github found: {item.username}</small> 
                  <HelpIcon message={`User has no github connected but we found a username, probably from a previous connection. We can work with this username but its recommended to ask user to re-connect.`} />
                </>
                : <>
                  <small className="bg-danger px-1 border-radius-4">No username found</small>
                  <HelpIcon message={`User needs to connect github`} />
                </>}
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
    {
      name: 'invite_url', // field name in the row object
      label: 'Invite URL', // column title that will be shown in table
      options: {
        customBodyRender: (value, tableMeta) => {
          const item = items[tableMeta.rowIndex];
          console.log("item", item)
          return (
            <div className="flex items-center">
              {item.storage_action == 'ADD' && item.storage_status == 'SYNCHED' &&
                <Tooltip title={`Copy Invite URL`}>
                  <IconButton onClick={() => setCopyDialog(true)}>
                    <Icon>assignment</Icon>
                  </IconButton>
                  </Tooltip>
              }
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

  const addToOrganization = async (cu) => {
    if(!cu) return false;

    const result = await bc.auth().addGithubUser({ cohort: cu.cohort.id, user: cu.user.id });
    if(result.status == 200){
      setConfirm(true);
    }
    setUserToAdd(false);
    loadData();
  }

  return (
    <Grid item md={12} className="mt-2">
      <ConfirmAlert
        title={`User has been added to the invite queue. Keep in mind that invites are not sent in real time, instead, they are sent at 2AM UTC. Make sure the student has connected its GitHub account by then.`}
        isOpen={confirm}
        cancelText="I understand invites are processed later in batch"
        onOpen={() => setConfirm(false)}
      />
      { userToAdd == true && <PickCohortUserModal 
        cohortQuery={{ stage: 'STARTED,PREWORK' }} 
        cohortUserQuery={{ educational_status:'ACTIVE' }} 
        onClose={(_cu) => addToOrganization(_cu)}
      />}
        <div className="text-right">
          <Button variant="contained" color="primary" onClick={() => setUserToAdd(true)}>
            Add to the Github Organization
          </Button>
        </div>
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
              customToolbar: () => {
                return <Tooltip title={`Sync organization users`}>
                  <IconButton onClick={() => syncOrganizationUsers()}>
                    <Icon>refresh</Icon>
                  </IconButton>
                </Tooltip>;
              },
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
        <CopyDialog
            title={`Share the following invite URL with the student`}
            label={"URL"}
            value={`https://github.com/orgs/4GeeksAcademy/invitation`}
            isOpened={copyDialog}
            onClose={() => setCopyDialog(false)}
          />
    </Grid>
  );
};
export default OrganizationUsers;