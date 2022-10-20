import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Card,
  TableCell,
} from '@material-ui/core';
import dayjs from 'dayjs';
import InfiniteScrollTable from '../../../components/InfiniteScrollTable';
import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Automations = ({ className }) => {
  const [automations, setAutomations] = useState([]);

  const columns = [
    {
      name: 'name',
      label: 'Name',
      customBodyRender: (item) => (
        <TableCell className="pl-0 capitalize" align="left">
          {item.name || item.slug} ({item.id})
        </TableCell>
      )
    },
    {
      name: 'stage',
      label: 'Stage',
      customBodyRender: (item) => (
        <TableCell className="pl-0 capitalize" align="left">
          {item.status}
        </TableCell>
      )
    }
  ];

  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Your automations</h4>
      </div>
      <Divider className="flex" />
      <Grid item md={12}>
        The following automations were found in active campaign
      </Grid>
      <Grid item md={12} className="mt-2">
        <InfiniteScrollTable
          items={automations}
          setItems={setAutomations}
          columns={columns}
          search={bc.marketing().getAcademyAutomations} 
        />
      </Grid>
    </Card>
  );
};

Automations.propTypes = {
  className: PropTypes.string,
};

Automations.defaultProps = {
  className: '',
};
