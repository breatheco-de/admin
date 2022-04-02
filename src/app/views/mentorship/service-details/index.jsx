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
import ServiceDetails from "./ServiceDetails";
import ServiceMentors from "./ServiceMentors";

const LocalizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(LocalizedFormat);

const Services = () => {
  const { serviceID } = useParams();
  const [service, setService] = useState(null);
  const [dialogState, setDialogState] = useState({
    openDialog: false,
    title: "",
    action: () => { },
  });

  const [copyDialog, setCopyDialog] = useState({
    title: "Reset Github url",
    url: "https://github.something.com",
    openDialog: false,
  });

  const options = [
    {
      label: 'Toggle service status',
      value: 'status',
      title: 'Change service status',
      action: toggleServiceStatus,
    }
  ];

  const getServiceById = () => {
    bc.mentorship()
      .getSingleService(serviceID)
      .then(({ data }) => {
        // console.log('this should be the service.', data);
        setService(data);
      })
      .catch((error) => error);
  };

  const toggleServiceStatus = async () => {
    let newStatus = service.status === "ACTIVE" ? "INNACTIVE" : "ACTIVE";
    bc.mentorship()
      .updateAcademyService(serviceID, {
        status: newStatus,
        name: service.name,
      })
      .then(({ data, status }) => {
        if (status === 200) {
          setService({ ...data });
          console.log("service PUT", service);
          console.log("service PUT DATA", data);
        } else {
          throw Error("Could not update Status");
        }
      });
  };

  useEffect(() => {
    getServiceById();
  }, []);

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        {/* <ActionsDialog /> */}
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">
            {service && service.name}
          </h3>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            if (value === 'status') {
              toggleServiceStatus()
            }
            const selected = options.find((option) => option.value === value);
            setDialogState({
              openDialog: true,
              title: selected.title,
              action: selected.action,
            });
          }}
        >
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          {service === null ? (
            "loading"
          ) : (
            <ServiceDetails serviceID={serviceID} service={service} />
          )}
        </Grid>
        <Grid item md={7} xs={12}>
          {service === null ? (
            "loading"
          ) : (
            <ServiceMentors serviceID={serviceID} service={service} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Services;
