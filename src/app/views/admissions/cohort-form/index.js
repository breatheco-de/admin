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
    DialogActions,
    DialogContent,
    DialogContentText,
    MenuItem,
    FormControlLabel,
    Checkbox
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import CohortStudents from "./CohortStudents";
import CohortDetails from "./CohortDetails";
import { MatxLoading } from "matx";
import DowndownMenu from "../../../components/DropdownMenu";
import bc from "app/services/breathecode";
import * as Yup from 'yup';
import { makeStyles } from "@material-ui/core/styles";
import { setDay } from "date-fns";

const useStyles = makeStyles(({ palette, ...theme }) => ({
    dialogue: {
        color: "rgba(52, 49, 76, 1)",
    },
    button: {
        display: "flex",
        justifyContent: "center"
    },
    select: {
        width: "15rem",
    },
  }));

// import ControlledExpansionPanels from "app/views/material-kit/expansion-panel/ControlledAccordion";

// const options = [
//     { label: "Change cohort stage", value: "stage" },
//     { label: "Change Cohort current day", value: "current_date" },
//     { label: "Cohort Detailed Report", value: "cohort_deport" },
//     { label: "Instant NPS Survey", value: "new_survey" },
//     { label: "Mark as private", value: "private" }
// ];

const stageMap = [
    {
    value: 'ACTIVE',
    label: 'Active',
    },
    {
    value: 'INACTIVE',
    label: 'Inactive',
    },
    {
    value: 'PREWORK',
    label: 'Prework',
    },
    {
    value: 'FINAL_PROJECT',
    label: 'Final project',
    },
    {
    value: 'ENDED',
    label: 'Ended',
    },
]

