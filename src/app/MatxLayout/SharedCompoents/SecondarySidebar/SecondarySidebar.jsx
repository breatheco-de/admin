import React from "react";
import { useSelector } from "react-redux";
import SecondarySidebarToggle from "./SecondarySidebarToggle";
import SecondarySidebarContent from "./SecondarySidebarContent";
import SecondarySidenavTheme from "../../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme";

const SecondarySidebar = () => {
  const { settings } = useSelector((state) => state.layout);
  const secondarySidebarTheme =
    settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
      {settings.secondarySidebar.open && <SecondarySidebarContent />}
      <SecondarySidebarToggle />
    </SecondarySidenavTheme>
  );
};

export default SecondarySidebar;
