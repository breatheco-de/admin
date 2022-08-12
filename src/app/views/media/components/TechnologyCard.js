import React, {useState } from "react";
import {
    Card,
    Button,
    Grid,
    Chip,
    TextField,
    Divider,
} from "@material-ui/core";
import Field from '../../../components/Field';
import { GoogleIcon } from "matx";
import { Link } from "react-router-dom";
import { ErrorOutline, Done, Add, Delete } from "@material-ui/icons";
import bc from 'app/services/breathecode';
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {AddTechnologyAliasModal} from "./AddTechnologyAliasModal"
import {AssetModal} from "./AssetModal"

const useStyles = makeStyles(({ palette, ...theme }) => ({
    google: {
        color: "#ec412c",
    },
    twitter: {
        color: "#039ff5",
    },
}));

const TechnologyCard = ({ technology, onRefresh }) => {
    const classes = useStyles();
    const [ edit, setEdit ] = useState(false)
    const [ lessons, setLessons ] = useState(false) // opens list of lessons
    const [ assetSlug, setAssetSlug ] = useState(null) //opens modal for asset
    const [ addAlias, setAddAlias ] = useState(false)
    const [ descriptions, setDescriptions ] = useState(JSON.parse(technology.description || null) ||  { "us": technology.description || "", "es": "" })

    const handleAddAlias = async (techs) => {
        console.log("handleAddAlias", techs)
        if(!techs) setAddAlias(false);
        else{
            const resp = await bc.registry().updateTechnologyBulk(techs, { parent: technology.slug })
            if(resp.status == 200){
                onRefresh();
                setAddAlias(false);
            }
        }
    }

    const handleAction = async (action) => {
        const resp = await bc.registry().assetAction(assetSlug, action);
        if (resp.status == 200) return true;
    }

    return (
        <Card className="mb-4">
            <div className="p-3">
                <Grid container spacing={3} alignItems="center">
                    <Grid item sm={4} xs={12}>
                        <div className="flex items-center m-2">
                            <div className="ml-4">
                                <h5 className="m-0 capitalize">{technology.title}</h5>
                                <p className="mb-0 mt-2 text-muted font-normal">
                                    {technology.slug?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </Grid>
                    {technology.parent ? 
                        <Grid item sm={8} xs={12}>
                            <strong className="m-0">This tecnology has a parent</strong>
                            <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                <Chip size="small" label={technology.parent.title} icon={<Delete label={technology.parent.slug} onClick={() => bc.registry().updateTechnology(technology.slug, { parent: null })} />} />
                            </p> 
                        </Grid>
                        : 
                        <Grid item sm={8} xs={12}>
                            <strong className="m-0">Alias</strong><p className="mb-0 mt-2 text-muted font-normal capitalize">
                                {technology.alias.map(a => <Chip key={a} size="small" label={a} className="mr-1 mb-1" /> )}
                                <Chip size="small" className="pointer" icon={<Add onClick={() => setAddAlias(technology.alias)} />} />
                            </p>
                        </Grid>
                    }
                </Grid>
            </div>
            {Array.isArray(lessons) && <>
                <Divider className="1" />
                <div className="p-3">
                    {lessons.map(l => <Chip size="small" label={l.title} onClick={() => setAssetSlug(l.slug)} className="mr-1 pointer" />)}
                    {lessons.length === 0 && <span>No lessons with this technology assigned</span>}
                </div>
            </>}
            {edit && <>
                <Divider className="1" />
                <div className="p-3">
                {Object.keys(descriptions).map(lang => 
                    <Grid key={lang} container className="mt-2">
                        <TextField
                            label={`Language: ${lang}`}
                            value={descriptions[lang]}
                            multiline
                            fullWidth={true}
                            size='small'
                            variant='outlined'
                            onChange={(e) => setDescriptions({ ...descriptions, [lang]: e.target.value})}
                        />
                    </Grid>
                )}
                </div>
            </>}
            {!technology.parent && <>
                <Divider className="mb-4" />
                <div className="flex flex-wrap justify-between items-center px-5 m--2 pb-4">
                    <p className="text-muted m-0 m-2">{descriptions['us']}</p>
                    <div className="flex flex-wrap m-2">
                        {!edit ? <Button
                            size="small"
                            onClick={() => setEdit(true)}
                            className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                        >
                            Edit Technology
                        </Button>
                        :
                        <>
                            <Button
                                size="small"
                                onClick={() => setEdit(false)}
                                className="px-5 mr-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="small"
                                onClick={() => bc.registry().updateTechnology(technology.slug, { description: JSON.stringify(descriptions)}).then(() => setEdit(false))}
                                className="bg-primary hover-bg-primary text-light px-5 mr-1"
                            >
                                Save Techology
                            </Button>
                        </>}

                        {!lessons ? <Button
                            size="small"
                            onClick={async () => {
                                const resp = await bc.registry().getAllAssets({ technologies: technology.slug })
                                if(resp.status == 200) setLessons(resp.data || []);
                            }}
                            className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                        >
                            Lessons
                        </Button>
                        :
                        <Button
                            size="small"
                            onClick={() => setLessons(null)}
                            className="bg-primary hover-bg-primary text-light px-5 mr-1"
                        >
                            Close lessons
                        </Button>}
                    </div>
                </div>
            </>}
            
            {addAlias && <AddTechnologyAliasModal defaultAlias={addAlias} onClose={handleAddAlias} />}
            {assetSlug && <AssetModal handleAction={handleAction} slug={assetSlug} onClose={() => setAssetSlug(null)} />}
        </Card>
    );
};

export default TechnologyCard;