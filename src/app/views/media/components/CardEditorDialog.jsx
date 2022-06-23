import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Icon,
  Avatar,
  Button,
  Divider,
  IconButton,
  Grid,
  Card,
  MenuItem,
  Input,
  FormControlLabel,
  Checkbox,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { getTimeDifference, generateRandomId } from "utils.js";
import Scrollbar from "react-perfect-scrollbar";
import { MatxMenu } from "matx";
import { labels } from "./initBoard"
import { updateCardInList } from "../../../redux/actions/ScrumBoardActions";
import { CategoryRounded } from "@material-ui/icons";

const CardEditorDialog = ({ open, card, handleClose }) => {
  const [state, setState] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const closeDialog = () => {
    handleClose();
  };

  const handleChange = (event) => {
    let target = event.target;
    let id = target.value;

    if (target.name === "avatar") {
      let { cardMembers, boardMembers } = state;
      let member = boardMembers.find((user) => user.id === id);

      if (!target.checked) {
        cardMembers.splice(cardMembers.indexOf(member), 1);
        setState({ ...state, cardMembers });
      } else {
        cardMembers.push(member);
        setState({ ...state, cardMembers });
      }
    } else if (target.name === "label") {
      let { labels } = state;
      let label = labelList.find((item) => item.id === parseInt(id));

      if (!target.checked) {
        labels.splice(labels.indexOf(label), 1);
        setState({ ...state, labels });
      } else {
        labels.push(label);
        setState({ ...state, labels });
      }
    } else if (
      event.key === "Enter" &&
      !event.shiftKey &&
      target.name === "commentText"
    ) {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
      sendComment();
    } else {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSave = () => {

  }

  return (
    <Dialog
      onClose={closeDialog}
      open={open}
      fullScreen={isMobile}
      fullWidth={true}
      scroll="body"
    >
      <div className="scrum-board">
        <div className="px-sm-24 pt-sm-24">
          <div className="flex items-center">
            <div className="flex items-center flex-grow">
              <Icon className="text-muted">assignment</Icon>
              <Input
                className="flex-grow  ml-3 pl-3px pr-2 capitalize font-medium text-16"
                type="text"
                autoFocus
                name="title"
                onChange={handleChange}
                disableUnderline={true}
                value={card.title}
              ></Input>
            </div>
            <IconButton size="small" onClick={closeDialog}>
              <Icon>clear</Icon>
            </IconButton>
          </div>

          <div className="ml-10">
            <div className="mb-4 flex flex-wrap">
              <Button
                key={card.type}
                size="small"
                variant="contained"
                className={`capitalize mr-1 text-white text-small bg-${labels[card.type.toLowerCase()].color}`}
              >
                {card.type}
              </Button>
              <div className="flex relative face-group">
                {card.members.length === 0 ? <Tooltip title="No one has been assigned to this card">
                  <IconButton>
                    <Icon>person_add</Icon>
                  </IconButton>
                </Tooltip> :
                  card.members.map((member) => (
                    <Tooltip title={member.name}><Avatar
                      key={member.id}
                      className="avatar"
                      src={member.avatar}
                    /></Tooltip>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Scrollbar className="relative pt-4 mb-4 max-h-380">
          <div className="px-sm-24 pt-4">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">description</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">description</h6>
            </div>
            <div className="ml-10 mb-4 flex">
              <TextField
                className="text-muted"
                onChange={handleChange}
                name="description"
                value={card.description}
                variant="outlined"
                fullWidth
                multiline
              />
            </div>

          </div>

          <Divider className="my-4"></Divider>

          {/* <div className="px-sm-24">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">message</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">comments</h6>
            </div>
            <div className="comments ml-10">
              {comments.map((comment) => {
                let user = memberList.find((user) => user.id === comment.uid);
                return (
                  <div className="mb-4" key={comment.id}>
                    <div className="flex items-center mb-2">
                      <Avatar className="avatar size-36" src={user.avatar} />
                      <div className="ml-3">
                        <h6 className="m-0">{user.name}</h6>
                        <small>
                          {getTimeDifference(new Date(comment.time))} ago
                        </small>
                      </div>
                    </div>
                    <p className="m-0 text-muted">{comment.text}</p>
                  </div>
                );
              })}

              <div className="flex items-center mb-4">
                <div className="flex-grow flex">
                  <TextField
                    className="ml-3 text-muted"
                    onChange={handleChange}
                    onKeyDown={handleChange}
                    variant="outlined"
                    name="commentText"
                    value={commentText || ""}
                    fullWidth
                    inputProps={{
                      style: {
                        padding: "10px",
                      },
                    }}
                  />
                </div>
                <Button onClick={sendComment}>Send</Button>
              </div>
            </div>
          </div> */}
        </Scrollbar>

        <div className="px-sm-24 mb-3 flex justify-end">
          <Button className="mr-3" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CardEditorDialog;
