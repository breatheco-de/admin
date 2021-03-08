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
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import CohortStudents from "./CohortStudents";
import CohortDetails from "./CohortDetails";
import { MatxLoading } from "matx";
import DowndownMenu from "../../../components/DropdownMenu";
import bc from "app/services/breathecode";

const options = [
    { label: "Change cohort stage", value: "stage" },
    { label: "Cohort Detailed Report", value: "cohort_deport" },
];

const Cohort = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [stageDialog, setStageDialog] = useState(false);
    const [cohort, setCohort] = useState({})
    useEffect(() => {
        getCohort();
    }, [])

    const getCohort = () => {
        setIsLoading(true);
        bc.admissions().getCohort(slug)
            .then(({ data }) => {
                setIsLoading(false);
                setCohort(data);
                console.log(data)
            })
            .catch(error => console.log(error));
    }
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
                    <DowndownMenu options={options} icon="more_horiz" onSelect={({value})=>setStageDialog(value === "stage" ?true : false)}>
                        <Button>
                            <Icon>playlist_add</Icon>
                            Additional Actions
                        </Button>
                    </DowndownMenu>
                </div>
                <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                        <CohortDetails
                            slug={slug}
                            language={cohort.language || "en"}
                            endDate={cohort.ending_date}
                            startDate={cohort.kickoff_date}
                            id={cohort.id}
                            onSubmit={updateCohort}
                        />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <CohortStudents
                            slug={slug}
                            cohort_id={cohort.id}
                        />
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
        </>
    );
};

export default Cohort;
