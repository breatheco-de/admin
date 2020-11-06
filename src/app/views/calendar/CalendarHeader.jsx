import React from "react";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { Tooltip, IconButton, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  header: {
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
  },
}));

const viewNameListObject = {
  month: {
    name: "Month",
    icon: "view_module",
  },
  week: {
    name: "Week",
    icon: "view_week",
  },
  work_week: {
    name: "Work week",
    icon: "view_array",
  },
  day: {
    name: "Day",
    icon: "view_day",
  },
  agenda: {
    name: "Agenda",
    icon: "view_agenda",
  },
};

const CalendarHeader = ({
  views: viewNameList,
  view: currentView,
  label,
  onView,
  onNavigate,
}) => {
  const classes = useStyles();

  const renderViewButtons = () => {
    if (viewNameList.length > 1) {
      return viewNameList.map((view) => (
        <Tooltip title={viewNameListObject[view].name} key={view}>
          <div>
            <IconButton
              aria-label={view}
              onClick={() => onView(view)}
              disabled={currentView === view}
            >
              <Icon className="text-white">
                {viewNameListObject[view].icon}
              </Icon>
            </IconButton>
          </div>
        </Tooltip>
      ));
    }
  };

  return (
    <div
      className={clsx("flex py-1 justify-around bg-primary", classes.header)}
    >
      <div className="flex justify-center">
        <Tooltip title="Previous">
          <IconButton onClick={() => onNavigate(navigate.PREVIOUS)}>
            <Icon className="text-white">chevron_left</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title="Today">
          <IconButton onClick={() => onNavigate(navigate.TODAY)}>
            <Icon className="text-white">today</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title="Next">
          <IconButton onClick={() => onNavigate(navigate.NEXT)}>
            <Icon className="text-white">chevron_right</Icon>
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex items-center">
        <h6 className="m-0 text-white">{label}</h6>
      </div>

      <div className="flex">{renderViewButtons()}</div>
    </div>
  );
};

export default CalendarHeader;
