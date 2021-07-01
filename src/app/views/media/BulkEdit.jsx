import React, { useState } from 'react';
import {
  Card, FormControlLabel, Checkbox, Button, IconButton, Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';

export const BulkEdit = ({
  categoryList, onClick, clear, total,
}) => {
  const [categories, setCategories] = useState([]);
  const handleCategoryChange = (event) => {
    const { target } = event;
    let tempCategories = [];
    if (target.checked) {
      tempCategories = [...categories, target.name];
    } else {
      tempCategories = categories.filter((item) => item !== target.name);
    }
    setCategories(tempCategories);
  };
  return (
    <div className="px-4">
      <Card elevation={3} className="p-4 mb-4">
        <h5 className="m-0 mb-4">
          Apply to
          {total}
          {' '}
          images
        </h5>
        <div className="d-flex">
          <Tooltip title="Delete Selected Media">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Selected Media">
            <IconButton onClick={clear}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Card>
      <Card elevation={3} className="relative p-4 mb-4">
        <h5 className="m-0 mb-4">
          Apply categories to
          {total}
          {' '}
          images
        </h5>
        {categoryList.map((category) => (
          <div key={category.slug} className="flex items-center justify-between">
            <FormControlLabel
              className="flex-grow"
              name={category.id.toString()}
              onChange={handleCategoryChange}
              control={<Checkbox checked={categories.includes(category.id.toString())} />}
              label={<span className="capitalize">{category.name}</span>}
            />
            {/* <small className="badge bg-light-primary text-primary">
                {category.medias}
              </small> */}
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          className="w-full"
          onClick={() => onClick(categories)}
        >
          Add Categories
        </Button>
      </Card>
    </div>
  );
};
