import React, { useState } from 'react';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import {
  Icon,
  IconButton,
  Button,
  TableCell,
  Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../../matx';
import bc from '../../services/breathecode';

const Projects = () => {
  const [projectList, setProjectList] = useState([]);

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'Id', // column title that will be shown in table
      options: {
        filter: true,
        customHeadRender: ({ index, ...column }) => {
          return (
            <TableCell key={index} style={{ width: "100px" }} padding="0">
              {column.label}
            </TableCell>
          )
        },
        customBodyRenderLite: (dataIndex) => {
          const singleProject = projectList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {singleProject.id}
                </h5>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const singleProject = projectList[dataIndex];
          return (
            <div>
              <p className="p-0 m-0">{singleProject.title}</p>
              <a href={singleProject.repository} target="_blank" rel="noopener">{singleProject.repository}</a>
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
          const singleProject = projectList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/freelance/project/${singleProject.id}`}>
                <Tooltip title="Edit">
                  <IconButton>
                    <Icon>edit</Icon>
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
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: 'Projects', path: '/freelance/project' },
                { name: 'All' },
              ]}
            />
          </div>
          <div className="">
            <Link to="/freelance/project/new">
              <Button variant="contained" color="primary">
                Create New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <SmartMUIDataTable
          title="All Projects"
          columns={columns}
          items={projectList}
          view="project"
          singlePage=""
          historyReplace="/freelance/project"
          search={async (querys) => {
            const { data } = await bc.freelance().getAllProjects(querys);
            setProjectList(data.results || data);
            return data;
          }}
          deleting={async (querys) => {
            const { status } = await bc.freelance().deleteProjectBulk(querys);

            return status;
          }}
        />
      </div>
    </div>
  );
};

export default Projects;
