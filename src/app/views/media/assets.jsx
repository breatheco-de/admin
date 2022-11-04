import {
  Avatar, Button, Icon,Chip,
  IconButton, Tooltip, TableCell,
} from '@material-ui/core';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import bc from 'app/services/breathecode';
import ReactCountryFlag from "react-country-flag"
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../../../config.js';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import { useQuery } from '../../hooks/useQuery';
import axios from '../../../axios';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const stageColors = {
  PUBLIC: 'default',
  PUBLISHED: 'primary',
  OK: 'primary',
  DRAFT: 'default',
  PRIVATE: 'secondary',
  ERROR: 'secondary',
  UNLISTED: 'default',
  WRITING: 'secondary',
  WARNING: 'secondary',
  UNASSIGNED: 'secondary',
  null: 'secondary',
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'bg-secondary text-dark',
  ACTIVE: 'text-white bg-green',
  INNACTIVE: 'text-white bg-error',
};

function ext(url) {
  if (!url) return ".empty"
  return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
}

const Assets = () => {
  const [assetList, setAssetList] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const query = useQuery();

  useEffect(() => {
    let slugs = query.get('keywords');
    if(slugs) {
      const keywordsSlugs = slugs.split(',').map((c) => {
        return { slug: c }
      });
      setKeywords(keywordsSlugs);
    }
  }, []);

  const columns = [
    {
      name: 'title', // field name in the row object
      label: 'Title', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const asset = assetList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <ReactCountryFlag className="text-muted mr-2"
                  countryCode={asset.lang?.toUpperCase()} svg
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
        display: true,
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = assetList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Chip size="small" className="mr-2" label={item?.status} color={stageColors[item?.status]} />
                <Chip size="small" label={item?.visibility} color={stageColors[item?.visibility]} />
                <p className="p-0 m-0"><small className={`border-radius-4 px-2 pt-2px ${statusColors[item.status]}`}>
                  {item.category ? item.category.slug : "No category assigned"}
                </small></p>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'keywords',
      label: 'Keywords',
      options: {
        filter: true,
        display: false,
        filterType: 'custom',
        filterList: query.get('keywords') !== null ? [query.get('keywords')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <AsyncAutocomplete
                  onChange={(newKeywords) => {
                    setKeywords(newKeywords);
                    const slugs = newKeywords.map((i) => i.seo_keywords.map((x) => x.slug).join(',')).join(',');
                    if (slugs !== '') filterList[index][0] = slugs;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  value={keywords}
                  size="small"
                  label="Keywords"
                  debounced
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.title}`}
                  multiple={true}
                  asyncSearch={async (searchTerm) => await axios.get(`${config.REACT_APP_API_HOST}/v1/registry/academy/asset?keywords=${searchTerm}`)}
                />
              </div>
            );
          }
        },
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {assetList[dataIndex].tags
              ? assetList[dataIndex].tags
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'tests',
      label: 'Tests',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = assetList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <Chip size="small" className="mr-2" label={"Sync: "+item?.sync_status} color={stageColors[item?.sync_status]} />
                <Chip size="small" label={"Test: "+item?.test_status?.substring(0,5)} color={stageColors[item?.test_status]} />
              </div>
            </div>
            );
          }
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
                <a target="_blank" rel="noopener noreferrer" href={`${config.REACT_APP_API_HOST}/v1/registry/asset/preview/${item.slug}`}>
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
          historyReplace="/media/asset"
          options={{
            print: false,
            onFilterChipClose: async (index, removedFilter, filterList) => {
              if (index === 6) setKeywords([]);
              const querys = getParams();
              const { data } = await bc.registry().getAllAssets(querys);
              setAssetList(data.results);
            },
          }}
          search={async (querys) => {
            if (!querys.visibility) querys.visibility = "PRIVATE,PUBLIC,UNLISTED";
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
