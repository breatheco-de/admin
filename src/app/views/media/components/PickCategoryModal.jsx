import React, { useState } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField,
  Grid,
} from '@material-ui/core';
import { AsyncAutocomplete } from 'app/components/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import bc from 'app/services/breathecode';
import slugify from "slugify";
import useAuth from "../../../hooks/useAuth";
import DialogPicker from '../../../components/DialogPicker';
import { availableLanguages } from 'utils';

const defaultProps = {
  query: {},
  hint: null,
  onClose: null,
  defaultAlias: null,
  open: true,
};

const emptyCategory = {
  slug: '',
  title: '',
  lang: '',
  visibility: 'PRIVATE',
  description: null,
}

export const PickCategoryModal = ({
  defaultCategory,
  query,
  hint,
  lang,
  onClose,
  open
}) => {

  const [formData, setFormData] = useState(null);
  const [updateVisibility, setUpdateVisibility] = useState(false);
  const [newCategory, setNewCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { academy } = user;

  const empty = (key) => (!newCategory[key] || newCategory[key] == "");

  const createCategory = async () => {
    let _errors = {};
    if (empty('title')) _errors['title'] = "Empty title";
    if (empty('slug')) _errors['slug'] = "Empty slug";
    if (empty('lang')) _errors['lang'] = "Empty language"

    if (Object.keys(_errors).length == 0) {
      const resp = await bc.registry().createAcademyCategory({ ...newCategory, lang });
      if (resp.status.ok) onClose(resp.data)
    }

    setErrors(_errors)
    return false;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth="md"
      >
        <DialogTitle className="ml-2" id="alert-dialog-title">
          Find or create a category
        </DialogTitle>
        <DialogContent>
          {newCategory ?
            <Grid spacing={3} alignItems="center">
              <div className="flex mt-2">
                <Grid item xs={3} className="py-1">
                  Visibility
                </Grid>{" "}
                <Grid item xs={9}>
                  <div className="px-3 py-1 mb-2 border-radius-4 text-white bg-primary pointer"
                    onClick={() => setUpdateVisibility(true)}
                  >
                    {newCategory.visibility}
                  </div>
                </Grid>
              </div>
              <TextField label="Category Title" size="small" variant="outlined" fullWidth={true} value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value, slug: slugify(e.target.value).toLowerCase() })} />
              {errors["title"] && <small className="text-error d-block">{errors["title"]}</small>}
              <TextField label="Category Slug" className="mt-2" size="small" variant="outlined" fullWidth={true} value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} />
              {errors["slug"] && <small className="text-error d-block">{errors["slug"]}</small>}
              <TextField label="Language" size="small" variant="outlined" select fullWidth={true} onChange={(e) =>
                setNewCategory({ ...newCategory, lang: e.target.value })} value={newCategory.lang}>
                {Object.keys(availableLanguages).map((item) => (
                  <MenuItem value={item} key={item}>
                    {item?.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              {errors["lang"] && <small className="text-error d-block">{errors["lang"]}</small>}
            </Grid>
            :
            <>
              <AsyncAutocomplete
                defaultValue={defaultCategory}
                width="100%"
                onChange={(x) => {
                  if (x.value === 'new_category') setNewCategory({
                    ...emptyCategory,
                    title: x.title.replace("New: ", ""),
                    slug: slugify(x.title.replace("New: ", "")),
                  })
                  else setFormData(x)
                }}
                label="Search or add category"
                value={formData}
                debounced={false}
                filter={(a) => a.academy.id === academy.id}
                getOptionLabel={(option) => option.title || `Type the category title`}
                asyncSearch={async (searchTerm) => {
                    let queries = { ...query, like: searchTerm }
                    if (lang) queries['lang'] = lang 
                    const resp = await bc.registry().getAcademyCategories(queries)
                    if (resp.status === 200) {
                      resp.data = [{ title: 'New: ' + searchTerm, value: 'new_category', academy }, ...resp.data]
                      return resp
                    }
                    else return resp
                }}

              />
              {hint && <p className="my-2">{hint}</p>}
            </>
          }
        </DialogContent>
        <DialogActions>
          <Button
            color="primary" tma
            variant="contained"
            autoFocus
            onClick={() => {
              if (!newCategory) onClose(formData);
              else createCategory();
            }}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
      <DialogPicker
        onClose={opt => {
          if (opt) setNewCategory({ ...newCategory, visibility: opt })
          setUpdateVisibility(false)
        }}
        open={updateVisibility}
        title="Select a visibility"
        options={['VISIBLE', 'PRIVATE', 'UNLISTED']}
      />
    </>
  )
}

PickCategoryModal.defaultProps = defaultProps;