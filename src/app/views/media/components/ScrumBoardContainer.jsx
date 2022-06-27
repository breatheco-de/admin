import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardEditorDialog from "./CardEditorDialog";
import Scrollbar from "react-perfect-scrollbar";
import BoardList from "./BoardList";
import bc from "../../../services/breathecode"
import { newCard } from "./initBoard"

const ScrumBoardContainer = ({
    list = [],
    handleAddList,
    handleAddNewCard,
    handleMoveCard,
    handleCardAction,
    onCardUpdate,
}) => {
    const [card, setCard] = useState(null);
    const [shouldOpenDialog, setShouldOpenDialog] = useState(false);
    const [shouldOpenAddList, setShouldOpenAddList] = useState(false);
    const [columnTitle, setColumnTitle] = useState("");

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
        handleMoveCard(source.droppableId, destination.droppableId, result.draggableId);
    };

    useEffect(async () => {
        if (card) {
            const resp = await bc.registry().getAsset(card.slug)
            if (resp.status === 200) setCard(newCard(resp.data))
        }
    }, [list])
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

            {shouldOpenDialog && (
                <CardEditorDialog
                    key={card.hash}
                    card={card}
                    open={shouldOpenDialog}
                    handleClose={handleDialogClose}
                    handleAction={(action) => handleCardAction(action, card)}
                    handleCardUpdate={onCardUpdate}
                ></CardEditorDialog>
            )}
        </Scrollbar>
    );
};

export default ScrumBoardContainer;