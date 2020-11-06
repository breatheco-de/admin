import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardEditorDialog from "./CardEditorDialog";
import Scrollbar from "react-perfect-scrollbar";
import BoardList from "./BoardList";
import {
  Avatar,
  Card,
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
  Icon,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  reorderCardInList,
  reorderList,
  moveCardInList,
} from "../../redux/actions/ScrumBoardActions";

const ScrumBoardContainer = ({
  list = [],
  handleAddList,
  handleAddNewCard,
}) => {
  const [card, setCard] = useState(null);
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false);
  const [shouldOpenAddList, setShouldOpenAddList] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const dispatch = useDispatch();
  const { board = {} } = useSelector((state) => state.scrumboard);

  const handleCardClick = (card) => {
    setCard(card);
    setShouldOpenDialog(true);
  };

  const handleDialogClose = () => {
    setShouldOpenDialog(false);
  };

  const handleAddListToggle = (value) => {
    setShouldOpenAddList(value);
  };

  const handleChange = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleAddList(columnTitle);
      setColumnTitle("");
    } else setColumnTitle(event.target.value);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // if dropped outside of list
    if (!destination) {
      return;
    }

    if (source.droppableId === "horizontal-droppable") {
      dispatch(reorderList(board.id, source.index, destination.index));
    } else {
      if (source.droppableId === destination.droppableId) {
        dispatch(
          reorderCardInList(
            board.id,
            source.droppableId,
            source.index,
            destination.index
          )
        );
      } else {
        dispatch(
          moveCardInList(
            board.id,
            source.droppableId,
            destination.droppableId,
            source,
            destination
          )
        );
      }
    }
  };

  return (
    <Scrollbar className="relative flex pb-4 w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="horizontal-droppable" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex"
            >
              {list.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                  type="column"
                >
                  {(provided, snapshot) => (
                    <BoardList
                      data={{ provided, snapshot, column }}
                      handleCardClick={handleCardClick}
                      handleDialogClose={handleDialogClose}
                      handleAddNewCard={handleAddNewCard}
                    ></BoardList>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div>
        {shouldOpenAddList ? (
          <ClickAwayListener onClickAway={() => handleAddListToggle(false)}>
            <Card
              className="mx-3 border-radius-0 cursor-pointer p-4 min-w-288"
              elevation={3}
            >
              <TextField
                size="small"
                className="mb-3"
                variant="outlined"
                name="columnTitle"
                value={columnTitle}
                fullWidth
                onChange={handleChange}
                onKeyDown={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleAddListToggle(false)}
                      >
                        <Icon fontSize="small">clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    handleAddList(columnTitle);
                    setColumnTitle("");
                  }}
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
            className="mx-3 cursor-pointer flex items-center py-4 px-4 bg-light-gray min-w-288"
            elevation={3}
            onClick={() => handleAddListToggle(true)}
          >
            <Avatar className="size-24 bg-error">+</Avatar>
            <span className="ml-8 font-medium">Add List</span>
          </Card>
        )}
      </div>

      {shouldOpenDialog && (
        <CardEditorDialog
          card={card}
          open={shouldOpenDialog}
          handleClose={handleDialogClose}
        ></CardEditorDialog>
      )}
    </Scrollbar>
  );
};

export default ScrumBoardContainer;
