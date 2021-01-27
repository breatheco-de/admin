// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from "react";
import { TextField, CircularProgress, Button } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import useDebounce from "../../../../hooks/useDebounce";
import axios from "../../../../../axios";

export default function AsyncAutocomplete({ addUserTo, cohort_id, button_label, showForm, ...rest }) {
    const filter = createFilterOptions();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [value, setValue] = React.useState("");
    // Searching status (whether there is pending API request)
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const searchUsers = (searchTerm) => {
        setLoading(true)
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?like=${searchTerm}`)
            .then(({ data }) => {
                setLoading(false);
                setOptions(data);
            })
            .catch(error => console.log(error))
    }

    const filterOptions = (options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
            filtered.push({
                newUser: <Button
                    onClick={(e) => {
                        setOpen(false)
                        e.stopPropagation();
                        showForm({
                            show: true,
                            data: {
                                first_name: params.inputValue
                            }
                        });
                    }}
                >
                    Invite '{params.inputValue}' to Breathecode
              </Button>,
                first_name: params.inputValue
            });
        }
        return filtered;
    }

    React.useEffect(() => {
        if (debouncedSearchTerm) {
            searchUsers(debouncedSearchTerm);
        } else {
            setOptions([]);
        }

    }, [debouncedSearchTerm]);


    return (
        <div className="flex m-4">
            <Autocomplete
                id="asynchronous-demo"
                style={{ width: "100%" }}
                inputValue={value}
                onInputChange={(e, value) => {
                    setSearchTerm(e.target.value);
                    setValue(value);
                }}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                filterOptions={filterOptions}
                getOptionSelected={(option, value) => option.first_name === value.first_name}
                getOptionLabel={option =>`${option.first_name}`}
                renderOption={option => {
                    return option.newUser ? option.newUser : <Button
                        onClick={(e) => {
                            setOpen(false)
                            e.stopPropagation();
                            showForm({
                                show: true,
                                data: {
                                    ...option
                                }
                            });
                        }}
                    >
                        {option.first_name} {option.last_name}, ({option.email})
              </Button>
                }}
                options={options}
                loading={loading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Search users"
                        fullWidth
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
