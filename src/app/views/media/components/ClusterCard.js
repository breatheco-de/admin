import React, { useState } from "react";
import {
    Card,
    Button,
    Avatar,
    Grid,
    Chip,
    LinearProgress,
    Divider,
} from "@material-ui/core";
import { GoogleIcon } from "matx";
import history from '../../../../history';
import bc from 'app/services/breathecode';
import { AssetRequirementModal } from './AssetRequirementModal';
import { ErrorOutline, Done } from "@material-ui/icons";
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

const ClusterCard = ({ cluster }) => {
    const classes = useStyles();
    const [ requestAssetModal, setRequestAssetModal ] = useState(null)
    const progress = (() => {
        const without = cluster.keywords.filter(k => k.published_assets.length == 0).length;
        const total = cluster.keywords.length;
        return (without == 0 || total == 0) ? "100" : Math.round(100 - (without / total * 100));
    })();

    return (
        <Card className="mb-4 pb-4">
            {requestAssetModal && <AssetRequirementModal data={requestAssetModal} onClose={_asset => _asset ? bc.registry().createAsset(_asset) : setRequestAssetModal(null)} />}
            <div className="p-3">
                <Grid container spacing={3} alignItems="center">
                    <Grid item sm={3} xs={12}>
                        <div className="flex items-center m-2">
                            <div className="ml-4">
                                <h5 className="m-0">{cluster.title}</h5>
                                <p className="mb-0 mt-2 text-muted font-normal capitalize">
                                    {cluster.slug?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={3} xs={12}>
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
                    </Grid>
                    <Grid item sm={5} xs={12}>
                        {cluster.keywords.map(k => {
                            const _status = k.published_assets.length == 0 ? "error" : "default";
                            return <Chip onClick={() => _status === "error" ? setRequestAssetModal({ seo_keywords: [k.slug] }) : history.push(`media/seo/asset?keyword=${k.slug}`)}
                                key={k.slug} size="small" label={k.slug} 
                                color={_status}
                                icon={_status == "default" ? <Done /> : <ErrorOutline />} className={`mr-2 mb-2 ${_status == "error" && 'bg-error'}`} />;
                        })}
                    </Grid>
                </Grid>
            </div>

            <Divider className="mb-4" />

            <div className="flex flex-wrap justify-between items-center px-5 m--2">
                <p className="text-muted m-0 m-2">Registered 3 mins ago</p>
                <div className="flex flex-wrap m-2">
                    <Button
                        size="small"
                        className="bg-light-primary hover-bg-primary text-primary px-5 mr-1"
                    >
                        Details
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ClusterCard;