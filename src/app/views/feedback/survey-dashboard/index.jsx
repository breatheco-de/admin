import React from "react";
import {
  Card,
  TextField,
  MenuItem,
  IconButton,
  Icon,
  Grid,
} from "@material-ui/core";
import StatCard from "./StatCard";
import Answers from "./Answers";
import GaugeProgressCard from "./GuageProgressCard";

const results = [
  {
    score: 7,
    imageUrl: "/assets/images/face-4.jpg",
    title: "Ernesto Milano",
  },
  {
    score: 8,
    imageUrl: "/assets/images/face-3.jpg",
    title: "Edian Beltran",
  },
  {
    score: 9,
    title: "Entire Cohort",
  },
  {
    score: 6,
    title: "Academy",
  },
];

const Analytics2 = () => {
  return (
    <div className="analytics m-sm-30">
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <GaugeProgressCard />
          { results.map(r => <StatCard className="mb-3" label={r.title} score={r.score} imageUrl={r.imageUrl} />)}
        </Grid>
        <Grid item md={8} xs={12}>
          <Card elevation={3} className={`p-5 flex mb-3`}>
            <Grid xs={12}>
              <h3 className={`mt-1 text-32 w-100`}>Survey: #23</h3>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={5} xs={12}>
                <p className="m-0 text-muted">Expires in</p>
              </Grid>
              <Grid item md={5} xs={12}>
                <p className="m-0 text-muted">2 days</p>
              </Grid>
            </Grid>
          </Card>
          <Answers />
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics2;
