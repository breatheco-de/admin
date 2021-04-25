import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
    Grid,
    Icon,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    Dialog,
    Button,
    TextField,
    DialogActions
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import CohortStudents from "./CohortStudents";
import CohortDetails from "./CohortDetails";
import { MatxLoading } from "matx";
import DowndownMenu from "../../../components/DropdownMenu";
import bc from "app/services/breathecode";
import { DialogContent } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ControlledExpansionPanels from "app/views/material-kit/expansion-panel/ControlledAccordion";

const options = [
    { label: "Change cohort stage", value: "stage" },
    { label: "Cohort Detailed Report", value: "cohort_deport" },
    { label: "Instant NPS Survey", value: "new_survey"}
];

const useStyles = makeStyles(({ palette, ...theme }) => ({
    dialogue: {
        color: "rgba(52, 49, 76, 1)",
    },
  }));

const Cohort = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [stageDialog, setStageDialog] = useState(false);
    const [cohort, setCohort] = useState(null);
    const classes = useStyles();

    //DIALOGUE FOR NEWSURVEY\\

    const [newSurvey, setNewSurvey] = useState(
        {
          cohort: null,
          max_assistants: 2,
          max_teachers: 2, 
          duration: 1,
          send_now: false
        }
      ); 
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const createSurvey = event => {
        setNewSurvey({ 
            ...newSurvey, [event.target.name]: event.target.value 
        });
    };

    //USEEFFECT QUE CARGA EL COHORT DETAIL\\

    useEffect(() => {
        setIsLoading(true);
        bc.admissions().getCohort(slug)
            .then(({ data }) => {
                setIsLoading(false);
                setCohort(data);
                setNewSurvey({
                    ...newSurvey, cohort: data.id
                })
            })
            .catch(error => console.log(error));

    }, [])

    const updateCohort = (values) => {
        console.log(values);
        console.log(cohort)
        bc.admissions().updateCohort(cohort.id,{ ...values})
            .then((data) => data)
            .catch(error => console.log(error))
    }

    return (
        <>
            <div className="m-sm-30">
                <div className="flex flex-wrap justify-between mb-6">
                    <div>
                        <h3 className="mt-0 mb-4 font-medium text-28">Cohort: {slug}</h3>
                        <div className="flex">
                            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3" onClick={()=> setStageDialog(true)} style={{ cursor: "pointer" }}>
                                {cohort && cohort.stage}
                            </div>
                        </div>
                    </div>
                    {isLoading && <MatxLoading />}
                    <DowndownMenu 
                        options={options} 
                        icon="more_horiz" 
                        onSelect={({value}) => {
                            setStageDialog(value === "stage" ? true : false)
                            setOpen(value === "new_survey" ? true : false) 
                        }}>
                        <Button>
                            <Icon>playlist_add</Icon>
                            Additional Actions
                        </Button>
                    </DowndownMenu>
                </div>
                <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                        {cohort !== null ? <CohortDetails
                            slug={slug}
                            language={cohort.language || "en"}
                            endDate={cohort.ending_date}
                            startDate={cohort.kickoff_date}
                            id={cohort.id}
                            syllabus={cohort.syllabus}
                            onSubmit={updateCohort}
                        /> : ""}
                    </Grid>
                    <Grid item md={8} xs={12}>
                        {cohort !== null ? <CohortStudents
                            slug={slug}
                            cohort_id={cohort.id}
                        /> : ""}
                    </Grid>
                </Grid>
            </div>
            <Dialog
                onClose={() => setStageDialog(false)}
                open={stageDialog}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title">Select a Cohort Stage</DialogTitle>
                <List>
                    {['ACTIVE', 'INACTIVE', 'PREWORK', 'FINAL_PROJECT','ENDED' ].map((stage, i) => (
                        <ListItem
                            button
                            onClick={() => {
                                updateCohort({
                                    stage: stage, 
                                    slug:cohort.slug, 
                                    name:cohort.name, 
                                    language:cohort.language, 
                                    kickoff_date:cohort.kickoff_date,
                                    ending_date: cohort.ending_date
                                });
                                setCohort({...cohort, stage:stage})
                                setStageDialog(false)
                            }}
                            key={i}
                        >
                            <ListItemText primary={stage} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
            <Dialog
                onClose={handleClose}
                open={open}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title">
                    New Instant Survey
                </DialogTitle>
                <Formik
                    initialValues = {newSurvey}
                    enableReinitialize = {true}
                    onSubmit = { () => {
                        newSurvey.send_now
                            ? bc.feedback().updateSurvey(newSurvey, newSurvey.cohort)
                            : bc.feedback().addNewSurvey(newSurvey);
                    }}
                    >
                    {({
                        handleSubmit,
                    }) => (
                        <form className = "p-4" onSubmit={handleSubmit}>
                            <DialogContent>
                                <DialogContentText className={classes.dialogue}>
                                    Cohort:
                                </DialogContentText>
                                <TextField
                                    type="text"
                                    label = "Cohort"
                                    name = "cohort"
                                    size = "small"
                                    variant = "outlined"
                                    defaultValue = {slug}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Max assistants to ask:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label = "Max assistants"
                                    name = "max_assistants"
                                    size = "small"
                                    variant = "outlined"
                                    defaultValue = {newSurvey.max_assistants}
                                    onChange = {createSurvey}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Max assistants of teachers:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label = "Max teachers"
                                    name = "max_teachers"
                                    size = "small"
                                    variant = "outlined"
                                    defaultValue = {newSurvey.max_teachers}
                                    onChange = {createSurvey}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Duration:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label = "Duration"
                                    name = "duration"
                                    size = "small"
                                    variant = "outlined"
                                    defaultValue = {newSurvey.duration}
                                    onChange = {createSurvey}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button 
                                color = "primary" 
                                variant = "contained" 
                                type = "submit" 
                                onClick={() => {
                                    console.log(newSurvey);
                                    setNewSurvey({
                                        ...newSurvey, send_now: false
                                    });
                                    handleClose();
                                }}>
                                Save as a draft
                                </Button>
                                <Button 
                                color = "primary" 
                                variant = "contained" 
                                type = "submit" 
                                onClick={() => {
                                    setNewSurvey({
                                        ...newSurvey, send_now: true
                                    });
                                    console.log(newSurvey);
                                    handleClose();
                                }}>
                                Send now
                                </Button>
                                <Button 
                                color = "danger" 
                                variant = "contained" 
                                onClick={handleClose}>
                                Delete
                                </Button>
                            </DialogActions>   
                        </form> )}
                </Formik>            
            </Dialog>
        </>
    );
};

export default Cohort;
