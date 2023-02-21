import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import React, { useState, useEffect, useRef } from "react";
import { Calendar, Views, globalizeLocalizer } from "react-big-calendar";
import CalendarHeader from "./components/CalendarHeader";
import * as ReactDOM from "react-dom";
import { Breadcrumb } from "matx";
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
// import EventEditorDialog from "./EventEditorDialog";
import { makeStyles } from "@material-ui/core/styles";
import globalize from 'globalize'
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const localizer = globalizeLocalizer(globalize)

import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  calendar: {
    // "& .rbc-event": {
    //   background: "rgba(var(--primary),1) !important",
    // },
    // "& .rbc-selected": {
    //   background: "rgba(var(--secondary),1) !important",
    // },
    "& .rbc-calendar": {
      height: "auto",
      flexGrow: 1,
    },
    "& .rbc-header": {
      padding: "12px 16px !important",
      "& a": {
        paddingBottom: "8px !important",
      },
      "& span": {
        fontSize: "15px !important",
        fontWeight: 500,
      },
    },
  },
}));


let viewList = Object.keys(Views).map((key) => Views[key]);

const getRanges = (_date=undefined) => {
    _date = dayjs(_date);
    return {
        start: _date.startOf("month"),
        end: _date.startOf("month").add(1, 'month').subtract(1,'day')
    }
}

const MatxCalendar = () => {
  const [events, setEvents] = useState([]);
  const [dateRange, setDateRange] = useState(getRanges());

  const headerComponentRef = useRef(null);
  const classes = useStyles();

  const updateCalendar = async () => {
    let _assets = await bc.registry().getAllAssets({ 
        visibility: "PRIVATE,PUBLIC,UNLISTED",  
        status: "PUBLISHED",
        published_before: dateRange.end.format('YYYY-MM-DD'),
        published_after: dateRange.start.format('YYYY-MM-DD'),
    });

    // if pagination exists, it will contain a "results" property
    _assets = _assets.data.results || _assets.data;

    const events = _assets?.map((e) => {
        const _date = dayjs(e.published_at)
        return ({
            ...e,
            start: _date.toDate(),
            end: _date.add(1, 'minute').toDate(),
        })
    });
    setEvents(events);
  };

  useEffect(() => {
    updateCalendar();
  }, [dateRange]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Calendar" }]} />
      </div>

      <div className={clsx("h-full-screen flex-column", classes.calendar)}>
        <div ref={headerComponentRef} />
        <Calendar
          selectable
          events={events}
          resizable
          localizer={localizer}
          onNavigate={(startingFrom) => setDateRange(getRanges(startingFrom))}
          defaultView={Views.MONTH}
          startAccessor="start"
          endAccessor="end"
          views={viewList}
          step={60}
          components={{
            toolbar: (props) => {
              return headerComponentRef.current ? (
                ReactDOM.createPortal(
                  <CalendarHeader {...props} />,
                  headerComponentRef.current
                )
              ) : (
                <div>Header component not found</div>
              );
            },
          }}
        //   onSelectEvent={(event) => {
        //     openExistingEventDialog(event);
        //   }}
        //   onSelectSlot={(slotDetails) => openNewEventDialog(slotDetails)}
        />
      </div>
      {/* {shouldShowEventDialog && (
        <EventEditorDialog
          handleClose={handleDialogClose}
          open={shouldShowEventDialog}
          event={newEvent}
        />
      )} */}
    </div>
  );
};

export default MatxCalendar;