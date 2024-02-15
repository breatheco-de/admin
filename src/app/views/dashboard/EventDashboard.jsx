import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Breadcrumb, MatxLoading } from "../../../matx";
import StatCard from "./shared/StatCards";
import { useParams, useHistory } from "react-router-dom";
// import Answers from './Answers';
import bc from "app/services/breathecode";
import GaugeProgressCard from "./shared/GuageProgressCard";
import DowndownMenu from "../../components/DropdownMenu";
import DialogPicker from "../../components/DialogPicker";
import { AsyncAutocomplete } from "../../components/Autocomplete";
import { CopyDialog } from "../../components/CopyDialog";

const STUDENT_HOST = process.env.REACT_APP_STUDENT;
const options = [
  { label: "Edit Event Details", value: "edit_event" },
  { label: "Open Public Landing", value: "landing" },
];

const EventDashboard = ({ match }) => {
  const [query, setQuery] = useState({ limit: 10, offset: 0 });
  const answered = [];
  const [isLoading, setIsLoading] = useState(true);
  const [upadteStatus, setUpdateStatus] = useState(false);
  const [updateType, setUpdateType] = useState(false);
  const [eventData, setEventData] = useState({});

  const { eventId } = useParams();
  const history = useHistory();

  // cohort data
  useEffect(() => {
    bc.events()
      .getAcademyEvent(eventId)
      .then(({ data }) => {
        if (!data) {
          toast.error("Event not Found", toastOption);
        }
        setEventData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="analytics m-sm-30">
      <div className="mb-3">
        <Breadcrumb
          routeSegments={[
            { name: "Events", path: "/events/list" },
            { name: "Event Dashboard" },
          ]}
        />
      </div>
      {isLoading ? (
        <MatxLoading />
      ) : (
        <>
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <h3 className="mt-0 mb-4 font-medium text-28">
                {eventData?.title || "Missing Event Title"}
              </h3>
              <div className="flex" style={{ gap: '10px' }}>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-white bg-green"
                  style={{ cursor: "pointer" }}
                  onClick={() => setUpdateStatus(true)}
                >
                  {eventData?.status}
                </div>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-white bg-dark"
                  style={{ cursor: "pointer" }}
                  onClick={() => setUpdateType(true)}
                >
                  {eventData?.event_type?.name}
                </div>
              </div>
            </div>
            <DialogPicker
              onClose={async (opt) => {
                if (opt) {
                  const result = await bc.events().updateAcademyEvent(eventId, { status: opt });
                  if (result.ok) setEventData({ ...eventData, status: opt });
                }
                setUpdateStatus(false);
              }}
              open={upadteStatus}
              title="Select a status"
              options={["ACTIVE", "DRAFT", "DELETED", "FINISHED"]}
            />
            <Dialog
              open={updateType}
              onClose={() => setUpdateType(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              fullWidth="md"
            >
              <DialogTitle className="ml-2" id="alert-dialog-title">
                Change Event Type
              </DialogTitle>
              <DialogContent>
                <AsyncAutocomplete
                  defaultValue={eventData.event_type.name}
                  onChange={async (opt) => {
                    const result = await bc.events().updateAcademyEvent(eventId, { event_type: opt.id });
                    if (result.ok) setEventData({ ...eventData, event_type: opt });
                    setUpdateType(false);
                  }}
                  width="100%"
                  label="Select Event Type"
                  value={eventData.event_type.name}
                  debounced={false}
                  getOptionLabel={(option) => option.name}
                  asyncSearch={() => bc.events().getAcademyEventType()}
                />
              </DialogContent>
            </Dialog>
            <DowndownMenu
              options={options}
              icon="more_horiz"
              onSelect={({ value }) => {
                if (value === "landing") {
                  window.open(`${STUDENT_HOST}/workshops/${eventData.slug}`);
                } else if (value === "edit_event") {
                  history.push(`/events/event/${eventData.id}/edit`);
                }
              }}
            >
              <Button>
                <Icon>playlist_add</Icon>
                Additional Actions
              </Button>
            </DowndownMenu>
          </div>
          {answered && answered.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Alert severity="warning" className="mb-3">
                  <AlertTitle className="m-auto">
                    This event expires in 2 hours
                  </AlertTitle>
                </Alert>
                <GaugeProgressCard score={9} />
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <StatCard label={"Cohort Score"} score={0} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <StatCard label={"Academy Score"} score={0} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={8} xs={12}>
                {/* <Answers answered={answered} filteredAnswers={filteredAnswers} sortBy={sortBy} filter={filter} mentors={mentors}/> */}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Alert severity="warning" className="mb-3">
                  <AlertTitle className="m-auto">
                    This event starts in 1 hours
                  </AlertTitle>
                </Alert>
                <GaugeProgressCard score={0} />
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <StatCard label={"No score yet"} score={0} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <StatCard label={"No score yet"} score={0} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={8} xs={12}>
                {/* <Answers 
            answered={answered} 
            filteredAnswers={filteredAnswers} 
            sortBy={sortBy} filter={filter} 
            mentors={[]}/> */}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

EventDashboard.propTypes = {
  match: PropTypes.object,
};

export default EventDashboard;
