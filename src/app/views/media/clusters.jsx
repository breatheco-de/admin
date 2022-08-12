import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Avatar,
    Divider,
    Button,
    Icon,
    TablePagination,
} from "@material-ui/core";
import { Link } from 'react-router-dom';
import { Breadcrumb } from "matx";
import bc from 'app/services/breathecode';
import ClusterCard from "./components/ClusterCard";
import SEOMenu from "./components/SEOMenu";

const UserList3 = () => {
    const [clusters, setClusters] = useState([]);
    const [addCluster, setAddCluster] = useState(null);
    const [technologies, setTechnologies] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(async () => {
        const resp = await bc.registry().getAllClusters();
        if (resp.status == 200) setClusters(resp.data)
    }, []);

    return (
        <div className="m-sm-30">
            <div className="flex flex-wrap justify-between mb-6">
                <Breadcrumb
                    routeSegments={[
                        { name: "Content Gallery", path: "#" },
                        { name: "SEO", path: "#" },
                        { name: "Clusters", path: "/media/seo/cluster" },
                    ]}
                />
                <div className="">
                    <Button variant="contained" color="primary" onClick={() => setAddCluster(true)}>
                        Add Topic Cluster
                    </Button>
                </div>
            </div>
            <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                    <SEOMenu />
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                        {addCluster && <Grid item sm={12} xs={12}>
                            <ClusterCard isEditing
                                cluster={{
                                    title: 'Sample cluster',
                                    slug: '',
                                    lang: 'us',
                                    isDeprecated: false,
                                    keywords: []
                                }}
                                onSubmit={(_cluster) => console.log("save cluster", _cluster)}
                            />
                        </Grid>}
                        {clusters
                            .map((c) => (
                                <Grid key={c.slug} item sm={12} xs={12}>
                                    <ClusterCard cluster={c} />
                                </Grid>
                            ))}
                    </Grid>
                    <div className="mt-4">
                        <TablePagination
                            className="px-4"
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={clusters.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default UserList3;