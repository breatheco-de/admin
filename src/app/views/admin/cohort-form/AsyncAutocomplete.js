// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from "cross-fetch";
import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useDebounce from "./useDebounce";
import axios from "../../../../axios";

export default function AsyncAutocomplete() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  // API search results
  const [results, setResults] = React.useState([]);
  // Searching status (whether there is pending API request)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const searchUsers = (searchTerm) => {
      setLoading(true)
      axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?name=${searchTerm}`)
      .then(({data}) => {
          setLoading(false)
          setOptions(data);
        })
      .catch(error => console.log(error))
  }

  React.useEffect(() => {
    if (debouncedSearchTerm) {
        searchUsers(debouncedSearchTerm);
    } else {
        setOptions([]);
    }
    
  }, [debouncedSearchTerm]);


  return (
    <Autocomplete
      multiple
      id="asynchronous-demo"
      style={{width:"100%"}}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => {
          return option.first_name === value.first_name
        }}
      getOptionLabel={option => `${option.first_name} ${option.last_name}, (${option.email})`}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label="Search users"
          fullWidth
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
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
