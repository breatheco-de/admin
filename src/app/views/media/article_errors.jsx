import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Tooltip,
  Avatar,
  Button,
  Grid,
} from "@material-ui/core";
import { Link } from 'react-router-dom';
import history from "history.js";
import bc from 'app/services/breathecode';
import { getSession } from '../../redux/actions/SessionActions';
import DowndownMenu from '../../components/DropdownMenu';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import { useQuery } from '../../hooks/useQuery';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import AddBulkToAssetError from './components/AddBulkToAssetError';
import { display } from "@mui/system";

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(relativeTime);

const statusColors = {
  resolved: 'text-white bg-green',
  delivered: 'text-white bg-warning',
  pending: 'text-white bg-error',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Board = () => {

  const [issueList, setIssueList] = useState([]);
  const [owner, setOwner] = useState(null);
  const [author, setAuthor] = useState(null);
  const [session] = useState(getSession());
  const query = useQuery();
  if (session?.academy?.timezone) dayjs.tz.setDefault(session.academy.timezone);

  useEffect(() => {
    let author_query = query.get('author');
    if(author_query) setAuthor({ email: author_query });

    let owner_query = query.get('owner');
    if(owner_query) setOwner({ email: owner_query });

  }, []);
  
  const handleBulkUpdate = (newStatus) => {
    // Logic to update the status of selected issues
  };

  const loadData = async (querys) => {
    // if(!querys.visibility) querys.visibility = "PRIVATE,PUBLIC,UNLISTED";
    const { data } = await bc.registry().getAssetErrors(querys);
    setIssueList(data.results || []);
    console.log("Got errors from database", data);
    return data;
  };

  const columns = [
    {
      name: 'slug', // field name in the row object
      label: 'Slug', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = issueList[dataIndex];

          return (
            <div>
              <p className="my-0 text-15">{item.slug}</p>
              <small className="text-muted">path: /{item.path}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        filterType: 'dropdown',
        // filterList: query.get('status') !== 'ERROR' ? [query.get('status')] : [],
        filterOptions: {
          names: ['ERROR', 'SOLVED', 'IGNORED'],
        },
        customBodyRenderLite: (dataIndex) => {
          const item = issueList[dataIndex];
            return (
            <div>
              <small className={`border-radius-4 p-1 ${statusColors[item.status == "ERROR" ? "resolved" : item.status == "SOLVED" ? "delivered" : "pending"]}`}>
              {item.status}
              </small>
              {item.status_text && (
              <Tooltip title={item.status_text}>
              <IconButton>
              <Icon>info</Icon>
              </IconButton>
              </Tooltip>
              )}
              <div>
                <small className="text-muted d-block m-0">{dayjs(item.created_at).fromNow()}</small>
                <small className="text-muted">{dayjs(item.created_at).format('DD-MM-YYYY hh:mm A')}</small>
              </div>
            </div>
            );
        },
      },
    },
    {
      name: 'asset',
      label: 'Asset',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const item = issueList[dataIndex];
            return (
            <div>
              {item.asset ? (
              <Link to={`/media/asset/${item.asset.slug}`} style={{ color: 'blue', textDecoration: 'underline', display: 'block' }}>
              {item.asset.title || item.asset.slug}
              </Link>
              ) : (
              <p>No asset associated</p>
              )}
              {item.asset_type && <small>Type: {item.asset_type}</small>}
            </div>
            );
        },
      },
    },
    // {
    //   name: 'action',
    //   label: ' ',
    //   options: {
    //     filter: false,
    //     customBodyRenderLite: (dataIndex) => {
    //       const item = issueList[dataIndex];
    //       //! TODO REVERT THIS BEFORE PUSHING
    //       return (
    //         <div className="flex items-center">
    //           <div className="flex-grow" />
    //           <Link to={`/media/asset/${item.asset.slug}#comment_bar=${item.id}`}>
    //             <Tooltip title="Go to asset">
    //               <IconButton>
    //                 <Icon>arrow_right_alt</Icon>
    //               </IconButton>
    //             </Tooltip>
    //           </Link>
    //         </div>
    //       );
    //     },
    //   },
    // },
  ];

  return (
    <div className="scrum-board m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <Grid item xs={12} sm={8}>
          <h3 className="my-0 font-medium text-28">Asset Error Log</h3>
        </Grid>
      </div>
      <div className="relative">
        <SmartMUIDataTable
          title="Asset Issues"
          columns={columns}
          selectableRows={true}
          items={issueList}
          view="?"
          singlePage=""
          historyReplace="/media/asset_errors"
          options={{
            onFilterChipClose: async (index, removedFilter, filterList) => {
              if (index === 1) setOwner(null);
              else if (index === 2) setAuthor(null);
              const querys = getParams();
              const { data } = await bc.registry().getAssetComments(querys);
              setIssueList(data.results);
            },
          }}
          search={loadData}
          deleting={async (querys) => {
            const { status } = await bc
              .registry()
              .deleteAssetErrorBulk(querys);
            return status;
          }}
          bulkActions={(props) => {
            return <AddBulkToAssetError
              items={issueList}
              loadData={loadData}
              {...props}
            />;
          }}
        />
      </div>
    </div>
  );
};

export default Board;