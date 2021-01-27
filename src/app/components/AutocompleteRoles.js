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

export const AutocompleteRoles = ({onChange, placeholder, size, width,value}) => {
    const [allRoles, setAllRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
          value={value}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          size={size}
          onChange={(e, newValue) => {
            allRoles.filter((item) => {
              return newValue === "" || item.name.includes(newValue) || item.slug.includes(newValue)
            }).map(item => `${item.name}`)
            onChange(newValue);
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
    )
} 