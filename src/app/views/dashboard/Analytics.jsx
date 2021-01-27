import React, { Fragment, useState, useEffect } from "react";
import { Grid, Card } from "@material-ui/core";
import DoughnutChart from "../charts/echarts/Doughnut";
import ModifiedAreaChart from "./shared/ModifiedAreaChart";
import StatCards from "./shared/StatCards";
import TopSellingTable from "./shared/TopSellingTable";
import RowCards from "./shared/RowCards";
import StatCards2 from "./shared/StatCards2";
import UpgradeCard from "./shared/UpgradeCard";
import Campaigns from "./shared/Campaigns";
import { useTheme } from "@material-ui/styles";
import BC from "../../services/breathecode";
import dayjs from "dayjs";

const Analytics = () => {
    const theme = useTheme();
    const [params, setParams] = useState({
        start: dayjs().subtract(30, 'day'),
        end: dayjs(),
        delta: 30
    });
    const [leads, setLeads] = useState({ 
        series:[34, 45, 31, 45, 31, 43, 26, 43, 31, 45, 33, 40],
        xAxis: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        total: 123
    });

    useEffect(() => {
        const academy = JSON.parse(localStorage.getItem("bc-academy"));
        BC.marketing().getLeads({
            start: params.start.format('YYYY-MM-DD'),
            end: params.end.format('YYYY-MM-DD'),
            academy: academy.slug,
            max: 60,
            min: 0
        })
            .then(( { data }) => {
                console.log("data", data)
                let series = [];
                let xAxis = [];
                let total = 0;
                let max = 0;
                let min = 20;
                data.forEach(stamp => {
                    series.push(stamp.total_leads);
                    xAxis.push(dayjs(stamp.created_at__date).format('MM-DD'))
                    total += stamp.total_leads;
                    if(stamp.total_leads > max) max = stamp.total_leads;
                    if(stamp.total_leads < min) min = stamp.total_leads;
                })
                setLeads({ series, xAxis, total, max, min })
            })
    }, [])

    return (
        <Fragment>
            <div className="pb-24 pt-7 px-8 bg-primary">
                <div className="card-title capitalize text-white mb-4 text-white-secondary">
                    Leads day by day
        </div>
                <ModifiedAreaChart
                    height="280px"
                    option={{
                        yAxis: {
                            type: "value",
                            min: leads.min,
                            max: leads.max,
                        },
                        series: [
                            {
                                data: leads.series,
                                type: "line",
                            },
                        ],
                        xAxis: {
                            data: leads.xAxis,
                        },
                    }}
                />
            </div>

            <div className="analytics m-sm-30 mt--18">
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <StatCards metrics={[
                            { label: "Total Leads", value: leads.total }
                        ]} />

                        {/* Top Selling Products */}
                        <TopSellingTable />

                        <StatCards2 />

                        <h4 className="card-title text-muted mb-4">Ongoing Projects</h4>
                        <RowCards />
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Card className="px-6 py-4 mb-6">
                            <div className="card-title">Traffic Sources</div>
                            <div className="card-subtitle">Last 30 days</div>
                            <DoughnutChart
                                height="300px"
                                color={[
                                    theme.palette.primary.dark,
                                    theme.palette.primary.main,
                                    theme.palette.primary.light,
                                ]}
                            />
                        </Card>

                        <UpgradeCard />

                        <Campaigns />
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
};

export default Analytics;
