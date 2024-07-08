import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Button,
  Card,
  Tooltip,
  Icon,
  IconButton,
  TextField,
  TableCell,
} from '@material-ui/core';
import dayjs from 'dayjs';
import InfiniteScrollTable from '../../../components/InfiniteScrollTable';
import { getParams } from '../../../components/SmartDataTable';
import bc from '../../../services/breathecode';
import { getSession } from '../../../redux/actions/SessionActions';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

export const Automations = ({ className }) => {
  const [automations, setAutomations] = useState([]);
  const [chooseSlug, setChooseSlug] = useState(null);

  const saveSlug = async () => {
    const data = await bc.marketing().updateAcademyAutomation(chooseSlug.id, {
      'slug': chooseSlug.slug,
    });
    if(data.status === 200){
      setAutomations(automations.map(a => a.id == chooseSlug.id ? ({ ...a, slug: chooseSlug.slug }) : a))
      setChooseSlug(null);
    }
  }

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
    },
    {
      name: 'slug',
      label: 'Slug',
      customBodyRender: (item) => (
        <TableCell className="pl-0 capitalize" align="left">
          {chooseSlug && chooseSlug.id == item.id ?
            <Grid item className="flex" xs={12}>
              <TextField
                name="disputedReason"
                size="small"
                variant="outlined"
                value={chooseSlug.slug || ""}
                onChange={(e) => setChooseSlug({ ...chooseSlug, slug: e.target.value })}
                rows={4}
                fullWidth
              />
              <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => saveSlug(item)}
                  >
                save
              </Button>
            </Grid>

            :
            item.slug ? item.slug :                 
            <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => setChooseSlug(item)}
                >
              choose
            </Button>
          }
        </TableCell>
      )
    }
  ];
  console.log("automations", automations)
  return (
    <Card container className={`p-4 ${className}`}>
      <div className="flex p-4">
        <h4 className="m-0">Your automations</h4>
        <Tooltip title={`Sync automations with Active Campaign`}>
              <IconButton onClick={async () => {
                const session = getSession();
                const { academy } = session;
                const result = await bc.marketing().syncAcademyAutomations(academy?.id);
                setAutomations(result.data.results || result.data);
              }}>
                <Icon>refresh</Icon>
              </IconButton>
            </Tooltip>
      </div>
      <Divider className="flex" />
      <Grid item md={12} className='py-2'>
        The following automations were found in active campaign. Only the ones with a slug can be used on the platform.
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
