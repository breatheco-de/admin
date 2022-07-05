import React, { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    InputAdornment,
    Icon,
    Hidden,
    TablePagination,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import bc from 'app/services/breathecode';
import { useHistory } from 'react-router-dom';
import TechnologyCard from "./components/TechnologyCard";
import SEOMenu from "./components/SEOMenu";
import { useQuery } from '../../hooks/useQuery';

const UserList3 = () => {
    const [technologies, setTechnologies] = useState([]);
    const [total, setTotal] = useState(0);
    const [like, setLike] = useState("");
    const pgQuery = useQuery();
    const history = useHistory();
    const [query, setQuery] = useState({
        offset: pgQuery.get('offset') !== null ? pgQuery.get('offset') : 0,
        limit: pgQuery.get('limit') !== null ? pgQuery.get('limit') : 10,
        like: pgQuery.get('like') !== null ? pgQuery.get('like') : '',
        include_children: pgQuery.get('include_children') !== null ? pgQuery.get('include_children') : false,
    });

    const getTechnologies = async () => {
        const resp = await bc.registry().getAllTechnologies(query);
        if (resp.status == 200) {
            setTechnologies(resp.data?.results || resp.data || [])
            setTotal(resp.data?.count || resp.data.length || 0)
        }
    }

    useEffect(() => {
        getTechnologies();
        history.replace(
            `${window.location.pathname}?${Object.keys(query)
                .map((key) => `${key}=${query[key]}`)
                .join('&')}`,
        );
    }, [query]);

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
                    <div className="flex items-center mb-4 mt-2">
                        <TextField
                            className="bg-paper flex-grow"
                            size="small"
                            margin="none"
                            name="query"
                            variant="outlined"
                            placeholder="Search here..."
                            value={like || ""}
                            onKeyUp={(e) => (e.code === "Enter" || e.code === "NumpadEnter") && setQuery({ ...query, like })}
                            onChange={(e) => setLike(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon fontSize="small">search</Icon>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <Icon onClick={() => setQuery({ ...query, offset: 0, like: undefined })}>clear</Icon>
                    </div>
                    <Grid container spacing={2}>
                        {technologies
                            .map((t) => (
                                <Grid key={t.slug} item sm={12} xs={12}>
                                    <TechnologyCard technology={t} onRefresh={() => getTechnologies()} />
                                </Grid>
                            ))}
                    </Grid>
                    <div className="mt-4">
                        <TablePagination
                            className="px-4"
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={total}
                            rowsPerPage={query.limit}
                            page={query.offset}
                            onChangePage={(e, newPage) => setQuery({ ...query, offset: newPage })}
                            onChangeRowsPerPage={(e) => setQuery({ ...query, limit: +e.target.value, offset: 0 })}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default UserList3;