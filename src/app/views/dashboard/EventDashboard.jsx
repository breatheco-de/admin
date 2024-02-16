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
import StatCard from "./shared/StatCards";
import { useParams, useHistory } from "react-router-dom";
import bc from "app/services/breathecode";
import { Breadcrumb, MatxLoading } from "../../../matx";
import GaugeProgressCard from "./shared/GuageProgressCard";
import DowndownMenu from "../../components/DropdownMenu";
import DialogPicker from "../../components/DialogPicker";
import { SmartMUIDataTable } from '../../components/SmartDataTable';
import { AsyncAutocomplete } from "../../components/Autocomplete";
import { useQuery } from '../../hooks/useQuery';

const stageColors = {
  DRAFT: 'bg-gray',
  STARTED: 'text-white bg-warning',
  ENDED: 'text-white bg-green',
  DELETED: 'light-gray',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const STUDENT_HOST = process.env.REACT_APP_STUDENT;
const options = [
  { label: "Edit Event Details", value: "edit_event" },
  { label: "Open Public Landing", value: "landing" },
];

const EventDashboard = ({ match }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [upadteStatus, setUpdateStatus] = useState(false);
  const [updateType, setUpdateType] = useState(false);
  const [eventData, setEventData] = useState({});
  const [checkingData, setCheckingData] = useState([]);
  const [items, setItems] = useState([]);
  const query = useQuery();

  const { eventId } = useParams();
  const history = useHistory();

  const fetchEventData = async () => {
    try {
      const res = await bc.events().getAcademyEvent(eventId);
      const { data } = res;

      if (!data) toast.error("Event not Found", toastOption);
      setEventData(data);

      const checkingRes = await bc.events().getEventCheckins(eventId);
      setCheckingData(checkingRes.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  useEffect(() => {
    fetchEventData();
  }, []);

  const EventCapacity = eventData?.capacity;

  const columns = [
    {
      name: 'id', // field name in the row object
      label: 'ID', // column title that will be shown in table
      options: {
        sortThirdClickReset: true,
        filter: true,
      },
    },
    {
      name: 'attendee__first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        sortThirdClickReset: true,
        filter: true,
        filterList: query.get('name') !== null ? [query.get('name')] : [],
        customBodyRenderLite: (dataIndex) => {
          const { attendee, ...rest } = items[dataIndex];
          return (
            <div className="ml-3">
              <h5 className="my-0 text-15">
                {attendee !== null ? name(attendee) : `${rest.first_name} ${rest.last_name}`}
              </h5>
              <small className="text-muted">{rest?.email || rest.email}</small>
            </div>
          );
        },
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table
      options: {
        sortThirdClickReset: true,
        filter: true,
        filterList: query.get('status') !== null ? [query.get('status')] : [],
        customBodyRenderLite: (dataIndex) => {
          const item = items[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px ${stageColors[item?.status]}`}>
                  {item?.status}
                </small>
              </div>
            </div>
          );
        },
      },
    },
  ];

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
              <div className="flex" style={{ gap: "10px" }}>
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
                  const result = await bc
                    .events()
                    .updateAcademyEvent(eventId, { status: opt });
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
                    const result = await bc
                      .events()
                      .updateAcademyEvent(eventId, { event_type: opt.id });
                    if (result.ok)
                      setEventData({ ...eventData, event_type: opt });
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
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              {/* <Alert severity="warning" className="mb-3">
                <AlertTitle className="m-auto">
                  This event starts in 1 hours
                </AlertTitle>
              </Alert> */}
              <GaugeProgressCard
                series={[(checkingData.length * 100)/ EventCapacity]}
                maxValue={EventCapacity}
                bottomMessage="Users registered for the event"
                height="auto"
                valueOptions={{ 
                  fontSize: '14px',
                  formatter:  (val) => `${(val * EventCapacity)/100} Attendees`,
                }}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <SmartMUIDataTable
                title="Event Attendees"
                columns={columns}
                items={items}
                options={{
                  selectableRows: false,
                  print: false,
                  viewColumns: false,
                  search: false,
                  filter: false,
                  customToolbar: null,
                }}
                view="Event Dashboard"
                singlePage=""
                historyReplace={`/events/event/${eventId}`}
                search={async (querys) => {
                  const { data } = await bc.events().getCheckins({ ...querys, event: eventId });
                  setItems(data.results);
                  return data;
                }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

EventDashboard.propTypes = {
  match: PropTypes.object,
};

export default EventDashboard;
