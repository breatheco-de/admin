import React from "react";
import { IconButton, Icon, Button, Grid } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import StudentCohorts from "./StudentCohorts";
import StudentDetails from "./StudentDetails";
import DowndownMenu from "../../../components/DropdownMenu"

const options = [
  { label: "Send password reset", value: "password_reset" },
  { label: "Open student profile", value: "student_profile" },
];

const Student = () => {
    const { std_id } = useParams();

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">Ben Peterson{std_id}</h3>
          <div className="flex">
              Member since: August 23rd, 2016
          </div>
        </div>

        <DowndownMenu options={options} icon="more_horiz">
            <Button>
                <Icon>playlist_add</Icon>
                Additional Actions
            </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <StudentDetails std_id={std_id} />
        </Grid>
        <Grid item md={8} xs={12}>
          <StudentCohorts std_id={std_id} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Student;
