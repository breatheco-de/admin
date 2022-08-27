import {
  Avatar, Button, Icon,
  IconButton, Tooltip, TableCell,
} from '@material-ui/core';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import ReactCountryFlag from "react-country-flag"
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'bg-secondary text-dark',
  ACTIVE: 'text-white bg-green',
  INNACTIVE: 'text-white bg-error',
};

function ext(url) {
  return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
}

const Assets = () => {
  const [assetList, setAssetList] = useState([]);

  const columns = [
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const asset = assetList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <ReactCountryFlag className="text-muted mr-2"
                  countryCode={asset.lang.toUpperCase()} svg 
                  style={{
                    fontSize: '10px',
                  }}
                />
                <small className="text-muted capitalize">{asset.asset_type.toLowerCase()}</small>
                <small className="text-muted">{ext(asset.readme_url)}</small>
                <h5 className="my-0 text-15">{asset.title}</h5>
                <small className="text-muted">{asset.slug}</small>
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
          const item = assetList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${statusColors[item.status]}`}>
                  {item.status.toUpperCase()}
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
          const item = assetList[dataIndex];
          //! TODO REVERT THIS BEFORE PUSHING
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/media/asset/${item.slug}`}>
                <Tooltip title="Edit">
                  <IconButton>
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Open">
                <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_HOST}/v1/registry/asset/preview/${item.slug}`}>
                  <IconButton>
                    <OpenInBrowser />
                  </IconButton>
                </a>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Assets', path: '/media/asset' }, { name: 'Asset' }]} />
          </div>

          <div className="">
            <Link to="/media/asset/new">
              <Button variant="contained" color="primary">
                Add new asset
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Assets"
          columns={columns}
          selectableRows={true}
          items={assetList}
          view="?"
          singlePage=""
          historyReplace="/assets"
          search={async (querys) => {
            if(!querys.visibility) querys.visibility = "PRIVATE,PUBLIC,UNLISTED";
            const { data } = await bc.registry().getAllAssets(querys);
            setAssetList(data.results);
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

export default Assets;
