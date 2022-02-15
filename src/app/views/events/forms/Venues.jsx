import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Card,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { SmartMUIDataTable } from "../../../components/SmartDataTable";
import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Venues = ({ className }) => {

  const [items, setItems] = useState([]);

  const columns = [
    {
      name: 'id', // field name in the row object
      label: '#', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: 'name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].title,
      },
    },
    {
      name: 'city', // field name in the row object
      label: 'City', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].city,
      },
    },
    {
      name: 'updated_at',
      label: 'Updated',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.updated_at ? dayjs(item.updated_at).fromNow(true) : '-'}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
  ]

  return (
    <Card container className={`p-4 ${className}`}>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
        The following venues were found in your eventbrite organization
      </Grid>
      <SmartMUIDataTable
          title="Your Venues"
          columns={columns}
          items={items}
          tableOptions={{
            selectableRows: false,
          }}
          search={async (querys) => {
            const { data } = await bc
              .events()
              .getAcademyVenues(querys);
            
            setItems(data);
            return data;
          }}
        />
    </Card>
  );
};

Venues.propTypes = {
  className: PropTypes.string,
};

Venues.defaultProps = {
  className: '',
};
