import React, { useState } from 'react';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
    MenuItem,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { AsyncAutocomplete } from 'app/components/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import bc from 'app/services/breathecode';
import slugify from "slugify";
const filter = createFilterOptions();
export const AddKeywordModal = ({
    defaultAlias,
    cluster,
    onClose
}) => {

    const [formData, setFormData] = useState([])
    return (
        <>
            <Dialog
                open={true}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth="md"
            >
                <DialogTitle className="ml-2" id="alert-dialog-title">
                    Add Keyword to cluster
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        width="100%"
                        onChange={(x) => setFormData({ ...x, cluster: cluster.id })}
                        label="Search keywords or type a new one"
                        value={formData}
                        getOptionLabel={(option) => `${option.title}`}
                        asyncSearch={(searchTerm) => bc.registry().getAllKeywords({ like: searchTerm, cluster: "null" })}
                    />
                    <p className="my-2">Only orphan keywords (without cluster) will show here, if you want to move a keyword from one cluster to another find the keyword on the original cluster.</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => onClose(formData)}
                    >
                        Add Keyword
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
