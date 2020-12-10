import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Divider,
  Card,
  TextField,
  Icon,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
  Button,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { format } from "date-fns";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const InvoiceOverview = () => {
    const classes = useStyles();
    const [ chooseOpen, setChooseOpen ] = useState(false);

  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohorts</h4>
      </div>

      <Divider className="mb-6" />

      <div className="flex mb-6">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a cohor name or slug..."
          fullWidth
          InputProps={{
            startAdornment: (
              <Icon className="mr-3" fontSize="small">
                search
              </Icon>
            ),
          }}
        />
        <Button className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre">
          Add to cohort
        </Button>
      </div>

      <div className="overflow-auto">
        <div className="min-w-600">
          {dummyStudents.map((s) => (
            <div key={s.id} className="py-4">
              <Grid container alignItems="center">
                <Grid item lg={4} md={4} sm={6} xs={6}>
                  <div className="flex">
                    <div className="flex-grow">
                      <h6 className="mt-0 mb-0 text-15 text-primary">
                        {s.cohort.name}
                      </h6>
                      <p className="mt-0 mb-6px text-13">
                        <span className="font-medium">{s.cohort.kickoff_date}</span>
                      </p>
                      <p className="mt-0 mb-6px text-13">
                        <small onClick={() => setChooseOpen(true)} className={"border-radius-4 px-2 pt-2px bg-secondary"}>student</small>
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <TextField
                    className="min-w-100"
                    label="F. Status"
                    name="finaltialStatus"
                    size="small"
                    variant="outlined"
                    value={s.finantial_status}
                    select
                  >
                    {['FULLY_PAID','UP_TO_DATE','LATE'].map((item, ind) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <TextField
                    className="min-w-100"
                    label="E. Status"
                    name="educationalStatus"
                    size="small"
                    variant="outlined"
                    value={s.educational_status}
                    select
                  >
                    {['ACTIVE','POSTPONED','SUSPENDED','GRADUATED','DROPPED'].map((item, ind) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <div className="flex justify-end items-center">
                    <IconButton>
                      <Icon fontSize="small">delete</Icon>
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </div>
        
        <ChooseRoleDialog
            // selectedValue={selectedValue}
            open={chooseOpen}
            onClose={(newRole) => setChooseOpen(false)}
        />
    </Card>
  );
};

const dummyStudents = [
    {
        "user": {
            "id": 404,
            "first_name": "William",
            "last_name": "Boakye",
            "email": "wboak001@FIU.edu"
        },
        "cohort": {
            "id": 40,
            "slug": "miami-prework-vii",
            "name": "Miami Prework VII",
            "kickoff_date": "2018-11-29T00:00:00Z",
            "ending_date": null,
            "stage": "INACTIVE"
        },
        "role": "STUDENT",
        "finantial_status": null,
        "educational_status": "ACTIVE",
        "created_at": "2020-11-09T17:02:17.190000Z"
    },
    {
        "user": {
            "id": 404,
            "first_name": "William",
            "last_name": "Boakye",
            "email": "wboak001@FIU.edu"
        },
        "cohort": {
            "id": 41,
            "slug": "miami-downtown-viii",
            "name": "Miami (4GA) Downtown VIII",
            "kickoff_date": "2019-02-19T00:00:00Z",
            "ending_date": "2019-06-06T00:00:00Z",
            "stage": "INACTIVE"
        },
        "role": "STUDENT",
        "finantial_status": null,
        "educational_status": "ACTIVE",
        "created_at": "2020-11-09T17:02:17.193000Z"
    }
];

const ChooseRoleDialog = ({ onClose, selectedValue, ...other }) =>
    <Dialog
      onClose={() => onClose(null)}
      aria-labelledby="simple-dialog-title"
      {...other}
    >
      <DialogTitle id="simple-dialog-title">Select a Cohort Role</DialogTitle>
      <List>
        {['TEACHER', 'ASISTANT', 'STUDENT'].map(role => (
          <ListItem
            button
            onClick={() => onClose(role)}
            key={role}
          >
            <ListItemText primary={role} />
          </ListItem>
        ))}
      </List>
    </Dialog>;

export default InvoiceOverview;
