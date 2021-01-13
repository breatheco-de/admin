// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from "react";
import { TextField, CircularProgress,Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useDebounce from "./useDebounce";
import axios from "../../../../../axios";

export default function AsyncAutocomplete({addUserTo, cohort_id, button_label, ...rest}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [select, setSelect] = React.useState("");
  // Searching status (whether there is pending API request)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const searchUsers = (searchTerm) => {
      setLoading(true)
      axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?name=${searchTerm}`)
      .then(({data}) => {
          setLoading(false);
          setOptions(data);
          console.log(data)
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
      <>
    <Autocomplete
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
          setSelect(value.id);
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
    <Button className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre" onClick={() => addUserTo(cohort_id,select)}>
        {button_label}
    </Button>
    </>
  );
}
