import React, { useEffect } from "react";
import {
  Icon,
  IconButton,
  Avatar,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import ScrumBoardContainer from "./ScrumBoardContainer";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MatxMenu } from "matx";

import {
  getBoardById,
  addListInBoard,
  getAllMembers,
  getAllLabels,
  addMemberInBoard,
  addNewCardInList,
  deleteMemberFromBoard,
} from "../../redux/actions/ScrumBoardActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "2px solid white",
  },
}));

const Board = () => {
  const { board = {}, memberList = [] } = useSelector(
    (state) => state.scrumboard
  );

  const { id: boardId } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(getBoardById(boardId));
    dispatch(getAllMembers());
    dispatch(getAllLabels());
  }, [boardId, dispatch]);

  const handleAddList = (listTitle) => {
    if (listTitle !== "") {
      dispatch(
        addListInBoard({
          boardId,
          listTitle,
        })
      );
    }
  };

  const handleAddNewCard = (cardData) => {
    dispatch(
      addNewCardInList({
        boardId,
        ...cardData,
      })
    );
  };

  const handleChange = (event) => {
    let memberId = event.target.value;
    let { members, id } = board;

    if (members.some((member) => member.id === memberId)) {
      dispatch(deleteMemberFromBoard({ boardId: id, memberId }));
    } else dispatch(addMemberInBoard({ boardId: id, memberId }));
  };

  let { members = [], title, list = [] } = board;

  return (
    <div className="scrum-board m-sm-30">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to="/scrum-board">
            <IconButton>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Link>
          <h5 className="m-0 ml-2 capitalize">{title}</h5>
          <IconButton className="ml-2">
            <Icon>star_outline</Icon>
          </IconButton>
        </div>

        <div className="flex relative mr-2 items-center">
          {members.map((member, index) => (
            <Tooltip key={index} title={member.name} fontSize="large">
              <Avatar
                className={clsx("h-24 w-24 ml--2", classes.avatar)}
                src={member.avatar}
              />
            </Tooltip>
          ))}
          <MatxMenu
            horizontalPosition="right"
            shouldCloseOnItemClick={false}
            menuButton={
              <Tooltip title={"Add"} fontSize="large">
                <Avatar
                  className={clsx(
                    "h-24 w-24 ml--2 cursor-pointer",
                    classes.avatar
                  )}
                >
                  +
                </Avatar>
              </Tooltip>
            }
          >
            {memberList.map((user) => (
              <FormControlLabel
                className="ml-0"
                key={user.id}
                control={
                  <Checkbox
                    checked={members.some((member) => member.id === user.id)}
                    onChange={handleChange}
                    value={user.id}
                  />
                }
                label={
                  <div className="flex items-center">
                    <Avatar src={user.avatar} className="size-24"></Avatar>
                    <span className="ml-3">{user.name}</span>
                  </div>
                }
              />
            ))}
          </MatxMenu>
          {/* <Avatar className="number-avatar avatar">+3</Avatar> */}
        </div>
      </div>

      <div className="relative">
        <ScrumBoardContainer
          list={list}
          handleAddList={handleAddList}
          handleAddNewCard={handleAddNewCard}
        ></ScrumBoardContainer>
      </div>
    </div>
  );
};

export default Board;
