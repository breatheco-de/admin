import React, { Component } from "react";
import {
  Card,
  IconButton,
  Icon,
  FormControlLabel,
  Checkbox,
  Chip,
  Button,
  Grid,
  MenuItem,
  Tooltip,
  Hidden,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Link } from "react-router-dom";
import {
  getTodoById,
  getAllTodoTag,
  updateTodoById,
  deleteTodo,
  addTodo,
} from "./TodoService";
import { MatxMenu } from "matx";
import TagDialog from "./TagDialog";

class TodoEditor extends Component {
  state = {
    todo: {
      title: "",
      note: "",
      done: false,
      read: false,
      starred: false,
      important: false,
      startDate: new Date(),
      dueDate: new Date(),
      tag: [],
    },
    tagList: [],
    shouldOpenTagDialog: false,
  };

  componentDidMount() {
    let { id: todoId } = this.props.match.params;

    getAllTodoTag().then(({ data: tagList }) => {
      if (todoId !== "add") {
        getTodoById(todoId).then(({ data }) => {
          if (!data) {
            this.props.history.push("/todo/list");
            return;
          }
          this.setState({
            todo: { ...data },
            tagList: [...tagList],
          });
        });
      } else {
        this.setState({
          tagList,
        });
      }
    });
  }

  addNewTodo = () => {
    let id = this.state.tagList.length + 1;
    addTodo({ ...this.state.todo, id }).then(() => {
      this.props.history.push("/todo/list");
    });
  };

  updateTodo = (todo) => {
    updateTodoById(todo);
    this.setState({
      todo: {
        ...this.state.todo,
        ...todo,
      },
    });
  };

  reloadTagList = () => {
    getAllTodoTag().then(({ data }) => {
      this.setState({
        tagList: [...data],
      });
    });
  };

  addTagInTodo = (id) => {
    let { tag } = this.state.todo;
    if (!tag.includes(id)) {
      tag.push(id);
      this.setState({
        todo: {
          ...this.state.todo,
          tag,
        },
      });
    }
  };

  handleTagDelete = (tagId) => {
    let { tag: tagList = [] } = this.state.todo;
    tagList = tagList.filter((id) => id !== tagId);
    this.setState(
      {
        todo: {
          ...this.state.todo,
          tag: [...tagList],
        },
      },
      () => updateTodoById({ ...this.state.todo })
    );
  };

  handleTodoDelete = () => {
    deleteTodo({ ...this.state.todo }).then(() => {
      this.props.history.push("/todo/list");
    });
  };

