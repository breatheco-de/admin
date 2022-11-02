import React, { useState } from 'react';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import { AsyncAutocomplete } from 'app/components/Autocomplete';
import bc from 'app/services/breathecode';

const defaultProps = {
    query: {},
    onClose: null,
    open: true,
  };

export const PickTechnologyModal = ({
    query,
    lang,
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
                    Find or create a technology
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        width="100%"
                        multiple
                        onChange={(x) => setFormData(x)}
                        label="Search technology"
                        value={formData}
                        getOptionLabel={(option) => option.title || `Type technology title`}
                        asyncSearch={(searchTerm) => bc.registry().getAllTechnologies({ ...query, like: searchTerm, lang })}
                    />
                    <p className="my-2">Technologies are shared among all academies</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => onClose(formData)}
                    >
                        Add Technology
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickTechnologyModal.defaultProps = defaultProps;