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
import dayjs from "dayjs";
import bc from "../../../services/breathecode";
import ProjectDetails from "./ProjectDetails";
import ProjectMembers from "./ProjectMembers";

const LocalizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(LocalizedFormat);

const SingleProject = () => {
  const { projectID } = useParams();
  const [project, setProject] = useState(null);

  const getProjectById = () => {
    bc.freelance()
      .getSingleProject(projectID)
      .then(({ data }) => {
        setProject(data);
      })
      .catch((error) => error);
  };

  useEffect(() => {
    getProjectById();
  }, []);

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">
            Project: {project?.title}
          </h3>
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          {project === null ? (
            "loading"
          ) : (
            <ProjectDetails projectID={projectID} project={project} />
          )}
        </Grid>
        <Grid item md={7} xs={12}>
          {project === null ? (
            "loading"
          ) : (
            <ProjectMembers projectID={projectID} project={project} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SingleProject;