  handleChange = (event) => {
    event.persist();
    this.setState({
      todo: {
        ...this.state.todo,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleDateChange = (filedName, date) => {
    this.setState(
      this.setState({
        todo: {
          ...this.state.todo,
          [filedName]: date,
        },
      })
    );
  };

  handleSubmit = (event) => {
    let { id: todoId } = this.props.match.params;

    if (todoId === "add") {
      this.addNewTodo();
    } else {
      updateTodoById({ ...this.state.todo }).then(() => {
        this.props.history.push("/todo/list");
      });
    }
  };

  handleTagDialogToggle = () => {
    this.setState({
      shouldOpenTagDialog: !this.state.shouldOpenTagDialog,
    });
  };

  render() {
    let {
      title,
      note,
      done,
      read,
      starred,
      important,
      startDate,
      dueDate,
      tag: tagIdList = [],
    } = this.state.todo;
    let { tagList } = this.state;

    return (
      <Card className="todo-editor relative m-sm-30">
        <div className="editor__topbar bg-light-gray py-2 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center">
            <Link to="/todo/list">
              <IconButton>
                <Icon>arrow_back</Icon>
              </IconButton>
            </Link>
            <Hidden smDown>
              <FormControlLabel
                className="ml-2"
                onChange={() => this.updateTodo({ ...this.state, done: !done })}
                control={<Checkbox checked={done} />}
                label={`Mark As ${done ? "Und" : "D"}one`}
              />
            </Hidden>
          </div>
          <div className="flex flex-wrap">
            <Tooltip
              title={`Mark As ${read ? "Unr" : "R"}ead`}
              fontSize="large"
            >
              <IconButton
                onClick={() => this.updateTodo({ ...this.state, read: !read })}
              >
                <Icon>{read ? "drafts" : "markunread"}</Icon>
              </IconButton>
            </Tooltip>

            <Tooltip
              title={`Mark As ${important ? "Uni" : "I"}mportant`}
              fontSize="large"
            >
              <IconButton
                onClick={() =>
                  this.updateTodo({ ...this.state, important: !important })
                }
              >
                <Icon color={important ? "error" : "inherit"}>
                  {important ? "error" : "error_outline"}
                </Icon>
              </IconButton>
            </Tooltip>

            <Tooltip
              title={`Mark As ${starred ? "Uns" : "S"}tarred`}
              fontSize="large"
            >
              <IconButton
                onClick={() =>
                  this.updateTodo({ ...this.state, starred: !starred })
                }
              >
                <Icon color={starred ? "secondary" : "inherit"}>
                  {starred ? "star" : "star_outline"}
                </Icon>
              </IconButton>
            </Tooltip>

            <Hidden smDown>
              <Tooltip title="Manage tags" fontSize="large">
                <IconButton onClick={this.handleTagDialogToggle}>
                  <Icon>library_add</Icon>
                </IconButton>
              </Tooltip>
            </Hidden>

            <MatxMenu
              menuButton={
                <Tooltip title="Add tags" fontSize="large">
                  <IconButton>
                    <Icon>label</Icon>
                  </IconButton>
                </Tooltip>
              }
            >
              {this.state.tagList.map((tag) => (
                <MenuItem
                  className="capitalize"
                  key={tag.id}
                  onClick={() => this.addTagInTodo(tag.id)}
                >
                  {tag.name}
                </MenuItem>
              ))}
            </MatxMenu>

            <Tooltip title="Delete" fontSize="large">
              <IconButton onClick={this.handleTodoDelete}>
                <Icon>delete_outline</Icon>
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="editor__form p-4">
          {tagIdList.length ? (
            <div className="mb-4">
              {tagIdList.map((tagId) => {
                let tagName = (tagList.find((tag) => tag.id === tagId) || {})
                  .name;
                if (!tagName) return null;
                else
                  return (
                    <Chip
                      className="capitalize mr-2"
                      key={tagId}
                      label={tagName}
                      onDelete={() => this.handleTagDelete(tagId)}
                    />
                  );
              })}
            </div>
          ) : null}

          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={(errors) => null}
          >
            <TextValidator
              className="mb-4 w-full"
              label="Title*"
              onChange={this.handleChange}
              type="text"
              name="title"
              value={title}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextValidator
              className="mb-4 w-full"
              label="Put your notes*"
              onChange={this.handleChange}
              type="text"
              name="note"
              multiline={true}
              value={note}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <div className="mb-4">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={2}>
                  <Grid item lg={3} md={4} sm={12} xs={12}>
                    <KeyboardDatePicker
                      margin="none"
                      id="mui-pickers-date"
                      label="Start Date*"
                      inputVariant="standard"
                      type="text"
                      autoOk={true}
                      value={new Date(startDate)}
                      onChange={(date) =>
                        this.handleDateChange("startDate", date)
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item lg={3} md={4} sm={12} xs={12}>
                    <KeyboardDatePicker
                      margin="none"
                      id="mui-pickers-date"
                      label="End Date*"
                      inputVariant="standard"
                      type="text"
                      autoOk={true}
                      value={new Date(dueDate)}
                      onChange={(date) =>
                        this.handleDateChange("dueDate", date)
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
            <Link to="/todo/list">
              <Button
                variant="outlined"
                color="secondary"
                className="mr-4"
                type="submit"
              >
                cancel
              </Button>
            </Link>
            <Button color="primary" variant="contained" type="submit">
              save
            </Button>
          </ValidatorForm>
        </div>
        <TagDialog
          reloadTagList={this.reloadTagList}
          open={this.state.shouldOpenTagDialog}
          handleClose={this.handleTagDialogToggle}
        />
      </Card>
    );
  }
}

export default TodoEditor;
