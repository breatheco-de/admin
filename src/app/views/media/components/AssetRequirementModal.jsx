import React, { useState } from 'react';
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import slugify from "slugify"
import { useParams } from 'react-router-dom';
import bc from 'app/services/breathecode';
import { toast } from 'react-toastify';
import ReactCountryFlag from "react-country-flag"
import { ConfirmationDialog } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import { PickCategoryModal } from "../components/PickCategoryModal";
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

export const availableLanguages = {
  "us": "English",
  "es": "Spanish",
  "it": "Italian",
  "ge": "German",
  "po": "Portuguese",
}


export const AssetRequirementModal = ({
  data,
  onClose
}) => {
  const [formData, setFormData] = useState(data)
  const [updateCategory, setUpdateCategory] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUpdateCategory = async (c) => {
    if (c) setFormData({ ...formData, category: c })
    setUpdateCategory(false);
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={() => onClose(true)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="ml-2" id="alert-dialog-title">
          Create a new asset for the content team
        </DialogTitle>
        <DialogContent>
          <TextField
            className="m-2"
            label="Select asset type"
            size="small"
            fullWidth
            variant="outlined"
            value={formData.asset_type}
            onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
            select
          >
            {['LESSON', 'EXERCISE', 'PROJECT', 'ARTICLE', 'QUIZ', 'VIDEO'].map((item) => (
              <MenuItem value={item} key={item}>
                {item.toUpperCase().replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className="m-2"
            label="Title"
            size="small"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })}
          />
          <TextField
            className="m-2"
            label="Slug"
            size="small"
            fullWidth
            variant="outlined"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <TextField
            className="m-2"
            label="Requirements"
            multiline
            row={5}
            fullWidth
            value={formData.requirements}
            variant="outlined"

          />
          <p className="p-0 m-2">Select an asset category:</p>
              <Button size="small" variant="outlined" color="primary" className="ml-3"
              onClick={() => {
                setUpdateCategory(true)
                setErrors({ ...errors, category: null })
              }}
            >{(formData && formData.category) ? formData.category.title || formData.category.slug : `Click to select`}
          </Button>
          {errors["category"] && <small className="text-error">{errors["category"]}</small>}

        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            autoFocus
            onClick={() => onClose(formData)}
          >
            Save Requirements
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={errorDialog}
        noLabel="Close"
        maxWidth="md"
        onConfirmDialogClose={() => setErrorDialog(false)}
        title="We found some errors"
      >
        <List size="small">
          {Object.keys(errors).map((e, i) =>
            <ListItem key={i} size="small" className="p-0 m-0">
              <ListItemText className="capitalize" primary={errors[e]} />
            </ListItem>
          )}
        </List>
      </ConfirmationDialog>
      {updateCategory && <PickCategoryModal onClose={handleUpdateCategory} lang={formData.lang} defaultCategory={formData.category} />}
    </>
  )
}
