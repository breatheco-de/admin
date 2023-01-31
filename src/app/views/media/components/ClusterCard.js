import React, { useState } from "react";
import {
    Card,
    Button,
    Avatar,
    Grid,
    TextField,
    MenuItem,
    Chip,
    LinearProgress,
    Divider,
} from "@material-ui/core";
import { GoogleIcon } from "matx";
import history from '../../../../history';
import bc from 'app/services/breathecode';
import ReactCountryFlag from "react-country-flag"
import { AssetRequirementModal } from './AssetRequirementModal';
import { ErrorOutline, Done, Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { PickKeywordModal } from './PickKeywordModal';
import slugify from "slugify";
import clsx from "clsx";
import { useEffect } from "react";

const ClusterCard = ({ cluster, isEditing, onSubmit }) => {
    const [ requestAssetModal, setRequestAssetModal ] = useState(null)
    const [ clusterForm, setClusterForm ] = useState(cluster)
    const [ editMode, setEditMode ] = useState(false)
    const [ addKeyword, setAddKeyword ] = useState(false)
    const progress = (() => {
        if(!clusterForm.keywords) return 0;
        const without = clusterForm.keywords.filter(k => k.published_assets.length == 0).length;
        const total = clusterForm.keywords.length;
        return (without == 0 || total == 0) ? "100" : Math.round(100 - (without / total * 100));
    })();

    useEffect(() => setEditMode(isEditing), [isEditing])
    const handleAddKeyword = async (keyword) => {

        if(!keyword) setAddKeyword(false);
        else{
            const resp = await bc.registry().updateKeyword(keyword.slug, { cluster: cluster.id })
            if(resp.ok){
                setClusterForm({ ...clusterForm, keywords: clusterForm.keywords.concat(resp.data)})
                setAddKeyword(false);
            }
        }
    }

    const getClusterDetails = async (_c) => {
        const resp = await bc.registry().getCluster(_c.slug);
        if(resp.ok){
            setClusterForm(resp.data)
            return resp.data;
        }
        else throw new Error('Error fetching cluster details')
    }
    return (
        <Card className="mb-4 pb-4">
            {requestAssetModal && 
                <AssetRequirementModal 
                    data={requestAssetModal} 
                    onClose={async _asset => {
                        if(_asset){
                            _asset.category = _asset.category.id
                            const resp = await bc.registry().createAsset(_asset);
                            if(resp.status >= 200 && resp.status < 300){
                                setClusterForm({
                                    ...clusterForm,
                                    keywords: clusterForm.keywords.map(k => {
                                        if(_asset.seo_keywords.includes(k.slug)){ 
                                            k.published_assets = k.published_assets.filter(a => a != _asset.slug).concat([_asset.slug])
                                        }
                                        return k
                                    })
                                })
                            }
                        }
                        setRequestAssetModal(null);
                    }} 
                />
            }
            <div className="p-3">
                { editMode ? 
                <Grid container spacing={3} alignItems="center" className="m-2">
                    <TextField
                        className="m-2"
                        label="Cluster title"
                        data-cy="title"
                        name="title"
                        size="small"
                        variant="outlined"
                        value={clusterForm.title}
                        onChange={(e)=> setClusterForm({ 
                            ...clusterForm, 
                            title: e.target.value,
                            slug: slugify(e.target.value.toLowerCase())
                        })}
                    />
                    <TextField
                        className="m-2"
                        label="Cluster slug"
                        data-cy="slug"
                        name="slug"
                        size="small"
                        variant="outlined"
                        value={clusterForm.slug}
                        onChange={(e)=> setClusterForm({ ...clusterForm, slug: slugify(e.target.value) })}
                    />
                    <TextField
                        className="m-2"
                        label="Language"
                        data-cy="language"
                        size="small"
                        variant="outlined"
                        value={clusterForm.lang.toLowerCase()}
                        onChange={(e)=> setClusterForm({ ...clusterForm, lang: e.target.value.toUpperCase() })}
                        select
                        >
                        {['es', 'us'].map((item) => (
                            <MenuItem value={item} key={item}>
                            {item.toUpperCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                :
                <Grid container spacing={3} alignItems="center">
                    <Grid item sm={5} xs={12}>
                        <div>
                            <h5 className="m-0">{clusterForm.title}</h5>
                            <p className="mb-0 mt-0 text-muted font-normal">
                                <ReactCountryFlag className="mr-2" countryCode={clusterForm.lang} svg />
                                {clusterForm.slug?.toLowerCase()}
                            </p>
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <p className="m-0 font-medium text-muted">Progress</p>
                                <p className="m-0 text-muted">{progress}%</p>
                            </div>
                            <div>
                                <LinearProgress
                                    color="primary"
                                    value={progress}
                                    variant="determinate"
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={7} xs={12}>
                        {clusterForm.keywords?.map(k => {
                            const _status = k.published_assets.length == 0 ? "error" : "default";
                            return <Chip onClick={() => _status === "error" ? setRequestAssetModal({ seo_keywords: [k.slug] }) : history.push(`/media/asset?keyword=${k.slug}`)}
                                key={k.slug} size="small" label={k.slug} 
                                color={_status}
                                icon={_status == "default" ? <Done /> : <ErrorOutline />} className={`mr-2 mb-2 ${_status == "error" && 'bg-error'}`} />;
                        })}
                        <Chip size="small" className="pointer mr-2 mb-2" icon={<Add onClick={() => setAddKeyword({ cluster: clusterForm.id })} />} />
                    </Grid>
                </Grid>
            }
            </div>

            <Divider className="mb-4" />

            <div className="flex flex-wrap justify-between items-center px-5 m--2">
                <p className="text-muted m-0 m-2">
                    {editMode ? 
                        <TextField
                            className="m-2"
                            label="Landing URL"
                            data-cy="landing-url"
                            size="small"
                            variant="outlined"
                            value={clusterForm.landing_page_url?.toLowerCase() || ""}
                            onChange={(e)=> setClusterForm({ ...clusterForm, landing_page_url: e.target.value.toLowerCase() })}
                        />
                        :
                        clusterForm.landing_page_url
                    }
                </p>
                <div className="flex flex-wrap m-2">
                    {editMode ? 
                        <><Button
                            size="small"
                            color="primary"
                            variant="contained"
                            className="px-5 mr-1"
                            onClick={async () => {
                                const data = await onSubmit(clusterForm)
                                if(data){
                                    console.log("onsubmit", data)
                                    setEditMode(null)
                                    setClusterForm(data)
                                }
                            }}
                        >
                            Save cluster
                        </Button>
                        <Button
                            size="small"
                            color="primary"
                            className="px-5 mr-1"
                            onClick={() => {
                                setEditMode(null);
                                setClusterForm(cluster);
                            }}
                        >
                            Cancel
                        </Button>
                        </>
                    :
                        <>
                            <Button
                                size="small"

                                className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                                onClick={() => getClusterDetails(cluster).then(() => setEditMode(true))}
                            >
                                Edit
                            </Button>
                        </>
                    }
                </div>
            </div>
            {addKeyword && <PickKeywordModal 
                query={{cluster: "null", lang: clusterForm.lang }} 
                cluster={clusterForm}
                onClose={handleAddKeyword} 
                hint="Only orphan keywords (without cluster) will show here, if you want to move a keyword from one cluster to another find the keyword on the original cluster."
            />}
        </Card>
    );
};

export default ClusterCard;
