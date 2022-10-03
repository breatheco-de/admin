import React, { useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  Card,
  Tooltip,
} from "@material-ui/core";
import { SmartMUIDataTable } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import dayjs from 'dayjs';
import config from '../../../../config.js';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

export const Tags = ({ organization }) => {
  const [items, setItems] = useState([]);
  

  const columns = [
    {
      name: 'slug', // field name in the row object
      label: 'slug', // column title that will be shown in table
      options: {
        filter: true,
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
              <div className="ml-3">
                {item.disputed_at ? (
                  <Tooltip title={item.disputed_reason}>
                    <small className={`border-radius-4 px-2 pt-2px text-white bg-error`}>
                      DISPUTED
                    </small>
                  </Tooltip>
                ) : (
                  <small className={`border-radius-4 px-2 pt-2px${statusColors[value]}`}>
                    APPROVED
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'created_at',
      label: 'Date',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];

          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.updated_at ? `${dayjs(item.updated_at).fromNow(true)} ago` : '-'}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
  ]

  return (
    <Card container className="p-4">
      <SmartMUIDataTable
        title="All Tags"
        columns={columns}
        items={items}
        options={{
          selectableRows: false
        }}
        search={async (querys) => {
          const { data } = await bc.marketing().getAcademyTags(querys);
          setItems(data.results || data);
          return data;
        }}
      />
    </Card>
  );
};
