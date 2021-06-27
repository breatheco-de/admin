/* eslint-disable import/prefer-default-export */
import { makeStyles } from '@material-ui/core/styles';

const generateShadows = (theme) => {
  const classList = {};

  theme.shadows.forEach((shadow, ind) => {
    classList[`.elevation-z${ind}`] = {
      boxShadow: `${shadow} !important`,
    };
  });

  return classList;
};

export const shadowStyles = makeStyles(({ palette, ...theme }) => ({
  '@global': {
    ...generateShadows(theme),
  },
}));
