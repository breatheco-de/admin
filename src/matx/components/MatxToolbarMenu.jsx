import React, { useState } from "react";
import { Icon, IconButton, Hidden } from "@material-ui/core";
import clsx from "clsx";

const MatxToolbarMenu = ({ offsetTop, children }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div
      className={clsx({
        "toolbar-menu-wrap": true,
        open: open,
      })}
    >
      <Hidden mdUp>
        <IconButton onClick={handleToggle}>
          <Icon>{open ? "close" : "more_vert"}</Icon>
        </IconButton>
      </Hidden>

      <div
        style={{ top: offsetTop }}
        className="flex items-center menu-area container"
      >
        {children}
      </div>
    </div>
  );
};

export default MatxToolbarMenu;
