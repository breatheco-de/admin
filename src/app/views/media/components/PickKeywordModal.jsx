import React, { useState } from 'react';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
    MenuItem,
    TextField,
    Grid,
} from '@material-ui/core';
import { AsyncAutocomplete } from 'app/components/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import bc from 'app/services/breathecode';
import slugify from "slugify";
const filter = createFilterOptions();

const defaultProps = {
    query: {},
    hint: null,
    onClose: null,
    defaultAlias: null,
    open: true,
  };

const defaultKeyword = {
    slug: '',
    title: '',
    lang: '',
    cluster: null,
    expected_monthly_traffic: 0,
    difficulty: 0,
    is_important: false,
    is_urgent: false,
}

export const PickKeywordModal = ({
    defaultAlias,
    query,
    hint,
    cluster=null,
    lang=null,
    onClose,
    open
}) => {

    const [formData, setFormData] = useState([])
    const [ newKeyword, setNewKeyword ] = useState(null)
    const [ errors, setErrors ] = useState({})

    const empty = (key) => (!newKeyword[key] || newKeyword[key] == "");
    const createKeyword = async () => {
        let errors = {};
        if(empty('title')) errors['title'] = "Empty keyword title";
        if(empty('slug')) errors['slug'] = "Empty keyword slug";
        if(empty('difficulty') || newKeyword['difficulty'] == 0) errors['difficulty'] = "Please specify a difficulty from 1 to 100";
        if(empty('expected_monthly_traffic') || newKeyword['expected_monthly_traffic'] == 0) errors['expected_monthly_traffic'] = "Please specify an expected monthly traffic";

        if(Object.keys(errors).length == 0){
            const resp = await bc.registry().createSEOKeyword({ ...newKeyword, cluster: cluster?.id || query.cluster, lang: lang || query.lang });
            if(resp.status > 200 && resp.status < 300) onClose(resp.data)
        }

        setErrors(errors)
        return false;
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth="md"
            >
                <DialogTitle className="ml-2" id="alert-dialog-title">
                    Find your keyword
                </DialogTitle>
                <DialogContent>
                    {newKeyword ?
                        <Grid spacing={3} alignItems="center">
                            <TextField label="Keyword Title" size="small" variant="outlined" fullWidth={true} value={newKeyword.title} onChange={(e) => setNewKeyword({ ...newKeyword, title: e.target.value, slug: slugify(e.target.value).toLowerCase() })} />
                            {errors["title"] && <small className="text-error d-block">{errors["title"]}</small>}
                            <TextField label="Keyword Slug" className="mt-2" size="small" variant="outlined" fullWidth={true} value={newKeyword.slug} onChange={(e) => setNewKeyword({ ...newKeyword, slug: e.target.value })} />
                            {errors["slug"] && <small className="text-error d-block">{errors["slug"]}</small>}
                            <div className="flex mt-2">
                                <Grid item xs={6}>
                                    <TextField label="Difficulty" type="number" size="small" variant="outlined" fullWidth={true} value={newKeyword.difficulty} onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })} />
                                </Grid>{" "}
                                <Grid item xs={6}>
                                    <TextField label="Expected Monthly Volume" type="number" size="small" variant="outlined" fullWidth={true} value={newKeyword.expected_monthly_traffic} onChange={(e) => setNewKeyword({ ...newKeyword, expected_monthly_traffic: e.target.value })} />
                                </Grid>
                            </div>
                            {errors["difficulty"] && <small className="text-error d-block">{errors["difficulty"]}</small>}
                            {errors["expected_monthly_traffic"] && <small className="text-error d-block">{errors["expected_monthly_traffic"]}</small>}
                        </Grid>
                    :
                    <>
                        <AsyncAutocomplete
                            width="100%"
                            onChange={(x) => {
                                if(x.value === 'new_keyword') setNewKeyword(defaultKeyword)
                                else setFormData(x)
                            }}
                            label="Search keywords or type a new one"
                            value={formData}
                            getOptionLabel={(option) => option.title || `Search keywords or type a new one`}
                            asyncSearch={async (searchTerm) => {
                                const resp = await bc.registry().getAllKeywords({ ...query, like: searchTerm })
                                if(resp.status === 200){
                                    resp.data = [{title: 'Add keyword: '+searchTerm, value: 'new_keyword'}, ...resp.data]
                                    return resp
                                }
                                else return resp
                            }}
                        />
                        {hint && <p className="my-2">{hint}</p>}
                    </>
                }
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => {
                            if(!newKeyword) onClose(formData);
                            else createKeyword();
                        }}
                    >
                        Add Keyword
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickKeywordModal.defaultProps = defaultProps;