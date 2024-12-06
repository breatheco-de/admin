import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    Avatar,
    Divider,
    Button,
    Icon,
    TablePagination,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
import history from "history.js";

const SEOMenu = ({languages, handleLanguageByFilter}) => (
    <>
        <Card className="pb-8">
            <div className="p-3 flex-column">
                <h5 className="m-0">Search Engine Optimization</h5>
                <p className="mb-1 text-muted font-normal capitalize">
                    SEO Strategies revole around technologies and clusters.
                </p>
                <p className="mt-0 mb-2 text-muted font-normal capitalize">
                    Create as many clusters as you need and optimizer between 2 to 10 keywords on each of them.
                </p>
            </div>
            <Divider className="mb-8" />
            <div className="mb-8">
                <p className="text-muted mt-0 mb-3 ml-3">Navegation</p>
                <Button onClick={() => history.push('./cluster')} variant="text" className="w-full justify-start px-3">
                    <Icon fontSize="small">cloud_queue</Icon>
                    <span className="ml-2">Clusters</span>
                </Button>
                <Button onClick={() => history.push('./technology')} variant="text" className="w-full justify-start px-3">
                    <Icon fontSize="small">important_devices</Icon>
                    <span className="ml-2">Main Technologies</span>
                </Button>
                <Button onClick={() => history.push('./technology?include_children=true')} variant="text" className="w-full justify-start px-3">
                    <Icon fontSize="small">important_devices</Icon>
                    <span className="ml-2">All Technologies</span>
                </Button>
                {/* <Button onClick={() => history.push('./keyword')} variant="text" className="w-full justify-start px-3">
                    <Icon fontSize="small">filter_1</Icon>
                    <span className="ml-2">Keywords</span>
                </Button> */}
            </div>
    
            {/* <div>
                <p className="text-muted mt-0 mb-3 ml-3">MY TEAM</p>
                <Button variant="text" className="w-full justify-start px-3">
                    <Icon fontSize="small">favorite</Icon>
                    <span className="ml-2">Favorite</span>
                </Button>
            </div> */}
        </Card>
        <Card className="mt-4">
            <div className="relative p-4 mb-4">
                <h5 className="m-0 mb-4">Languages</h5>
                {languages.map(({ label, value }) => (
                    <div key={value} className="flex items-center justify-between">
                        <FormControlLabel
                            className="flex-grow"
                            name={value}
                            onChange={handleLanguageByFilter}
                            control={<Checkbox />}
                            label={<span className="capitalize">{label}</span>}
                        />
                    </div>
                ))}
            </div>
        </Card>
    </>
);

export default SEOMenu;