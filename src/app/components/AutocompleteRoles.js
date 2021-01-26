import React,{useState, useEffect} from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../axios";
import {
    TextField,
    Button,
    CircularProgress
  } from "@material-ui/core";

export const AutocompleteRoles = ({buttonLabel, addTo, setState, placeholder, size, width}) => {
    const [allRoles, setAllRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [select, setSelect] = useState("");

    useEffect(() => {
        getAllRoles();
      }, [])

    const getAllRoles = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/role`)
          .then(({ data }) => {
            console.log(data);
            setAllRoles(data);
            setLoading(false);
          })
          .catch(error => console.log(error))
    }

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
            setSelect(value.id);
            setState(value.slug);
            return option.name === value.name
          }}
          getOptionLabel={option => `${option.name}`}
          options={allRoles}
          loading={loading}
          renderInput={params => (
            <TextField
              {...params}
              label={placeholder || "Search Role"}
              fullWidth
              variant="outlined"
              onChange={({ target: { value } }) => {
                allRoles.filter((item) => {
                  return value === "" || item.name.includes(value) || item.slug.includes(value)
                }).map(item => `${item.name}`)
              }}
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
        {buttonLabel ? <Button className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre" onClick={() => addTo(select)}>
          {buttonLabel}
        </Button> : ""}
      </div>
    )
} 