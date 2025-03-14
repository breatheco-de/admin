import React, { useState, useMemo } from 'react';
import { 
    Dialog, DialogActions, DialogContent, DialogTitle, 
    IconButton, Icon, Button, TextField, MenuItem
} from '@material-ui/core';
import { getParams } from '../../../components/SmartDataTable';
import bc from "../../../services/breathecode"

const AddBulkToAssetError = (props) => {
    console.log("AddBulkToAssetError", props);
    const { selectedRows, loadData } = props;
    const [status, setStatus] = useState('ERROR');
    const [open, setOpen] = useState(false);
    const selected = useMemo(() => selectedRows?.data.map((item) => item.index) || [], [selectedRows]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        bc.registry()
        .updateAssetError('', selected.map((item) => {
            return {
                id: props.items[item].id,
                status
            };
        }))
        .then(async (d) => {
            const data = await loadData({ limit: 10, offset: 0, ...getParams(), });
            props.setItems(data.results);
            return d
        })
        .catch((r) => console.error(r));
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <Icon>edit</Icon>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Status</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="ERROR">ERROR</MenuItem>
                        <MenuItem value="FIXED">FIXED</MenuItem>
                        <MenuItem value="IGNORED">IGNORED</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddBulkToAssetError;