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
import bc from 'app/services/breathecode';

export const AddTechnologyAliasModal = ({
    defaultAlias,
    onClose
}) => {

    const [formData, setFormData] = useState(defaultAlias)
    return (
        <>
            <Dialog
                open={true}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className="ml-2" id="alert-dialog-title">
                    Add tecnology alias
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        onChange={(techs) => setFormData(techs.map(t => t.slug || t))}
                        width="100%"
                        multiple="true"
                        label="Search technologies"
                        value={formData}
                        asyncSearch={(searchTerm) => bc.registry().getAllTechnologies({ like: searchTerm })}
                        debounced
                        getOptionLabel={(option) => option.slug || option}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => onClose(formData)}
                    >
                        Save Requirements
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
