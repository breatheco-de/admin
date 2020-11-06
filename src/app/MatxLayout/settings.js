import layout1Settings from "./Layout1/Layout1Settings";
import layout2Settings from "./Layout2/Layout2Settings";
import { themeColors } from "./MatxTheme/themeColors";
import { createMuiTheme } from "@material-ui/core/styles";
import { forEach, merge } from "lodash";
import themeOptions from "./MatxTheme/themeOptions";

function createMatxThemes() {
  let themes = {};

  forEach(themeColors, (value, key) => {
    themes[key] = createMuiTheme(merge({}, themeOptions, value));
  });
  return themes;
}
const themes = createMatxThemes();

export const MatxLayoutSettings = {
  activeLayout: "layout1", // layout1, layout2
  activeTheme: "blue", // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: true,

  themes: themes,
  layout1Settings, // open Layout1/Layout1Settings.js
  layout2Settings, // open Layout1/Layout2Settings.js

  secondarySidebar: {
    show: true,
    open: true,
    theme: "slateDark1", // View all valid theme colors inside MatxTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: "slateDark1", // View all valid theme colors inside MatxTheme/themeColors.js
  },
};
