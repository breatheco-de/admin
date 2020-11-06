import React, { useState, useEffect, useCallback } from "react";
import { Dialog, TextField, Button } from "@material-ui/core";
import { getAllTodoTag, addNewTag, deleteTag } from "./TodoService";
import { generateRandomId } from "utils";

const TagDialog = ({ open, handleClose }) => {
  const [isAlive, setIsAlive] = useState(true);
  const [name, setName] = useState("");
  const [tagList, setTagList] = useState([]);

  const loadTagList = useCallback(async () => {
    let { data } = await getAllTodoTag();
    if (isAlive) setTagList(data);
  }, [isAlive]);

  useEffect(() => {
    loadTagList();
    return () => setIsAlive(false);
  }, [loadTagList]);

  useEffect(() => {
    return () => setIsAlive(false);
  }, []);

  const handleChange = (event) => {
    if (event.key === "Enter") {
      handleAddNewTag();
    } else {
      setName(event.target.value);
    }
  };

  const handleAddNewTag = async (event) => {
    if (name.trim() !== "") {
      let { data: tag } = await addNewTag({
        id: generateRandomId(),
        name: name.trim(),
      });

      if (isAlive) {
        let list = [...tagList];
        list.push(tag);

        setTagList(list);
        setName("");
      }
    }
  };

  const handleDeleteTag = async (id) => {
    await deleteTag({ id, name });
    if (isAlive) {
      let list = tagList.filter((tag) => tag.id !== id);
      setTagList([...list]);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <div className="px-4 py-6">
        <div className="flex items-center">
          <TextField
            variant="outlined"
            size="small"
            onChange={handleChange}
            onKeyDown={handleChange}
            value={name}
            className="flex-grow"
            label="New tag*"
          />
          <div>
            <Button
              onClick={handleAddNewTag}
              className=""
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </div>
        </div>
        <div className="pt-4">
          {tagList.map((tag, index) => (
            <div
              className="flex items-center justify-between my-2"
              key={tag.id}
            >
              <span>{index + 1}</span>
              <span className="capitalize">{tag.name}</span>
              <Button
                onClickCapture={() => handleDeleteTag(tag.id)}
                className="bg-error"
                variant="contained"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <div className="pt-4 text-right">
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default TagDialog;
