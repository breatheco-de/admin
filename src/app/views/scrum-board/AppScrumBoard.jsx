import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Button,
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
  Icon,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  getAllBoard,
  addNewBoard,
} from "../../redux/actions/ScrumBoardActions";
import { useDispatch, useSelector } from "react-redux";

const AppScrumBoard = () => {
  const [open, setOpen] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");

  const { boardList = [] } = useSelector((state) => state.scrumboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBoard());
  }, [dispatch]);

  const openEditorDialog = (value) => {
    setOpen(value);
  };

  const handleChange = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleAddNewBoard();
    } else setTextFieldValue(event.target.value);
  };

  const handleAddNewBoard = () => {
    let title = textFieldValue.trim();
    if (title !== "") {
      dispatch(addNewBoard(title));
      setTextFieldValue("");
    }
  };

  return (
    <div className="m-sm-30">
      <Grid container spacing={2}>
        {boardList.map((board) => (
          <Grid key={board.id} item lg={3} md={3} sm={12} xs={12}>
            <Link to={`/scrum-board/${board.id}`}>
              <Card className="p-6 cursor-pointer h-152" elevation={3}>
                <h5 className="whitespace-pre-wrap capitalize m-0 font-medium">
                  {board.title}
                </h5>
              </Card>
            </Link>
          </Grid>
        ))}
        <Grid item lg={3} md={3} sm={12} xs={12}>
          {open ? (
            <ClickAwayListener onClickAway={() => openEditorDialog(false)}>
              <Card className="p-6 h-152 w-288" elevation={3}>
                <TextField
                  size="small"
                  onChange={handleChange}
                  onKeyDown={handleChange}
                  className="mb-3"
                  variant="outlined"
                  label="Board Title"
                  value={textFieldValue}
                  autoFocus
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => openEditorDialog(false)}
                        >
                          <Icon fontSize="small">clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddNewBoard}
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </div>
              </Card>
            </ClickAwayListener>
          ) : (
            <Card
              onClick={() => openEditorDialog(true)}
              className="p-6 flex items-center justify-center cursor-pointer h-150px"
              elevation={3}
            >
              <div className="text-primary text-center font-medium">
                <h1 className="m-0 text-primary font-normal">+</h1>
                <div>Create New Board</div>
              </div>
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AppScrumBoard;
