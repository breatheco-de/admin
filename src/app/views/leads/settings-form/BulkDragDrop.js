import React,{useState} from 'react'
import { Button, TextField, MenuItem } from '@material-ui/core';


const BulkDragDrop = () => {
    const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
<TextField defaultValue="1" variant="outlined" size="small" select>
        <MenuItem value="1">Form Entries</MenuItem>
        {/* <MenuItem value="2">Last Month</MenuItem> */}
        {/* <MenuItem value="3">Six Month</MenuItem> */}
        {/* <MenuItem value="4">Last Year</MenuItem> */}
      </TextField>
        <div>
        <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                {isUploading ? 'Pending' : 'Start Uploading'}
              </Button>
        </div>
    </div>
  )
}

export default BulkDragDrop