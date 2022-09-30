import React, { useState, useEffect } from "react";
import {
  Dialog,
  Icon,
  Button,
  Grid,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import DowndownMenu from '../../../components/DropdownMenu';
import { useParams } from "react-router-dom";
import { Breadcrumb } from 'matx';
import dayjs from "dayjs";
import bc from "../../../services/breathecode";
import ProjectDetails from "./ProjectDetails";
import ProjectMembers from "./ProjectMembers";
import ProjectInvoices from "./ProjectInvoices";

const LocalizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(LocalizedFormat);

const SingleProject = () => {
  const { projectID } = useParams();
  const [project, setProject] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const options = [
    {
      label: 'Calculate Upcoming Bill',
      value: 'calculate',
    },
  ];

  const calculateNewInvoice = () => {
    bc.freelance()
      .generatePendingInvoice(projectID)
      .then(({ data, ok }) => {
        if(ok) getProjectInvoices();
      })
  };

  const getProjectInvoices = () => {
    bc.freelance().getProjectInvoices({
      project: projectID,
    }).then(resp => {
        if(resp.ok) setInvoices(resp.data)
    })
  }

  const getProjectById = () => {
    bc.freelance()
      .getSingleProject(projectID)
      .then(({ data }) => {
        setProject(data);
      })
      .catch((error) => error);
  };

  const updateAcademyProject = (values) => {
    bc.mentorship()
      .updateAcademyService(projectID, {
        ...values, 
        // duration: formattedDuration,
      })
      .then(({ data }) => data)
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getProjectById();
    getProjectInvoices();
  }, []);

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <div>
          <Breadcrumb routeSegments={[{ name: 'Freelance', path: "#" }, { name: 'Projects', path: '/freelance/project' }, { name: project?.title }]} />
        </div>
        <div>
          <DowndownMenu
            options={options}
            icon="more_horiz"
            onSelect={({ value }) => {
              if (value === 'calculate') calculateNewInvoice();
            }}
          >
            <Button>
              <Icon>playlist_add</Icon>
              Additional Actions
            </Button>
          </DowndownMenu>
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          {project === null ? (
            "loading"
          ) : (
            <ProjectDetails projectID={projectID} project={project} onSubmit={updateAcademyProject} />
          )}
        </Grid>
        <Grid item md={7} xs={12}>
          {project === null ? (
            "loading"
          ) : (<>
            <ProjectMembers project={project} />
            <ProjectInvoices project={project} invoices={invoices} />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SingleProject;
