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
import ReactCountryFlag from "react-country-flag"
import { getSession } from '../../redux/actions/SessionActions';
import DowndownMenu from '../../components/DropdownMenu';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import { useQuery } from '../../hooks/useQuery';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(tz);
dayjs.extend(utc);

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
  
  const columns = [
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const comment = issueList[dataIndex];
          const text = comment.text.split(/\r?\n|\r|\n/g) || [];

          return (
            <div>
              <p className="my-0 text-15">{Array.isArray(text) ? text[0] : ""}</p>
              {comment.asset.title ?
                <small className="text-muted">{comment.asset.title}</small>
                :
                <small className="text-muted">{comment?.asset.slug}</small>
              }
            </div>
          );
        },
      },
    },
    {
      name: 'owner', // field name in the row object
      label: 'Owner', // column title that will be shown in table
      options: {
        filter: true,
        filterType: 'custom',
        filterList: query.get('owner') !== null ? [query.get('owner')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <AsyncAutocomplete
                  onChange={(userData) => {
                    setOwner(userData)
                    if (userData) filterList[index][0] = userData.email;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  size="small"
                  value={owner}
                  label="Owner"
                  debounced
                  renderOption={(option) => (
                    `${option.first_name} ${option.last_name}, (${option.email})`
                  )}
                  getOptionLabel={(option) => option.email}
                  filterOptions={(options) => options}
                  getOptionSelected={(option, value) => option.email === value.email}
                  asyncSearch={(searchTerm) => bc.auth().getAllUsers({ like: searchTerm || '' })}
                />
              </div>
            );
          }
        },
        customBodyRenderLite: (dataIndex) => {
          const { owner, ...rest } = issueList[dataIndex];
          if (!owner) return <div>
            <small className="bg-warning text-white p-1 border-radius-4">Pending assignment</small>
          </div>;

          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={owner?.profile?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {owner !== null ? name(owner) : `${rest.first_name} ${rest.last_name}`}
                </h5>
                <small className="text-muted">{owner?.email || rest.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'author', // field name in the row object
      label: 'Author', // column title that will be shown in table
      options: {
        display: 'excluded',
        filter: true,
        filterType: 'custom',
        filterList: query.get('author') !== null ? [query.get('author')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <AsyncAutocomplete
                  onChange={(userData) => {
                    setAuthor(userData)
                    if (userData) filterList[index][0] = userData.email;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  size="small"
                  value={author}
                  label="Author"
                  debounced
                  filterOptions={(options) => options}
                  renderOption={(option) => (
                    `${option.first_name} ${option.last_name}, (${option.email})`
                  )}
                  getOptionLabel={(option) => option.email}
                  getOptionSelected={(option, value) => option.email === value.email}
                  asyncSearch={(searchTerm) => bc.auth().getAllUsers({ like: searchTerm || '' })}
                />
              </div>
            );
          }
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = issueList[dataIndex];
          return (
            <div>
              <small className={`border-radius-4 p-1 ${statusColors[item.resolved ? "resolved" : item.delivered ? "delivered" : "pending"]}`}>
                {item.resolved ? "resolved" : item.delivered ? "delivered" : "pending"}
              </small>
            </div>
          );
        },
      },
    },
    {
      name: 'delivered',
      options: {
        display: 'excluded',
        filter: true,
        filterType: 'dropdown',
        filterList: query.get('delivered') !== null ? [query.get('delivered')] : [],
        filterOptions: {
          names: ['true', 'false',],
        },
      },
    },
    {
      name: 'resolved',
      options: {
        display: 'excluded',
        filter: true,
        filterType: 'dropdown',
        filterList: query.get('resolved') !== null ? [query.get('resolved')] : [],
        filterOptions: {
          names: ['true', 'false',],
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = issueList[dataIndex];
          //! TODO REVERT THIS BEFORE PUSHING
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/media/asset/${item.asset.slug}#comment_bar=${item.id}`}>
                <Tooltip title="Go to asset">
                  <IconButton>
                    <Icon>arrow_right_alt</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div className="scrum-board m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <Grid item xs={12} sm={8}>
          <h3 className="my-0 font-medium text-28">Asset Issues Pipeline</h3>
        </Grid>

        <Grid item xs={6} sm={4} align="right">
          <DowndownMenu
            options={[
              { label: 'Swich to: New Articles', value: 'new_articles' },
              { label: 'Swich to: Issues on previous articles', value: 'article_issues' }
            ]}
            icon="more_horiz"
            onSelect={({ value }) => history.push(`./${value}`)}
          >
            <Button variant="contained" color="primary">
              Switch to another Pipeline
            </Button>
          </DowndownMenu>
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
          historyReplace="/media/article_issues"
          options={{
            onFilterChipClose: async (index, removedFilter, filterList) => {
              if (index === 1) setOwner(null);
              else if (index === 2) setAuthor(null);
              const querys = getParams();
              const { data } = await bc.registry().getAssetComments(querys);
              setIssueList(data.results);
            },
          }}
          search={async (querys) => {
            // if(!querys.visibility) querys.visibility = "PRIVATE,PUBLIC,UNLISTED";
            const { data } = await bc.registry().getAssetComments(querys);
            setIssueList(data.results);
            return data;
          }}
          deleting={async (querys) => {
            // const { status } = await bc
            //   .admissions()
            //   .deleteStaffBulk(querys);
            // return status;
          }}
        />
      </div>
    </div>
  );
};

export default Board;