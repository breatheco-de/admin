import React, { useState, useEffect, useCallback } from "react";
import {
    Grid,
    Card,
    Avatar,
    Divider,
    Button,
    Icon,
    TablePagination,
    TextField,
    InputAdornment,
} from "@material-ui/core";

import { Link } from 'react-router-dom';
import { Breadcrumb } from "matx";
import bc from 'app/services/breathecode';
import ClusterCard from "./components/ClusterCard";
import SEOMenu from "./components/SEOMenu";
import { useHistory } from 'react-router-dom';
import { useQuery } from "app/hooks/useQuery";
import { debounce } from 'lodash';

const UserList3 = () => {
    const [clusters, setClusters] = useState(null);
    const [addCluster, setAddCluster] = useState(null);
    const [technologies, setTechnologies] = useState([]);

    const query = useQuery()
    const [search, setSearch] = useState(query.get('like') !== null ? query.get('like') : '');

    const history = useHistory();

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const [selectedLangs, setSelectedLangs] = useState(query.get('lang') !== null ? query.get('lang').split(','):[])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearch = (value) => {
        setSearch(value); 
        perfomSearch(value);
    };

    const languages = [
        {label: "Español", value: "es"},
        {label: "English", value: "us"},
    ]

    const handleLanguageByFilter = (event) =>{
        const lang = event.target.name
        const isChecked = event.target.checked
        const updatedLang = isChecked ? lang : ""
        setSelectedLangs(updatedLang)

        history.replace(
            `/media/seo/cluster?${Object.keys({
                limit: rowsPerPage,
                offset: page * rowsPerPage,
                like: search,
                lang: updatedLang,
            })
                .map(
                  (key) => `${key}=${{ limit: rowsPerPage, offset: page * rowsPerPage, like: search, lang:updatedLang }[key]}`)
                .join('&')}`
            );
        bc.registry()
                .getAllClusters({ limit: rowsPerPage, 
                    offset: page * rowsPerPage, 
                    like: search, 
                    lang: updatedLang,
                })
                .then((res) =>{
                setClusters(res.data)
            });
    }

    const perfomSearch = useCallback(
        debounce((search) => {
            bc.registry()
                .getAllClusters({ limit: rowsPerPage, 
                    offset: page * rowsPerPage, 
                    like: search, 
                    lang: selectedLangs,
                })
                .then((res) =>{
                setClusters(res.data)
            });
            history.replace(
            `/media/seo/cluster?${Object.keys({
                limit: rowsPerPage,
                offset: page * rowsPerPage,
                like: search,
                lang: selectedLangs
            })
                .map(
                  (key) => `${key}=${{ limit: rowsPerPage, offset: page * rowsPerPage, like: search, lang:selectedLangs }[key]}`)
                .join('&')}`
            );
        }, 300),
        [rowsPerPage, page, history, selectedLangs]
    );

    useEffect(() => {
        const fetchClusters = async () => {

            const resp = await bc.registry().getAllClusters({ 
                limit: rowsPerPage, 
                offset: page * rowsPerPage, 
                like: search,
                lang: selectedLangs || undefined,

            });
            if (resp.status == 200) {
                console.log('Data recibida:', resp.data);
                setClusters(resp.data);
            }
        };
        fetchClusters();
    }, [rowsPerPage, page, selectedLangs]);

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
                    <SEOMenu languages={languages} handleLanguageByFilter={handleLanguageByFilter} selectedLang={selectedLangs} />
                </Grid>
                <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                        <div className="flex flex-col items-center w-full mb-4 mt-2">
                        <TextField
                            className="bg-paper w-full"
                            size="small"
                            margin="none"
                            name="search"
                            variant="outlined"
                            placeholder="Search here..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Icon fontSize="small">search</Icon>
                                </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        </div>    
                        <Grid container spacing={2}>
                        {addCluster && (
                            <ClusterCard isEditing
                                cluster={{
                                    title: 'Sample cluster',
                                    slug: 'sample-cluster',
                                    lang: 'us',
                                    isDeprecated: false,
                                    keywords: []
                                }}
                                onSubmit={async (_cluster) => {
                                    const resp = await bc.registry().createCluster(_cluster)
                                    if (resp.ok) {
                                        setClusters({
                                            ...clusters,
                                            results: [resp.data, ...clusters.results],
                                        })
                                        setAddCluster(false)
                                        return resp.data;
                                    }
                                    else return false;
                                }}
                            />
                        )}
                        {clusters?.results?.map((cluster) => {
                            return(
                                <Grid key={cluster.id} item sm={12} xs={12}>
                                    <ClusterCard 
                                        cluster={cluster}
                                        onSubmit={async (_cluster) =>{
                                            const resp = await bc.registry().updateCluster(cluster.slug, _cluster);
                                            return resp.status === 200 ? resp.data : false
                                        }}
                                        />
                                </Grid>
                            )
                        })}
                    </Grid>
                    </Grid>
                    <div className="mt-4">
                        <TablePagination
                            className="px-4"
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={clusters?.count || 0}
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