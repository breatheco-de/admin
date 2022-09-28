/* eslint-disable react/jsx-indent */
import {
  Avatar, Card, Button, Icon, Grid,
  IconButton, Tooltip, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import bc from '../../../services/breathecode';
import { useQuery } from '../../../hooks/useQuery'

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: '4px solid rgba(var(--body), 0.03)',
    boxShadow: theme.shadows[3],
  },
}));

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 5000,
};

const ProjectMembers = ({ projectId, project }) => {

  const classes = useStyles();
  const [projectMembers, setProjectMembers] = useState([]);

  const query = useQuery();
  useEffect(() => {
    bc.freelance().getProjectMembers({ ...query, project: project.id })
      .then(resp => {

        if(resp.ok) setProjectMembers(resp.data.results || resp.data);
      })

  }, []);
 

  return (
    <Card className="p-3">
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Project Members</h4>
        <Button
          className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre"
        >
          Add member
        </Button>
      </div>
      <div className="flex mb-6">
        {projectMembers.length > 0 && projectMembers.map(({ freelancer, ...member }) => 
          <Grid container alignItems="center">
            <Grid container xs={4}>
              <Avatar
                className={clsx('h-full w-full mb-6 mr-2', classes.avatar)}
                src={freelancer.user.profile !== undefined ? freelancer.user.profile.avatar_url : ''}
              />
              <div className="flex-grow">
                <h6 className="mt-0 mb-0 text-15">
                  {freelancer.user.first_name}
                  {' '}
                  {freelancer.user.last_name}
                </h6>
              </div>
            </Grid>
            <Grid className="flex" xs={4}>
              <TextField
                className="m-0"
                label="Cost x hour"
                name="cost"
                size="small"
                variant="outlined"
                value={member.total_cost_hourly_price}
                // onChange={handleChange}
              />
              <TextField
                className="m-0"
                label="Price x hour"
                name="price"
                size="small"
                variant="outlined"
                value={member.total_client_hourly_price}
                // onChange={handleChange}
              />
            </Grid>
            <Grid className="flex justify-end items-center" xs={4}>
              <IconButton>
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Grid>
          </Grid>
        )}
      </div>
    </Card>
  );
};

ProjectMembers.propTypes = {
  project: PropTypes.object,
  serviceID: PropTypes.string,
};

export default ProjectMembers;
