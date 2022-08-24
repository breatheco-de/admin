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

const defaultProps = {
    query: {},
    hint: null,
    onClose: null,
    defaultAlias: null,
    open: true,
  };

export const AddKeywordModal = ({
    defaultAlias,
    query,
    hint,
    onClose,
    open
}) => {

    const [formData, setFormData] = useState([])
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
                    <AsyncAutocomplete
                        width="100%"
                        onChange={(x) => setFormData(x)}
                        label="Search keywords or type a new one"
                        value={formData}
                        getOptionLabel={(option) => `${option.title}`}
                        asyncSearch={(searchTerm) => bc.registry().getAllKeywords({ ...query, like: searchTerm })}
                    />
                    {hint && <p className="my-2">{hint}</p>}
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

AddKeywordModal.defaultProps = defaultProps;