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
import useAuth from 'app/hooks/useAuth';

const defaultProps = {
    query: {},
    onClose: null,
    open: true,
  };

export const PickAssessmentModal = ({
    query,
    lang,
    onClose,
    open
}) => {

    const [formData, setFormData] = useState([])
    const { user } = useAuth();

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
                    Find an assessment
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        width="100%"
                        onChange={(x) => setFormData(x)}
                        label="Search assessment"
                        value={formData}
                        getOptionLabel={(option) => option.title || `Type assessment title`}
                        asyncSearch={(searchTerm) => bc.assessment().getAllAssessments({ ...query, academy: user.academy.id, like: searchTerm, lang })}
                    />
                    <p className="my-2">Only assessments without assigned assess will show in this list</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => onClose(formData)}
                    >
                        Set Assessment
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickAssessmentModal.defaultProps = defaultProps;