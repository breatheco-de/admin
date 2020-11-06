import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Card,
  Icon,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
  ClickAwayListener,
  Button,
} from "@material-ui/core";
import ScrumBoardCard from "./ScrumBoardCard";
import Scrollbar from "react-perfect-scrollbar";
import { MatxMenu } from "matx";
import { useDispatch, useSelector } from "react-redux";
import {
  renameListInBoard,
  deleteListFromBoard,
  addNewCardInList,
} from "../../redux/actions/ScrumBoardActions";

const BoardList = ({ data, handleCardClick }) => {
  const [shouldOpenTitleEditor, setShouldOpenTitleEditor] = useState(false);
  const [shouldOpenAddCard, setShouldOpenAddCard] = useState(false);
  const [cardTitleText, setCardTitleText] = useState("");
  const [columnTitleText, setColumnTitleText] = useState("");

  const dispatch = useDispatch();
  const { board = {} } = useSelector((state) => state.scrumboard);

  const handleChange = (event) => {
    let targetName = event.target.name;
    let value = event.target.value;

    if (targetName === "cardTitleText") {
      if (event.key === "Enter" && !event.shiftKey) handleAddNewCard();
      else setCardTitleText(value);
    } else {
      if (event.key === "Enter" && !event.shiftKey) handleRenameList();
      else setColumnTitleText(value);
    }
  };

  const handleRenameList = () => {
    dispatch(
      renameListInBoard({
        boardId: board.id,
        listId: data.column.id,
        listTitle: columnTitleText,
      })
    );
    openTitleEditor(false);
  };

  const openTitleEditor = (value) => {
    setShouldOpenTitleEditor(value);
  };

  const openAddCard = (value) => {
    setShouldOpenAddCard(value);
  };

  const handleAddNewCard = () => {
    if (cardTitleText.trim() !== "") {
      dispatch(
        addNewCardInList({
          boardId: board.id,
          listId: data.column.id,
          cardTitle: cardTitleText,
        })
      );
      setCardTitleText("");
    }
  };

  const handleListDelete = () => {
    dispatch(
      deleteListFromBoard({
        boardId: board.id,
        listId: data.column.id,
      })
    );
  };

  useEffect(() => {
    let listTitle = data?.column?.title;
    if (listTitle) setColumnTitleText(listTitle);
  }, [data]);

  let { provided, snapshot, column } = data;

  return (
    <Card
      className="mx-3 relative pt-2 w-288"
      elevation={snapshot.isDragging ? 10 : 3}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...provided.draggableProps.style,
      }}
    >
      <Droppable droppableId={column.id} direction="vertical" type="card">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className="relative">
            <div className="flex items-center justify-between pb-2">
              {shouldOpenTitleEditor ? (
                <ClickAwayListener onClickAway={() => openTitleEditor(false)}>
                  <TextField
                    className="pl-4"
                    size="small"
                    variant="outlined"
                    value={columnTitleText}
                    onChange={handleChange}
                    onKeyDown={handleChange}
                    name="columnTitleText"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleRenameList}>
                            <Icon fontSize="small">done</Icon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ClickAwayListener>
              ) : (
                <h4
                  className="m-0 flex-grow py-1 pl-4 capitalize"
                  onClick={() => openTitleEditor(true)}
                >
                  {column.title}
                </h4>
              )}
              <MatxMenu
                horizontalPosition="right"
                menuButton={
                  <IconButton>
                    <Icon>more_vert</Icon>
                  </IconButton>
                }
              >
                <MenuItem className="flex items-center min-w-148">
                  <Icon> settings </Icon>
                  <span className="pl-4"> Settings </span>
                </MenuItem>
                <MenuItem
                  onClick={handleListDelete}
                  className="flex items-center min-w-148"
                >
                  <Icon> delete </Icon>
                  <span className="pl-4"> Delete </span>
                </MenuItem>
              </MatxMenu>
            </div>

            <Scrollbar className="relative h-380 px-4">
              {column.cardList.map((card, index) => (
                <Draggable
                  key={card.id}
                  draggableId={card.id}
                  index={index}
                  type="card"
                >
                  {(provided, snapshot) => (
                    <Card
                      className="mb-4 border-radius-4 bg-light-gray"
                      elevation={snapshot.isDragging ? 10 : 3}
                      onClick={() =>
                        handleCardClick({ ...card, listId: column.id })
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <ScrumBoardCard card={card}></ScrumBoardCard>
                    </Card>
                  )}
                </Draggable>
              ))}
            </Scrollbar>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ===================================================== */}
      {shouldOpenAddCard ? (
        <ClickAwayListener onClickAway={() => openAddCard(false)}>
          <Card
            className="position-bottom border-radius-0 cursor-pointer p-4 w-full"
            elevation={5}
          >
            <TextField
              size="small"
              className="mb-3"
              variant="outlined"
              name="cardTitleText"
              value={cardTitleText}
              fullWidth
              onChange={handleChange}
              onKeyDown={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => openAddCard(false)}>
                      <Icon fontSize="small">clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddNewCard}
                variant="contained"
                color="primary"
              >
                Add
              </Button>
            </div>
          </Card>
        </ClickAwayListener>
      ) : (
        <div className="flex">
          <Button
            className="font-medium flex-grow border-radius-0"
            variant="contained"
            color="primary"
            onClick={() => openAddCard(true)}
          >
            + Add Card
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BoardList;
