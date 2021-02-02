import axios from "../../../../axios";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export default function Asynchronous({ setSelectedStudent, selectedCohort, width, size }) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const students = await axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?cohorts=${selectedCohort}&roles=STUDENT`)
            await sleep(1e3);

            if (active) {
                setOptions(students.data);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <div className="flex mb-6">
        <Autocomplete
            id="asynchronous-demo"
            style={{ width: width }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            size={size}
            getOptionSelected={(option, value) => {
                setSelectedStudent(option.user.id)
                return option.user.first_name === value.user.first_name
            }}
            getOptionLabel={(option) => `${option.user.first_name} ${option.user.last_name} (${option.user.email})`}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="search cohort"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        )
                    }}
                />
            )}
        />
        </div>
    );
}