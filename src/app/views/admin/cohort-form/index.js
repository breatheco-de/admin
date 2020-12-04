import React, { useEffect, useState } from "react";
import { IconButton, Icon, Button, Grid } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import CohortStudents from "./CohortStudents";
import CohortDetails from "./CohortDetails";
import { MatxLoading } from "matx";
import axios from "../../../../axios";

const Cohort = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [cohort, setCohort] = useState({})
    useEffect(() => {
        getCohort();
    }, [])

    const handleClose = () => setSnackOpen(true);

    const getCohort = () => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${slug}`)
            .then(({ data }) => {
                setIsLoading(false);
                setCohort(data);
                console.log(data)
            })
            .catch(error => console.log(error));
    }

    return (
        <div className="m-sm-30">
            <div className="flex flex-wrap justify-between mb-6">
                <div>
                    <h3 className="mt-0 mb-4 font-medium text-28">Cohort: {slug}</h3>
                    <div className="flex">
                        <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3">
                            {cohort && cohort.stage}
            </div>
                    </div>
                </div>
                {isLoading && <MatxLoading />}
            </div>
            <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                    <CohortDetails 
                    slug={slug} 
                    lang={cohort.lang || "en"} 
                    endDate={cohort.ending_date} 
                    startDate={cohort.kickoff_date}
                    id={cohort.id}
                    />
                </Grid>
                <Grid item md={8} xs={12}>
                    <CohortStudents 
                    slug={slug} 
                    id={cohort.id} 
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default Cohort;
