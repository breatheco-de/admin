// *https://www.registers.service.gov.uk/registers/country/use-the-api*
// import React from "react";
// import { TextField, CircularProgress, Button } from "@material-ui/core";
// import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
// import useDebounce from "../../../hooks/useDebounce";
// import axios from "../../../../axios";

// export default function StudentAutoComplete({ addUserTo, cohort_id, button_label, showForm, setSelectedStudent, selectedCohort, ...rest }) {
//     const filter = createFilterOptions();
//     const [open, setOpen] = React.useState(false);
//     const [options, setOptions] = React.useState([]);
//     const [loading, setLoading] = React.useState(false);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [value, setValue] = React.useState("");
//     const { slug } = selectedCohort;

//     // Searching status (whether there is pending API request)
//     const debouncedSearchTerm = useDebounce(searchTerm, 500);

//     // const searchUsers = (searchTerm) => {
//     //     setLoading(true)
//     //     axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?name=${searchTerm}`)
//     //         .then(({ data }) => {
//     //             setLoading(false);
//     //             setOptions(data);
//     //         })
//     //         .catch(error => console.log(error))
//     // }

//     const searchUsers = () => {
//         setLoading(true)
//         axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?cohorts=${slug}&roles=STUDENT`)
//             .then(({ data }) => {
//                 setLoading(false);
//                 setOptions(data);
//             })
//             .catch(error => console.log(error))
//     }


//     const filterOptions = (options, params) => {
//         const filtered = filter(options, params);

//         // Suggest the creation of a new value
//         if (params.inputValue !== '') {
//             filtered.push({
//                 newUser: <Button
//                     onClick={(e) => {
//                         setOpen(false)
//                         e.stopPropagation();
//                         showForm({
//                             show: true,
//                             data: {
//                                 first_name: params.inputValue
//                             }
//                         });
//                     }}
//                 >
//                     Invite '{params.inputValue}' to Breathecode
//               </Button>,
//                 first_name: params.inputValue
//             });
//         }
//         return filtered;
//     }

//     React.useEffect(() => {
//         if (debouncedSearchTerm) {
//             searchUsers(debouncedSearchTerm);
//         } else {
//             setOptions([]);
//         }

//     }, [debouncedSearchTerm]);


//     return (
//         <Autocomplete
//             id="asynchronous-demo"
//             style={{ width: "100%" }}
//             inputValue={value}
//             onInputChange={(e, value) => {
//                 setSearchTerm(e.target.value);
//                 setValue(value);
//             }}
//             open={open}
//             onOpen={() => {
//                 setOpen(true);
//             }}
//             onClose={() => {
//                 setOpen(false);
//             }}
//             filterOptions={filterOptions}
//             getOptionSelected={(option, value) => {
//                 setSelectedStudent(option.id);
//                 return option.first_name === value.first_name
//             }}
//             getOptionLabel={option => `${option.first_name}`}
//             renderOption={option => {
//                 return option.newUser ? option.newUser : `${option.first_name} ${option.last_name}, (${option.email})`
//             }}
//             options={options}
//             loading={loading}
//             renderInput={params => (
//                 <TextField
//                     {...params}
//                     label="Search Student"
//                     fullWidth
//                     variant="outlined"
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                             <React.Fragment>
//                                 {loading ? (
//                                     <CircularProgress color="inherit" size={20} />
//                                 ) : null}
//                                 {params.InputProps.endAdornment}
//                             </React.Fragment>
//                         )
//                     }}
//                 />
//             )}
//         />

//     );
// }

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

export default function Asynchronous({ setSelectedStudent, selectedCohort }) {
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
        <Autocomplete
            id="asynchronous-demo"
            style={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
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
    );
}