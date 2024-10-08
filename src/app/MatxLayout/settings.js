import { createMuiTheme } from '@material-ui/core/styles';
import { forEach, merge } from 'lodash';
import layout1Settings from './Layout1/Layout1Settings';
import { themeColors } from './MatxTheme/themeColors';
import themeOptions from './MatxTheme/themeOptions';

function createMatxThemes() {
  const themes = {};

  forEach(themeColors, (value, key) => {
    themes[key] = createMuiTheme(merge({}, themeOptions, value));
  });
  return themes;
}
const themes = createMatxThemes();

export const MatxLayoutSettings = {
  activeLayout: 'layout1', // layout1, layout2
  activeTheme: 'blue', // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: true,
  beta: process.env.NODE_ENV != 'production',
  themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: 'slateDark1', // View all valid theme colors inside MatxTheme/themeColors.js
  },
};
