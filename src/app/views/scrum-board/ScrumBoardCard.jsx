import React from "react";
import ScrumBoardLabelBar from "./ScrumBoardLabelBar";
import { Button, Icon, Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";

const ScrumBoardCard = ({ card }) => {
  let {
    title,
    members = [], //members in card
    labels = [],
    coverImage,
    attachments,
    comments,
  } = card;

  const { memberList = [], labelList = [] } = useSelector(
    (state) => state.scrumboard
  );

  let modifiedCardMemberList = members.map((boardMemberId) =>
    memberList.find((member) => member.id === boardMemberId)
  );
  let modifiedLabelList = labels.map((labelId) =>
    labelList.find((label) => label.id === labelId)
  );

  return (
    <div className="scrum-board-card">
      {coverImage && (
        <img className="border-radius-4 w-full" src={coverImage} alt="stair" />
      )}
      <div className="px-4 py-3">
        {modifiedLabelList.length !== 0 && (
          <div className="flex mb-3 font-medium">
            {modifiedLabelList.map(
              (label) =>
                label && (
                  <ScrumBoardLabelBar
                    key={label.id}
                    color={label.color}
                  ></ScrumBoardLabelBar>
                )
            )}
          </div>
        )}

        <h6 className="m-0 font-medium">{title}</h6>

        {(comments.length !== 0 ||
          attachments.length !== 0 ||
          members.length !== 0) && (
          <div className="flex items-center justify-between mt-3 button-group text-small">
            <div className="flex">
              {comments.length !== 0 && (
                <Button size="small">
                  <Icon className="mr-1 text-small" fontSize="small">
                    chat
                  </Icon>
                  <span>{comments.length}</span>
                </Button>
              )}
              {attachments.length !== 0 && (
                <Button size="small">
                  <Icon className="mr-1 text-small" fontSize="small">
                    attach_file
                  </Icon>
                  <span>{attachments.length}</span>
                </Button>
              )}
            </div>
            <div className="flex relative face-group">
              {modifiedCardMemberList.map(
                (member) =>
                  member && (
                    <Avatar
                      key={member.id}
                      className="avatar"
                      src={member.avatar}
                    />
                  )
              )}
              {/* <Avatar className="number-avatar avatar">+3</Avatar> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrumBoardCard;
