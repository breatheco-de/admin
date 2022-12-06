import React, {useState, useEffect} from "react";
import { IconButton, Icon, Button, Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@material-ui/core";

const EditableTextField = ({ defaultValue, onChange, children, onValidate }) => {
    const [ updating, setUpdating ] = useState(false);
    const [ value, setValue ] = useState(defaultValue);
    const [ valid, setValid ] = useState(true);

    useEffect(() => setValue(defaultValue), [defaultValue])

    return updating ? 
        <div className="flex">
          <TextField size="small" variant="outlined" borderColor={valid ? "grey": "red"} fullWidth={true} value={value} onChange={(e) => setValue(e.target.value)} />
          <IconButton size="small" variant="outlined" onClick={async () => {
            const _valid = onValidate ? await onValidate(value) : true;
            if(valid){
              setUpdating(false)
              if(onChange) onChange(value)
            }
            setValid(_valid);
          }}>
            <Icon>check</Icon>
          </IconButton>
          <IconButton size="small" variant="outlined" onClick={() => {
            setUpdating(false)
            setValue(defaultValue)
          }}>
            <Icon>close</Icon>
          </IconButton>
        </div>
        :
        <div className="flex">
          {children}
          <IconButton size="small" onClick={() => setUpdating(true)}>
            <Icon>edit</Icon>
          </IconButton>
        </div>
      
}
export default EditableTextField;