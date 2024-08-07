import React from "react";
import ScrumBoardLabelBar from "./ScrumBoardLabelBar";
import { Button, Icon, Avatar } from "@material-ui/core";
import { labels, iconTypes } from "./initBoard"
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
                        color={labels[card.test_status?.toLowerCase()]}
                    ></ScrumBoardLabelBar>
                    <ScrumBoardLabelBar
                        color={labels[card.sync_status?.toLowerCase()]}
                    ></ScrumBoardLabelBar>
                </div>

                <h6 className="m-0 font-medium">{title}</h6>

                {(comments.length !== 0 ||
                    attachments.length !== 0 ||
                    members.length !== 0) && (
                        <div className="flex items-center justify-between mt-3 button-group text-small">
                            <div className="flex">
                                <Button size="small"><Tooltip title={card.type}><Icon className="mr-1 text-small" fontSize="small">
                                    {iconTypes[card.type?.toLowerCase()]}
                                </Icon></Tooltip></Button>
                                {comments.length !== 0 && (
                                    <Button size="small">
                                        <Icon className="mr-1 text-small" fontSize="small">
                                            chat
                                        </Icon>
                                        <span>{comments.length}</span>
                                    </Button>
                                )}
                            </div>
                            <div className="flex relative face-group">
                                {card.members.length === 0 ?
                                    <Icon>person_add</Icon>
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