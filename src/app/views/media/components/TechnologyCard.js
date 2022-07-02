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
import { ErrorOutline, Done, Add } from "@material-ui/icons";
import bc from 'app/services/breathecode';
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
    google: {
        color: "#ec412c",
    },
    twitter: {
        color: "#039ff5",
    },
}));

const TechnologyCard = ({ technology }) => {
    const classes = useStyles();
    const [ edit, setEdit ] = useState(false)
    const [ descriptions, setDescriptions ] = useState(JSON.parse(technology.description || null) ||  { "us": technology.description || "", "es": "" })

    return (
        <Card className="mb-4 pb-4">
            <div className="p-3">
                <Grid container spacing={3} alignItems="center">
                    <Grid item sm={4} xs={12}>
                        <div className="flex items-center m-2">
                            <div className="ml-4">
                                <h5 className="m-0">{technology.title}</h5>
                                <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                    {technology.slug?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <strong className="m-0">Alias</strong>
                        <p className="mb-0 mt-2 text-muted font-normal capitalize">
                            {technology.alias.map(a => <Chip key={a} size="small" label={a} className="mr-1" /> )}
                            <Chip size="small" icon={<Add />} />
                        </p>
                    </Grid>
                </Grid>
            </div>

            {edit && <Divider className="1" />}
            {edit && <div className="p-3">
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
            </div>}
            <Divider className="mb-4" />
            <div className="flex flex-wrap justify-between items-center px-5 m--2">
                <p className="text-muted m-0 m-2">{descriptions['us']}</p>
                <div className="flex flex-wrap m-2">
                    {!edit ? <Button
                        size="small"
                        onClick={() => setEdit(true)}
                        className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                    >
                        Edit
                    </Button>
                    :
                    <Button
                        size="small"
                        onClick={() => bc.registry().updateTechnology(technology.slug, { description: JSON.stringify(descriptions)}).then(() => setEdit(false))}
                        className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                    >
                        Save
                    </Button>}
                </div>
            </div>
        </Card>
    );
};

export default TechnologyCard;