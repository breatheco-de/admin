import React, { useState } from "react";
import axios from "axios.js";
import {
  Card,
  Grid,
  Select,
  MenuItem,

} from "@material-ui/core";


import { makeStyles } from "@material-ui/core/styles";
import history from "history.js";
import clsx from "clsx";
import useAuth from 'app/hooks/useAuth';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#1A2038",
  },
  card: {
    maxWidth: 800,
    borderRadius: 12,
    margin: "1rem",
  },
}));

const Choose = () => {
  const [loading, setLoading] = useState(false);
  const { choose, user } = useAuth();
  const classes = useStyles();
  const handleChange = (event) => {
      const { role, academy } = event.target.value;

      if(role && role !== ""){
        choose({ role, academy });
        axios.defaults.headers.common['Academy'] = academy.id;
        localStorage.setItem("bc-academy", JSON.stringify(academy));
        if(history.location.state && history.location.state.redirectUrl) history.push(history.location.state.redirectUrl);
        else history.push("/");
      }
  }
  if(!user) return history.push("/session/login");

  const roles = [{ role: "", academy: { name: "Click me to select"} }].concat(user.roles);
  return (
    <div
      className={clsx(
        "flex justify-center items-center  min-h-full-screen",
        classes.cardHolder
      )}
    >
      <Card className={classes.card}>
        <Grid container>
          <Grid item xs={12}>
            <div className="p-8 h-full bg-light-gray relative">
                <h2>Select your academy/role</h2>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={roles[0]}
                    onChange={handleChange}
                >
                    {roles.map((r,i) => <MenuItem key={i} value={r}>{r.academy?.name}: {r.role}</MenuItem>)}
                </Select>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Choose;
