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
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
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
  const [session] = useState(getSession());
  if (session?.academy?.timezone) dayjs.tz.setDefault(session.academy.timezone);

  const columns = [
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const comment = issueList[dataIndex];
          return (
            <div>
                <p className="my-0 text-15">{comment.text}</p>
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
        filter: false,
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
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
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
              { label: 'Swich to: New Articles', value: 'new_articles'},
              { label: 'Swich to: Issues on previous articles', value: 'article_issues'}
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
          historyReplace="/assets"
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