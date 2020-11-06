import React, { useState, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getAllTodo,
  updateTodoById,
  reorderTodoList,
  getAllTodoTag,
} from "./TodoService";
import { Icon, IconButton, MenuItem, Button, Card } from "@material-ui/core";
import { MatxMenu } from "matx";
import { debounce } from "lodash";
import { useHistory } from "react-router-dom";

const TodoList = ({ query }) => {
  const [isAlive, setIsAlive] = useState(true);
  const [todoList, setTodoList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [filteredTodoList, setFilteredTodoList] = useState([]);

  const history = useHistory();

  const getAllTodoAndTagList = useCallback(async () => {
    let [{ data: todoList }, { data: tagList }] = await Promise.all([
      getAllTodo(),
      getAllTodoTag(),
    ]);
    if (isAlive) {
      setFilteredTodoList(todoList);
      setTodoList(todoList);
      setTagList(tagList);
    }
  }, [isAlive]);

  const search = useCallback(
    debounce((query) => {
      query = query.trim().toLowerCase();

      if (query) {
        let filteredTodoList = todoList.filter(
          (todo) =>
            todo.title.toLowerCase().match(query) ||
            todo.note.toLowerCase().match(query)
        );

        if (query !== "") setFilteredTodoList([...filteredTodoList]);
      }
    }, 250),
    [todoList]
  );

  useEffect(() => {
    getAllTodoAndTagList();
    return () => setIsAlive(false);
  }, [getAllTodoAndTagList]);

  useEffect(() => {
    search(query);
  }, [query, search]);

  const updateTodo = async (todo) => {
    const { data: updatedTodo } = await updateTodoById(todo);
    if (isAlive) {
      let list1 = todoList.map((item) => {
        if (item.id === updatedTodo.id) return updatedTodo;
        return item;
      });
      let list2 = filteredTodoList.map((item) => {
        if (item.id === updatedTodo.id) return updatedTodo;
        return item;
      });
      setTodoList([...list1]);
      setFilteredTodoList([...list2]);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let todoList = reorder(
      filteredTodoList,
      result.source.index,
      result.destination.index
    );

    let { data } = await reorderTodoList(todoList);

    if (isAlive) {
      setFilteredTodoList(data);
      setTodoList(data);
    }
  };

  const filterTodoListByProperty = (queryField, queryValue) => {
    if (queryField !== "all") {
      let list = todoList.filter((todo) => todo[queryField] === queryValue);
      setFilteredTodoList([...list]);
    } else {
      setFilteredTodoList([...todoList]);
    }
  };

  const filterTodoListByTag = (tagId) => {
    if (tagId !== "all") {
      let list = todoList.filter((todo) => todo.tag.includes(tagId));
      setFilteredTodoList([...list]);
    } else {
      setFilteredTodoList([...todoList]);
    }
  };

  return (
    <Card className="todo relative m-sm-30">
      <div className="todo-list__topbar bg-light-gray py-2 flex flex-wrap items-center justify-between">
        <div>
          <MatxMenu
            menuButton={
              <IconButton>
                <Icon>arrow_drop_down</Icon>
              </IconButton>
            }
          >
            <MenuItem onClick={() => filterTodoListByProperty("all")}>
              All
            </MenuItem>
            <MenuItem onClick={() => filterTodoListByProperty("read", true)}>
              Read
            </MenuItem>
            <MenuItem onClick={() => filterTodoListByProperty("read", false)}>
              Unread
            </MenuItem>
            <MenuItem onClick={() => filterTodoListByProperty("done", true)}>
              Done
            </MenuItem>
            <MenuItem onClick={() => filterTodoListByProperty("done", false)}>
              Undone
            </MenuItem>
            <MenuItem
              onClick={() => filterTodoListByProperty("important", true)}
            >
              Important
            </MenuItem>
            <MenuItem
              onClick={() => filterTodoListByProperty("important", false)}
            >
              Unimportant
            </MenuItem>
            <MenuItem onClick={() => filterTodoListByProperty("starred", true)}>
              Starred
            </MenuItem>
            <MenuItem
              onClick={() => filterTodoListByProperty("starred", false)}
            >
              Unstarred
            </MenuItem>
          </MatxMenu>
          <MatxMenu
            menuButton={
              <IconButton>
                <Icon>label</Icon>
              </IconButton>
            }
          >
            <MenuItem
              className="capitalize"
              onClick={() => filterTodoListByTag("all")}
            >
              all
            </MenuItem>
            {tagList.map((tag) => (
              <MenuItem
                key={tag.id}
                className="capitalize"
                onClick={() => filterTodoListByTag(tag.id)}
              >
                {tag.name}
              </MenuItem>
            ))}
          </MatxMenu>
        </div>
        <div className="pr-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/todo/list/add")}
          >
            Create Todo
          </Button>
        </div>
      </div>

      <div className="todo-list">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {filteredTodoList.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        <TodoItem
                          tagList={tagList}
                          updateTodo={updateTodo}
                          key={index}
                          todo={todo}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Card>
  );
};

export default TodoList;
