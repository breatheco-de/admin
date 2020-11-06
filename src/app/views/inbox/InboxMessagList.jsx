import React, { Fragment, useState } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ReactHtmlParser from "react-html-parser";
import {
  IconButton,
  Icon,
  Checkbox,
  Avatar,
  MenuItem,
} from "@material-ui/core";
import { MatxMenu } from "matx";
import { format } from "date-fns";
import { getTimeDifference } from "utils";

const InboxMessageList = ({ messageList, handleCheckboxSelection }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansionPanel = (index) => {
    if (index === expanded) setExpanded(false);
    else setExpanded(index);
  };

  return (
    <div className="mx-1 mb-1">
      {messageList.map((message, index) => (
        <ExpansionPanel
          key={message.id}
          expanded={expanded === index}
          elevation={3}
        >
          <ExpansionPanelSummary className="p-0 pl-2 pr-6">
            <div className="flex items-center w-full px-2">
              {expanded !== index && (
                <Fragment>
                  <Checkbox
                    checked={message.selected}
                    onChange={(event) => handleCheckboxSelection(event, index)}
                    color="secondary"
                  />
                  <IconButton>
                    <Icon>star_border</Icon>
                  </IconButton>
                </Fragment>
              )}

              <div
                className="flex flex-grow items-center justify-between h-full"
                onClick={() => toggleExpansionPanel(index)}
              >
                {expanded === index && (
                  <div className="flex items-center ml-3">
                    <Avatar src={message.sender.photo} />
                    <div className="ml-2">
                      <h5 className="mb-0 ml-1 font-normal">
                        {message.sender.name}
                      </h5>
                      <small className="text-muted">
                        {format(
                          new Date(message.date).getTime(),
                          "MMMM dd, yyyy"
                        )}
                      </small>
                    </div>
                  </div>
                )}

                {expanded !== index && (
                  <h5 className="mb-0 ml-1 text-14 text-muted font-normal">
                    {message.sender.name}
                  </h5>
                )}

                <p className="m-0">{message.subject}</p>
                <small className="text-muted">
                  {getTimeDifference(new Date(message.date))} ago
                </small>
              </div>
              <MatxMenu
                menuButton={
                  <IconButton>
                    <Icon>more_vert</Icon>
                  </IconButton>
                }
              >
                <MenuItem className="flex items-center">
                  <Icon className="mr-4">reply</Icon> Reply
                </MenuItem>
                <MenuItem className="flex items-center">
                  <Icon className="mr-4">archive</Icon> Archive
                </MenuItem>
                <MenuItem className="flex items-center">
                  <Icon className="mr-4">delete</Icon> Delete
                </MenuItem>
              </MatxMenu>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>{ReactHtmlParser(message.message)}</div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export default InboxMessageList;
