import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardHeader, CardContent, IconButton, Badge,
} from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import dayjs from 'dayjs';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
    display: 'flex',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  outsideIcon: {
    position: 'relative',
    top: 15,
    left: 15,
  },
}));

const ActivityGrid = () => {
  const classes = useStyles();

  return (
    <div className="mb-8">
      <div className={classes.outsideIcon}>
        <IconButton className="p-3 bg-primary ">
          <Badge badgeContent={4} color="primary">
            <MailIcon />
          </Badge>
        </IconButton>
      </div>
      <Card>
        <CardHeader title="Shrimp and Chorizo Paella" subheader={dayjs().format('MM-DD-YYYY')} />
        <div className={classes.root}>
          <div className="w-100  text-center">
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </div>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with
              your guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </Typography>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ActivityGrid;
