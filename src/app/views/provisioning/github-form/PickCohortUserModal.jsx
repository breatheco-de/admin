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
    cohortQuery: {},
    cohorUserQuery: {},
    hint: null,
    onClose: null,
    open: true,
  };

export const PickCohortUserModal = ({
    defaultCohort=null,
    defaultCohortUser=null,
    cohortQuery,
    cohorUserQuery,
    hint,
    onClose,
    open
}) => {

    const [cohort, setCohort] = useState(defaultCohort)
    const [cohortUser, setCohortUser] = useState(defaultCohortUser)
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
                    Find a cohort and user
                </DialogTitle>
                <DialogContent>
                    <AsyncAutocomplete
                        defaultValue={defaultCohort}
                        width="100%"
                        onChange={(x) => setCohort(x)}
                        label="Search for active or prework cohorts"
                        value={cohort}
                        getOptionLabel={(option) => `${option.name} (${option.stage})`}
                        asyncSearch={async (searchTerm) => {
                            const resp = await bc.admissions().getAllCohorts({ ...cohortQuery, like: searchTerm })
                            if(resp.ok) return resp.data
                            else setError("Error fetching cohorts")
                        }}
                    />
                    {cohort && <AsyncAutocomplete
                        key={cohort.slug}
                        defaultValue={defaultCohortUser}
                        width="100%"
                        onChange={(x) => setCohortUser(x)}
                        label={`Search user in cohort ${cohort.name}`}
                        value={cohortUser}
                        debounced={false}
                        getOptionLabel={(option) => `${option.user.first_name} ${option.user.last_name} - ${option.user.email}`}
                        asyncSearch={async (searchTerm) => {
                            let q = { ...cohorUserQuery, cohorts: cohort.slug };
                            if(searchTerm) q.like = searchTerm;

                            const resp = await bc.admissions().getAllUserCohorts(q)
                            if(resp.ok) return resp.data
                            else setError("Error fetching cohort users")
                        }}
                    />}
                    {hint && <p className="my-2">{hint}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary" tma
                        variant="contained"
                        autoFocus
                        onClick={() => onClose(cohortUser)}
                    >
                        Select Cohort User
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

PickCohortUserModal.defaultProps = defaultProps;