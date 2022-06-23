import React from "react";
import ScrumBoardLabelBar from "./ScrumBoardLabelBar";
import { Button, Icon, Avatar } from "@material-ui/core";
import { labels } from "./initBoard"
import {
    Tooltip,
} from "@material-ui/core";
const ScrumBoardCard = ({ card }) => {
    let {
        title,
        members = [], //members in card
        attachments,
        comments,
    } = card;

    return (
        <div className="scrum-board-card">
            <div className="px-4 py-3">
                <div className="flex mb-3 font-medium">
                    <ScrumBoardLabelBar
                        key={card.type}
                        color={labels[card.type.toLowerCase()].color}
                    ></ScrumBoardLabelBar>
                </div>

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
                                {card.members.length === 0 ?
                                    <label>Unassigned</label>
                                    : card.members.map(
                                        (member) =>
                                            member && (
                                                <Tooltip key={member.id} title={member.name}><Avatar
                                                    className="avatar"
                                                    src={member.avatar}
                                                /></Tooltip>
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