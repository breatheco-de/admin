import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import TodoList from "./TodoList";
import TodoEditor from "./TodoEditor";
import { Icon, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  searchBoxHolder: {
    height: "calc(220px - 94px + 30px)",
    [theme.breakpoints.down("sm")]: {
      height: "calc(220px - 94px -16px + 30px)",
    },
  },
  searchBox: {
    width: "calc(100% - 60px)",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 32px)",
    },
  },
  todoContent: {
    marginTop: -94,
  },
}));

const AppTodo = () => {
  const [query, setQuery] = useState("");
  const classes = useStyles();

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <div className="h-220 bg-primary">
        <div
          className={clsx(
            "flex-column items-center justify-center",
            classes.searchBoxHolder
          )}
        >
          <div className={classes.searchBox}>
            <TextField
              name="query"
              value={query}
              variant="outlined"
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: <Icon className="mr-3">search</Icon>,
                style: {
                  borderRadius: 300,
                  background: "white",
                  outline: "none",
                },
              }}
              onChange={handleQueryChange}
            />
          </div>
        </div>
      </div>
      <div className={classes.todoContent}>
        <Switch>
          <Route path="/todo/list/:id" component={TodoEditor} />
          <Route
            exact
            path="/todo/list"
            render={() => <TodoList query={query} />}
          />
        </Switch>
      </div>
    </div>
  );
};

export default AppTodo;
