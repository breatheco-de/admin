import React, { useState, useEffect } from 'react';
import {
    DialogTitle,
    Dialog,
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField
} from "@material-ui/core";
import { Formik } from "formik";
import { AsyncAutocomplete } from './Autocomplete';
import bc from '../services/breathecode';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CustomDialog = ({ open, onClose, formInitialValues, onDelete, title, onSubmit, ...rest }) => {
    const [category, setCategory] = useState([]);
    const [copied, setCopied] = useState(false);
    const [confirm, setConfirm] = useState(false);
    useEffect(() => {
        setCategory(formInitialValues.categories)
        return () => {
            setCategory([]);
            formInitialValues.categories = []
        }
    }, [])
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            {...rest}
        >
            <Formik
                initialValues={formInitialValues}
                onSubmit={(values) => {
                    onSubmit(values);
                    onClose();
                    setCategory([]);
                }}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setSubmitting,
                    setFieldValue,
                }) => (
                    <form className="p-4" onSubmit={handleSubmit}>
                        <DialogTitle id="alert-dialog-title">
                            {title}
                        </DialogTitle>
                        <DialogContent className='px-5'>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item md={2} sm={4} xs={12}>
                                    URL
                            </Grid>
                                <Grid item md={8} sm={6} xs={10}>
                                    <TextField
                                        label="URL"
                                        name="url"
                                        size="medium"
                                        disabled
                                        fullWidth
                                        variant="outlined"
                                        value={values.url}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={2} xs={2}>
                                    <CopyToClipboard text={values.url}
                                        onCopy={() => setCopied(true)}>
                                        <Button className="m-3">{copied ? <span style={{ color: 'red' }}>Copied</span> : "Copy"}</Button>
                                    </CopyToClipboard>
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Mime Type
                                </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Mime"
                                        name="mime"
                                        fullWidth
                                        size="medium"
                                        variant="outlined"
                                        value={values.mime}
                                        disabled
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    File name
                                    </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        fullWidth
                                        size="medium"
                                        variant="outlined"
                                        value={values.name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Slug
                                    </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <TextField
                                        label="Slug"
                                        name="slug"
                                        fullWidth
                                        size="medium"
                                        variant="outlined"
                                        value={values.slug}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={2} sm={4} xs={12}>
                                    Categories
                                    </Grid>
                                <Grid item md={10} sm={8} xs={12}>
                                    <AsyncAutocomplete
                                        onChange={(category) => { setCategory(category); setFieldValue('categories', category.map(c => c.id)); console.log(category, formInitialValues) }}
                                        width={"100%"}
                                        label="Categories"
                                        value={category}
                                        multiple
                                        asyncSearch={() => bc.media().getAllCategories()}
                                        getOptionLabel={option => `${option.name}`}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" autoFocus onClick={() => setConfirm(true)}>
                                Delete file
                            </Button>
                            <Button onClick={onClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" type="submit" autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
            {/* Delete confirm */}
            <Dialog
            open={confirm}
            onClose={() => setConfirm(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            {...rest}
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete this file?
                </DialogTitle>
                <DialogActions>
                    <Button color="secondary" autoFocus onClick={() => { onDelete(); setConfirm(false);}}>
                        Confirm
                    </Button>
                    <Button onClick={() => setConfirm(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}

export default CustomDialog;