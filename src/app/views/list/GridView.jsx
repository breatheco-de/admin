import React from "react";
import { Card, Icon, Grid, Checkbox, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  gridCard: {
    "& .grid__card-overlay": {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      opacity: 0,
      transition: "all 250ms ease-in-out",
      background: "rgba(0, 0, 0, 0.67)",

      "& > div:nth-child(2)": {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
      },
    },
    "& .grid__card-bottom": {
      "& .email": {
        display: "none",
      },
    },
    "&:hover": {
      "& .grid__card-overlay": {
        opacity: 1,
      },
      "& .grid__card-bottom": {
        "& .email": {
          display: "block",
        },
        "& .date": {
          display: "none",
        },
      },
    },
  },
}));

const calculateColumnPerRow = (value) => {
  if (value === 25) {
    return 2;
  }
  if (value === 50) {
    return 3;
  }
  if (value === 75) {
    return 4;
  }
  if (value === 100) {
    return 6;
  }
};

const GridView = ({ list = [], sliderValue }) => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={2}>
        {list.map((item, index) => (
          <Grid item sm={calculateColumnPerRow(sliderValue)} key={item.id}>
            <Card
              className={clsx("flex-column h-full", classes.gridCard)}
              elevation={6}
            >
              <div className="grid__card-top text-center relative">
                <img
                  className="block w-full"
                  src={item.projectImage}
                  alt="project"
                />
                <div className="grid__card-overlay flex-column">
                  <div className="flex items-center justify-between">
                    <Checkbox className="text-white"></Checkbox>
                    <div className="flex items-center">
                      <Icon
                        fontSize="small"
                        className="mr-3 cursor-pointer text-white"
                      >
                        filter_none
                      </Icon>
                      <Icon
                        fontSize="small"
                        className="mr-3 cursor-pointer text-white"
                      >
                        share
                      </Icon>
                      <Icon
                        fontSize="small"
                        className="mr-3 cursor-pointer text-white"
                      >
                        edit
                      </Icon>
                      <Icon
                        fontSize="small"
                        className="mr-3 cursor-pointer text-white"
                      >
                        delete
                      </Icon>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outlined"
                      className="text-white border-color-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid__card-bottom text-center py-2">
                <p className="m-0">{item.projectName}</p>
                <small className="date text-muted">{item.date}</small>
                <small className="email text-muted">{item.email}</small>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default GridView;