const Cohort = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [stageDialog, setStageDialog] = useState(false);
    const [cohortDayDialog, setCohortDayDialog] = useState(false);
    const [cohort, setCohort] = useState(null);
    const [maxSyllabusDays, setMaxSyllabusDays] = useState(null);
    const [currentDay, setCurrentDay] = useState(0);
    const [stage, setStage] = useState("");
    const classes = useStyles();

    const options = [
        { label: "Change cohort stage", value: "stage" },
        { label: "Change cohort current day", value: "currentDay" },
        { label: "Cohort Detailed Report", value: "cohort_deport" },
        { label: "Instant NPS Survey", value: "new_survey" },
        { label: cohort?.private ? "Mark as public":"Mark as private", value: "privacy" }
    ];
    
    //DIALOGUE FOR NEWSURVEY\\

    const [newSurvey, setNewSurvey] = useState(
        {
            cohort: null,
            max_assistants: 2,
            max_teachers: 2,
            duration: 1,
            send_now: true
        }
    );
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setCohortDayDialog(false)
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
                setCurrentDay(data.current_day)
                setCohort(data);
                setStage(data.stage)
                setMaxSyllabusDays(data.syllabus.certificate.duration_in_days);
            })
            .catch(error => console.log(error));;
    }, [])  

    useEffect(() => {
        if(stage == "ENDED"){
            setCurrentDay(maxSyllabusDays)
        }
    }, [stage])

    const makePrivate = () => {
        bc.admissions().updateCohort(cohort.id, { ...cohort, private: !cohort.private, syllabus:`${cohort.syllabus.certificate.slug}.v${cohort.syllabus.version}`})
                .then((data) => data)
                .catch(error => console.log(error))
    }

    const updateCohort = (values) => {
        const { ending_date, ...rest } = values
        if (values.never_ends) bc.admissions().updateCohort(cohort.id, { ...rest, private: cohort.private })
            .then((data) => data)
            .catch(error => console.log(error))
        else {
            const { never_ends, ...rest } = values
            bc.admissions().updateCohort(cohort.id, { ...rest, private: cohort.private })
                .then((data) => data)
                .catch(error => console.log(error))
        }
    }
    
    const ProfileSchema = Yup.object().shape({
        current_day: Yup.number()
            .max(maxSyllabusDays, `You can not set a day greater than ${maxSyllabusDays}`)
            .required("Please enter a day")
    });


    return (
        <>
            <div className="m-sm-30">
                <div className="flex flex-wrap justify-between mb-6">
                    <div>
                        <h3 className="mt-0 mb-4 font-medium text-28">Cohort: {slug}</h3>
                        <div className="flex">
                            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green m-auto" onClick={() => setStageDialog(true)} style={{ cursor: "pointer" }}>
                                {cohort && cohort.stage}
                            </div>
                        </div>
                    </div>
                    {isLoading && <MatxLoading />}
                    <DowndownMenu
                        options={options}
                        icon="more_horiz"
                        onSelect={({ value }) => {
                            value === "currentDay"
                                ? setCohortDayDialog(true)
                                : setCohortDayDialog(false)
                            value === "stage"
                                ? setStageDialog(true)
                                : setStageDialog(false)
                            value === "new_survey"
                                ? setOpen(true)
                                : setOpen(false)
                            if(value === "privacy"){
                                makePrivate();
                            }
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
                            never_ends={cohort.never_ends}
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
                <Formik
                    initialValues = {{
                        stage: stage,
                        current_day: currentDay
                    }}
                    enableReinitialize = {true}
                    validationSchema = {ProfileSchema}
                    onSubmit = {() => {
                        updateCohort({
                            stage: stage, 
                            slug: cohort.slug, 
                            name: cohort.name, 
                            language: cohort.language, 
                            kickoff_date: cohort.kickoff_date,
                            ending_date: cohort.ending_date,
                            current_day: stage === "ENDED" ? maxSyllabusDays : currentDay
                        });
                        setCohort({...cohort, 
                            stage: stage,
                            current_day: currentDay,
                        })
                        setStageDialog(false)
                    }}
                    >
                    {({
                        errors,
                        touched,
                        handleSubmit,
                    }) => (
                        <form className = "p-4" onSubmit={handleSubmit}  className="d-flex justify-content-center mt-0">
                            <DialogContent >
                                <DialogContentText className={classes.dialogue}>
                                    Select a stage:
                                </DialogContentText>
                                    <TextField
                                        select
                                        className={classes.select}
                                        label = "Stage"
                                        name = "stage"
                                        size = "small"
                                        variant = "outlined"
                                        defaultValue = {cohort.stage}
                                        onChange = {(e) => {
                                            setStage(e.target.value)
                                        }}
                                    >
                                        {stageMap.map((option) => (
                                            <MenuItem key = {option.value} value = {option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                <DialogContentText className={classes.dialogue}>
                                    Select a current day:
                                </DialogContentText>
                                <TextField
                                    error = {errors.current_day && touched.current_day}
                                    helperText = {touched.current_day && errors.current_day}
                                    type="number"
                                    name = "current_day"
                                    size = "small"
                                    variant = "outlined"
                                    value={stage=="ENDED" ? maxSyllabusDays : currentDay}
                                    onChange = {(e) => {setCurrentDay(e.target.value)}}
                                />
                            </DialogContent>
                            <DialogActions className={classes.button}>
                                <Button                                 
                                    color = "primary" 
                                    variant = "contained" 
                                    type = "submit">
                                    Send now
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
            <Dialog
                onClose={handleClose}
                open={cohortDayDialog}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title">
                    Change cohort current day <br />
                    <small className="text-muted">{`This syllabus has a maximum duration of ${maxSyllabusDays} days.`}</small>
                </DialogTitle>                          
                <Formik
                    initialValues = {{
                        current_day: currentDay
                    }}
                    enableReinitialize = {true}
                    validationSchema = {ProfileSchema}
                    onSubmit = { () => {
                        updateCohort({
                            stage: cohort.stage, 
                            slug: cohort.slug, 
                            name: cohort.name, 
                            language: cohort.language, 
                            kickoff_date: cohort.kickoff_date,
                            ending_date: cohort.ending_date,
                            current_day: currentDay
                        });
                        setCohort({...cohort, current_day: currentDay});
                        handleClose();
                    }}
                    >
                    {({
                        errors,
                        touched,
                        handleSubmit,
                    }) => (
                        <form className = "p-4" onSubmit={handleSubmit}  className="d-flex justify-content-center mt-0">
                            <DialogContent >
                                <DialogContentText className={classes.dialogue}>
                                    Select a current day:
                                </DialogContentText>
                                <TextField
                                    error = {errors.current_day && touched.current_day}
                                    helperText = {touched.current_day && errors.current_day}
                                    type="number"
                                    label ="day"
                                    name = "current_day"
                                    size = "small"
                                    variant = "outlined"
                                    defaultValue = {cohort.current_day}
                                    onChange = {(e) => {setCurrentDay(e.target.value)}}
                                />
                            </DialogContent>
                            <DialogActions className={classes.button}>
                                <Button                                 
                                    color = "primary" 
                                    variant = "contained" 
                                    type = "submit">
                                    Send now
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
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
                    initialValues={newSurvey}
                    enableReinitialize={true}
                    onSubmit={() => {
                        bc.feedback().addNewSurvey(newSurvey);
                    }}
                >
                    {({
                        handleSubmit,
                    }) => (
                        <form className="p-4" onSubmit={handleSubmit}>
                            <DialogContent>
                                <DialogContentText className={classes.dialogue}>
                                    Cohort:
                                </DialogContentText>
                                <TextField
                                    type="text"
                                    label="Cohort"
                                    name="cohort"
                                    size="small"
                                    variant="outlined"
                                    defaultValue={slug}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Max assistants to ask:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label="Max assistants"
                                    name="max_assistants"
                                    size="small"
                                    variant="outlined"
                                    defaultValue={newSurvey.max_assistants}
                                    onChange={createSurvey}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Max assistants of teachers:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label="Max teachers"
                                    name="max_teachers"
                                    size="small"
                                    variant="outlined"
                                    defaultValue={newSurvey.max_teachers}
                                    onChange={createSurvey}
                                />
                                <DialogContentText className={classes.dialogue}>
                                    Duration:
                                </DialogContentText>
                                <TextField
                                    type="number"
                                    label="Duration"
                                    name="duration"
                                    size="small"
                                    variant="outlined"
                                    defaultValue={newSurvey.duration}
                                    onChange={createSurvey}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    onClick={handleClose}>
                                    Send now
                                </Button>
                                <Button
                                    color="danger"
                                    variant="contained"
                                    onClick={handleClose}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </form>)}
                </Formik>
            </Dialog>
        </>
    );
};

export default Cohort;
