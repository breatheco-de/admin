import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Tooltip,
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
  pending: 'text-white bg-error',
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
            <div className="flex items-center">
              <div className="ml-3">
                <p className="my-0 text-15">{comment.text}</p>
                <ReactCountryFlag className="text-muted mr-2"
                  countryCode={comment?.asset?.lang?.toUpperCase()} svg 
                  style={{
                    fontSize: '10px',
                  }}
                />
                <small className="text-muted mr-2">{comment?.asset?.asset_type?.toLowerCase()}</small>
                {comment.asset.title ? 
                  <small className="text-muted">{comment.asset.title}</small>
                  :
                  <small className="text-muted">{comment?.asset.slug}</small>
                }
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
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${statusColors[item.resolved ? "resolved" : "pending"]}`}>
                  {item.resolved ? "resolved" : "pending"}
                </small>
              </div>
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
          <h3 className="my-0 font-medium text-28">Article Issues Pipeline</h3>
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
          title="All Assets"
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