// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import useDebounce from '../hooks/useDebounce';

export function AsyncAutocomplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cache, setCache] = React.useState({});
  // Searching status (whether there is pending API request)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);
  const {
    width,
    onChange,
    value,
    asyncSearch,
    children,
    prefetch = false,
    multiple = false,
    debounced = true,
    label,
    required,
    ...rest
  } = props;
  const search = (searchTerm) => {
    setLoading(true);
    if (cache[searchTerm] !== undefined && debounced) {
      setOptions(cache[searchTerm]);
      setLoading(false);
    } else {
      asyncSearch(searchTerm)
        .then((resp) => {
          const data = resp.data || resp;
          setLoading(false);
          if (!Array.isArray(data)) throw Error('incoming search data must be an array');
          setOptions(data);
          console.log('Data in autocomplete.js', data)
          setCache({
            ...cache,
            [searchTerm]: data,
          });
        })
        .catch((error) => console.error(error));
    }
  };

  React.useEffect(() => {
    if (debounced) {
      if (debouncedSearchTerm) {
        search(debouncedSearchTerm);
      } else {
        setOptions([]);
      }
    } else {
      search();
    }
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    if (prefetch) search();
  }, []);

  return (
    <>
      <Autocomplete
        {...rest}
        style={{ width }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        multiple={multiple}
        onChange={(e, newValue) => {
          setOpen(false);
          onChange(newValue);
        }}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            fullWidth
            onKeyPress={(e) => {
              if (e.key == 'Enter') {
                e.preventDefault();
                return false;
              }
            }}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            required={required}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {children}
    </>
  );
}

AsyncAutocomplete.propTypes = {
  debounced: PropTypes.bool,
  children: PropTypes.any,
  label: PropTypes.string,
  asyncSearch: PropTypes.func,
  value: PropTypes.any,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  prefetch: PropTypes.bool,
};
