import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import CohortStudents from "./CohortStudents";
import CohortDetails from "./CohortDetails";
import { MatxLoading } from "matx";
import axios from "../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import DowndownMenu from "../../../components/DropdownMenu"

const options = [
    { label: "Change cohort stage", value: "change_stage" },
    { label: "Cohort Detailed Report", value: "cohort_deport" },
];

const Cohort = () => {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
    const [cohort, setCohort] = useState({})
    useEffect(() => {
        getCohort();
    }, [])

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
    const onSubmit = (values) => {
        console.log(values)
        axios.put(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${cohort.id}`, { ...values, certificate: cohort.certificate.id })
            .then((data) => {
                if (data.status <= 200) {
                    getCohort();
                    setMsg({ alert: true, type: "success", text: "Cohort details updated successfully" });
                } else setMsg({ alert: true, type: "error", text: "Could not update cohort details" });
            })
            .catch(error => {
                console.log(error);
                setMsg({ alert: true, type: "error", text: error.details })
            })
    }

    return (
        <>
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
                            onSubmit={onSubmit}
                        />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <CohortStudents
                            slug={slug}
                            id={cohort.id}
                        />
                    </Grid>
                    {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                        <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                            {msg.text}
                        </Alert>
                    </Snackbar> : ""}
                </Grid>
            </div>
            <DowndownMenu options={options} icon="more_horiz">
                <Button>
                    <Icon>playlist_add</Icon>
                Additional Actions
            </Button>
            </DowndownMenu>
            <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                    <CohortDetails slug={slug} />
                </Grid>
                <Grid item md={8} xs={12}>
                    <CohortStudents slug={slug} />
                </Grid>
            </Grid>
        </>
    );
};

export default Cohort;
