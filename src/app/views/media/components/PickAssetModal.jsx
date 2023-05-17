import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
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

const defaultAsset = {
    slug: '',
    title: '',
    lang: '',
    cluster: null,
    expected_monthly_traffic: 0,
    difficulty: 0,
    is_important: false,
    is_urgent: false,
}

export const PickAssetModal = ({
    defaultAlias,
    query,
    hint,
    cluster=null,
    lang=null,
    onClose,
    open
}) => {

    const history = useHistory();
    const [formData, setFormData] = useState([])
    const [ errors, setErrors ] = useState({})
    const label = 'Add asset: ';
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
                    Find your asset
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        width="100%"
                        onChange={(x) => setFormData(x)}
                        label="Search assets or type a new one"
                        value={formData}
                        getOptionLabel={(option) => option.title || `Search assets or type a new one`}
                        asyncSearch={async (searchTerm) => {
                            const resp = await bc.registry().getAllAssets({ ...query, like: searchTerm })
                            if(resp.status === 200){
                                resp.data = [{title: label+searchTerm, value: 'new_asset'}, ...resp.data]
                                return resp
                            }
                            else return resp
                        }}
                    />
                    {hint && <p className="my-2">{hint}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => {
                            if(formData.value === 'new_asset') history.push(`/media/asset/new?title=${formData.title.replace(label,'')}`)
                            else onClose(formData);
                        }}
                    >
                        Select Asset
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickAssetModal.defaultProps = defaultProps;