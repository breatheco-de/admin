import React, { useState } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
} from '@material-ui/core';
import { PickCategoryModal } from "../components/PickCategoryModal"
import TextField from '@material-ui/core/TextField';
import slugify from "slugify"
import bc from 'app/services/breathecode';

export const AssetRequirementModal = ({
  data,
  onClose
}) => {

  const [formData, setFormData] = useState(data)
  const [updateCategory, setUpdateCategory]= useState(false);

  const handleUpdateCategory = async (category) => {
    if (category) setFormData({...formData, category})
    setUpdateCategory(false);
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={() => onClose(false)}
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
            {['LESSON', 'EXERCISE', 'PROJECT', 'ARTICLE', 'QUIZ', 'VIDEO', 'STARTER'].map((item) => (
              <MenuItem value={item} key={item}>
                {item.toUpperCase().replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <Button size="small" variant="outlined" color="primary" className="ml-3"
              onClick={() => setUpdateCategory(true)}
            >
              {(formData && formData.category) ? formData.category.title || formData.category.slug : `Click to select category`}
          </Button>
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
            label="Markdown Github URL"
            multiline
            row={5}
            fullWidth
            value={formData.readme_url}
            variant="outlined"
            onChange={(e) => setFormData({ ...formData, readme_url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary" tma
            variant="contained"
            autoFocus
            onClick={() => onClose(formData)}
          >
            Save Requirements
          </Button>
        </DialogActions>
      </Dialog>
      {updateCategory && <PickCategoryModal onClose={handleUpdateCategory} lang={formData.lang} defaultCategory={formData.category} />}
    </>
  )
}
