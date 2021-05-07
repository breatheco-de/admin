import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import { Formik } from "formik";
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

const options = [
    { label: "Change cohort stage", value: "stage" },
    { label: "Cohort Detailed Report", value: "cohort_deport" },
    { label: "Change Cohort current day", value: "cohort_current_date" },
];

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
    const [newDay, setNewDay] = useState(0);
    const [stage, setStage] = useState("");
    const classes = useStyles();

    const handleClose = () => {setCohortDayDialog(false)};

    useEffect(() => {
        setIsLoading(true);
        bc.admissions().getCohort(slug)
            .then(({ data }) => {
                setIsLoading(false);
                setCohort(data);
                setStage(data.stage)
                setMaxSyllabusDays(data.syllabus.certificate.duration_in_days);
            })
            .catch(error => console.log(error));;
    }, [])  

    const updateCohort = (values) => {
        bc.admissions().updateCohort(cohort.id,{ ...values})
            .then((data) => data)
            .catch(error => console.log(error))
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
                            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3" onClick={()=> setStageDialog(true)} style={{ cursor: "pointer" }}>
                                {cohort && cohort.stage}
                            </div>
                        </div>
                    </div>
                    {isLoading && <MatxLoading />}
                    <DowndownMenu 
                        options={options} 
                        icon="more_horiz" 
                        onSelect={({value})=>{
                            setStageDialog(value === "stage" ? true : false)
                            setCohortDayDialog(value === "cohort_current_date" ? true : false) 
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
                <Formik
                    initialValues = {{
                        stage: stage,
                        current_day: newDay
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
                            current_day: stage === "ENDED" ? maxSyllabusDays : newDay
                        });
                        setCohort({...cohort, 
                            stage: stage,
                            current_day: newDay,
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
                                    value={
                                        stage === "ENDED"
                                            ? maxSyllabusDays
                                            : cohort.current_day
                                    }
                                    onChange = {(e) => {setNewDay(e.target.value)}}
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
                        current_day: newDay
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
                            current_day: newDay
                        });
                        setCohort({...cohort, current_day: newDay});
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
                                    onChange = {(e) => {setNewDay(e.target.value)}}
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
        </>
    );
};

export default Cohort;
