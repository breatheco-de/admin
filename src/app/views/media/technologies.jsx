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
import { Breadcrumb } from "matx";
import bc from 'app/services/breathecode';
import TechnologyCard from "./components/TechnologyCard";
import SEOMenu from "./components/SEOMenu";

const UserList3 = () => {
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
        const resp = await bc.registry().getAllTechnologies();
        if (resp.status == 200) setTechnologies(resp.data)
    }, []);

    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Content Gallery", path: "#" },
                        { name: "SEO", path: "#" },
                        { name: "Technologies", path: "/media/seo/technology" },
                    ]}
                />
            </div>
            <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                    <SEOMenu />
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                        {technologies
                            .map((t) => (
                                <Grid key={t.slug} item sm={12} xs={12}>
                                    <TechnologyCard technology={t} />
                                </Grid>
                            ))}
                    </Grid>
                    <div className="mt-4">
                        <TablePagination
                            className="px-4"
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={technologies.length}
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