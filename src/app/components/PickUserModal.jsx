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
    hint: null,
    onClose: null,
    open: true,
  };

export const PickUserModal = ({
    defaultUser,
    query,
    hint,
    onClose,
    open
}) => {

    const [formData, setFormData] = useState(null)
    const [ error, setError ] = useState(null)

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
                    Find a user
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        defaultValue={defaultUser}
                        width="100%"
                        onChange={(x) => setFormData(x)}
                        label="Search user"
                        value={formData}
                        getOptionLabel={(option) => `${option.first_name} ${option.last_name} ${option.email}`}
                        asyncSearch={async (searchTerm) => {
                            const resp = await bc.auth().getAllUsers({ ...query, like: searchTerm })
                            if(resp.ok) return resp.data
                            else setError("Error fetching users")
                        }}
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
                        Select User
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickUserModal.defaultProps = defaultProps;