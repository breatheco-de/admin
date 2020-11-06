import React from "react";
import ChatAvatar from "./ChatAvatar";
import Scrollbar from "react-perfect-scrollbar";
import { Divider } from "@material-ui/core";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  chatSidenav: {
    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
    height: 450,
  },
}));

const ChatSidenav = ({
  currentUser,
  contactList = [],
  recentContactList = [],
  handleContactClick,
}) => {
  const classes = useStyles();

  return (
    <div className={clsx("bg-default", classes.chatSidenav)}>
      <div className="chat-sidenav__topbar flex items-center h-56 px-4 bg-primary">
        <ChatAvatar src={currentUser.avatar} status={currentUser.status} />
        <h5 className="ml-4 whitespace-pre mb-0 font-medium text-18 text-white">
          {currentUser.name}
        </h5>
      </div>
      <Scrollbar className="relative h-full">
        {recentContactList.map((contact, index) => (
          <div
            onClick={() => handleContactClick(contact.id)}
            key={index}
            className="flex items-center p-4 cursor-pointer  gray-on-hover"
          >
            <ChatAvatar src={contact.avatar} status={contact.status} />
            <div className="pl-4">
              <p className="m-0">{contact.name}</p>
              <p className="m-0 text-muted">
                {format(
                  new Date(contact.lastChatTime).getTime(),
                  "MMMM dd, yyyy"
                )}
              </p>
            </div>
          </div>
        ))}
        <Divider />
        {contactList.map((contact, index) => (
          <div
            onClick={() => handleContactClick(contact.id)}
            key={index}
            className="flex items-center px-4 py-1 cursor-pointer  gray-on-hover"
          >
            <ChatAvatar src={contact.avatar} status={contact.status} />
            <div className="pl-4">
              <p>{contact.name}</p>
            </div>
          </div>
        ))}
      </Scrollbar>
    </div>
  );
};

export default ChatSidenav;
