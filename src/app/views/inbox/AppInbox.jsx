import React, { useState, useEffect } from "react";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import InboxMessageList from "./InboxMessagList";
import InboxSidenav from "./InboxSidenav";
import InboxTopBar from "./InboxTopbar";
import { getAllMessage } from "./InboxService";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const AppInbox = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [open, setOpen] = useState(false);
  const [masterCheckbox, setMasterCheckbox] = useState(false);
  const [messageList, setMessageList] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidenav = () => {
    setOpen(!open);
  };

  const handleMasterCheckbox = (event) => {
    let temp = messageList;
    let isChecked = event.target.checked;
    if (isChecked) {
      temp.map((message) => {
        message.selected = true;
        return message;
      });
    } else {
      temp.map((message) => {
        message.selected = false;
        return message;
      });
    }
    setMessageList(temp);
    setMasterCheckbox(isChecked);
  };

  const handleCheckboxSelection = (event, index) => {
    event.persist();
    let temp = messageList;
    temp[index].selected = event.target.checked;
    setMessageList([...temp]);
  };

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    getAllMessage().then(({ data }) => {
      if (isAlive) setMessageList(data);
    });
  }, [isAlive]);

  useEffect(() => {
    return () => setIsAlive(false);
  }, []);

  return (
    <div className="flex m-sm-30">
      <div className="w-full">
        <MatxSidenavContainer>
          <MatxSidenav width="220px" toggleSidenav={toggleSidenav} open={open}>
            <InboxSidenav />
          </MatxSidenav>
          <MatxSidenavContent>
            <InboxTopBar
              masterCheckbox={masterCheckbox}
              handleMasterCheckbox={handleMasterCheckbox}
              toggleSidenav={toggleSidenav}
            />
            <InboxMessageList
              handleCheckboxSelection={handleCheckboxSelection}
              messageList={messageList}
            />
          </MatxSidenavContent>
        </MatxSidenavContainer>
      </div>
    </div>
  );
};

export default AppInbox;
