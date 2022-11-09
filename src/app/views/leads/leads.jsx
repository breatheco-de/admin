import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Chip, IconButton } from '@material-ui/core';
import ArrowUpwardRounded from '@material-ui/icons/ArrowUpwardRounded';
import { SmartMUIDataTable, getParams } from 'app/components/SmartDataTable';
import { Breadcrumb } from 'matx';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import axios from '../../../axios';
import { useQuery } from '../../hooks/useQuery';
import config from '../../../config.js';
import bc from '../../services/breathecode';
import AlertAcademyAlias from 'app/components/AlertAcademyAlias';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  REQUESTED: 'default',
  PENDING: 'secondary',
  ERROR: 'secondary',
  PERSISTED: 'primary',
  IGNORE: 'default',
  DUPLICATED: 'default',
};

const defaultBg = 'bg-gray';

const Leads = () => {
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const query = useQuery();

  useEffect(() => {
    let slugs = query.get('tags');
    if(slugs) {
      const tagsSlugs = slugs.split(',').map((c) => {
        return { slug: c }
      });
      setTags(tagsSlugs);
    }
  }, []);

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const lead = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {`${lead.first_name} ${lead.last_name}`}
              </h5>
              <small className="text-muted">{lead?.email || lead.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'course',
      label: 'Course',
      options: {
        display: false,
        filter: false,
        filterList: query.get('course') !== null ? [query.get('course')] : [],
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{items[dataIndex].course}</span>
        ),
      },
    },
    {
      name: 'utm_campaign',
      label: 'UTM Campaign',
      options: {
        display: false,
        filterList: query.get('utm_campaign') !== null ? [query.get('utm_campaign')] : [],
        customBodyRenderLite: (dataIndex) => (
          <div className="text-center">
            <h5 className="my-0 text-15">
              {items[dataIndex].utm_campaign || 'None'}
            </h5>
            <small className="text-muted">
              {items[dataIndex].utm_content || 'No Content'}
            </small>
          </div>
        ),
      },
    },
    {
      name: 'utm_medium',
      label: 'UTM Medium',
      options: {
        display: 'excluded',
        filterList: query.get('utm_medium') !== null ? [query.get('utm_medium')] : [],
      },
    },
    {
      name: 'storage_status',
      label: 'Lead Status',
      options: {
        filterList:
          query.get('storage_status') !== null ? [query.get('storage_status')] : [],
        filterType: "dropdown",
        filterOptions: {
          names: ['PENDING', 'PERSISTED', 'DUPLICATED', 'ERROR']
        },
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <Tooltip title={items[dataIndex]?.storage_status_text}>
              <Chip color={statusColors[items[dataIndex]?.storage_status]} className="pointer" size="small" label={items[dataIndex]?.storage_status} />
            </Tooltip>
          </div>
        ),
      },
    },
    {
      name: 'utm_url',
      label: 'Utm URL',
      options: {
        filterList: query.get('utm_url') !== null ? [query.get('utm_url')] : [],
        customBodyRenderLite: (dataIndex) => (
          <div>
            {/* <div className="flex items-center flex-column"> */}
            <Tooltip
              title={items[dataIndex].utm_url
                ? items[dataIndex].utm_url
                : '---'}
            >
              <span className="ellipsis">
                {items[dataIndex].utm_url
                  ? items[dataIndex].utm_url
                  : '---'}
              </span>
            </Tooltip>

            {/* </div> */}
            <div className="flex justify-around items-center">
              <small className={`text-muted`}>
                {items[dataIndex].utm_medium
                  ? items[dataIndex].utm_medium
                  : '---'}
              </small>
              <small className={`text-muted`}>
                {items[dataIndex].utm_source
                  ? items[dataIndex].utm_source
                  : '---'}
              </small>
            </div>
          </div>

        ),
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      options: {
        filter: true,
        // filterType: 'multiselect',
        filterType: 'custom',
        filterList: query.get('tags') !== null ? [query.get('tags')] : [],
        filterOptions: {
          display: (filterList, onChange, index, column) => {
            return (
              <div>
                <AsyncAutocomplete
                  onChange={(newTag) => {
                    setTags(newTag);
                    const slugs = newTag.map((i) => i.slug).join(',');

                    if (slugs !== '') filterList[index][0] = slugs;
                    else filterList[index] = []
                    onChange(filterList[index], index, column);
                  }}
                  value={tags}
                  size="small"
                  label="Tags"
                  debounced
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.slug}`}
                  multiple={true}
                  asyncSearch={(searchTerm) => axios.get(`${config.REACT_APP_API_HOST}/v1/marketing/academy/tag?like=${searchTerm}`)}
                />
              </div>
            );
          }
        },
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">
            {items[dataIndex].tags
              ? items[dataIndex].tags
              : '---'}
          </span>
        ),
      },
    },
    {
      name: 'created_at',
      label: 'Created At',
      options: {
        filter: false,
        filterList:
          query.get('created_at') !== null ? [query.get('created_at')] : [],
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {dayjs(items[i].created_at).format('MM-DD-YYYY')}
              </h5>
              <small className="text-muted">
                {dayjs(items[i].created_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
  ];

  const SendCRM = ({ ids, setSelectedRows }) => {

    //find the elements in the array
    const positions = ids.map((id) => {
      return items.map((e) => { return e.id; }).indexOf(id);
    });

    let notPending = false;

    //check if all of them are pending
    for (let i = 0; i < positions.length; i++) {
      if (items[positions[i]].storage_status !== 'PENDING') {
        notPending = true;
        break;
      }
    }

    return (
      <div>
        <Tooltip title={!notPending ? "Send to CRM" : "Select Pending leads only"}>
          <IconButton
          // disabled={notPending}
          >
            <ArrowUpwardRounded
              onClick={async () => {
                if (!notPending) {
                  const { data } = await bc.marketing()
                    .bulkSendToCRM(ids);
                  setSelectedRows([]);
                  return data;
                }
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Pages', path: '/leads/list' },
                { name: 'Order List' },
              ]}
            />
          </div>
          <div className="">
            <Link
              to="/growth/sales/new"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Add new lead
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <AlertAcademyAlias />
      <div>
        <SmartMUIDataTable
          title="All Leads"
          columns={columns}
          items={items}
          view="leads?"
          singlePage=""
          historyReplace="/growth/leads"
          options={{
            print: false,
            onFilterChipClose: async (index, removedFilter, filterList) => {
              if (index === 6) setTags([]);
              const querys = getParams();
              const { data } = await bc.marketing().getAcademyLeads(querys);
              setItems(data.results);
            },
          }}
          search={async (querys) => {
            const { data } = await bc.marketing()
              .getAcademyLeads(querys);
            setItems(data.results);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc
              .admissions()
              .deleteLeadsBulk(querys);
            return status;
          }}
          bulkActions={SendCRM}
        />
      </div>
    </div>
  );
};

export default Leads;
