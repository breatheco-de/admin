import React, { useState, useEffect } from 'react';
import {
  Icon,
  Badge,
  Card,
  Button,
  IconButton,
  Drawer,
  TextField,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { getTimeDifference } from 'utils.js';
import { getHashtringParams, setHashstringParams } from '../../../../utils'
import bc from 'app/services/breathecode';
import { PickUserModal } from 'app/components/PickUserModal';

import clsx from 'clsx';

const useStyles = makeStyles(({ palette }) => ({
  notification: {
    width: 'var(--sidenav-width)',
    '& .notification__topbar': {
      height: 'var(--topbar-height)',
    },
  },
  notificationCard: {
    '&:hover': {
      '& .delete-button': {
        cursor: 'pointer',
        display: 'unset',
        zIndex: 2,
      },
      '& .assign-button': {
        cursor: 'pointer',
        display: 'unset',
        zIndex: 2,
      },
      '& .resolve-button': {
        cursor: 'pointer',
        display: 'unset',
        zIndex: 2,
      },
    },
    '& .delete-button': {
      display: 'none',
      position: 'absolute',
      right: 0,
      bottom: 6,
    },
    '& .resolve-button': {
      display: 'none',
      position: 'absolute',
      right: 50,
      bottom: 8,
    },
    '& .assign-button': {
      display: 'none',
      position: 'absolute',
      right: 8,
      top: 8,
    },
    '& .card__topbar__button': {
      borderRadius: 15,
      opacity: 0.9,
    },
  },
}));

const CommentBar = ({ container, iconName, title, asset }) => {
  const history = useHistory();
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [assignComment, setAssignComment] = useState(null);

  const classes = useStyles();

  const sendComment = async () => {
    const resp = await bc.registry().createAssetComment({ ...newComment, asset: asset.id })
    if (resp.status == 201){
      setComments([...comments, resp.data]);
      setNewComment({});
    }
  };

  const toggleComment = async (c, propertyName) => {
    const resp = await bc.registry().updateComment(c.id, { [propertyName]: !c[propertyName] })
    if (resp.status == 200) setComments(comments.map(com => com.id === resp.data.id ? resp.data : com));
  };

  const handleAddAssignComment = async (user) => {
    const resp = await bc.registry().updateComment(assignComment.id, { owner: user.id })
    if (resp.ok){
      setAssignComment(null)
      setComments(comments.map(com => com.id === resp.data.id ? resp.data : com));
    }
  };

  const deleteComment = async (c) => {
    const resp = await bc.registry().deleteComment(c.id)
    if (resp.status == 204) setComments(comments.filter(com => com.id != c.id));
  };

  const getCommentFromURL = () => {
    const { comment_bar } = getHashtringParams();
    if(!comment_bar) return;
    else setPanelOpen(comment_bar);
  }

  const closePanel = () => {
    const { comment_bar, ...rest } = getHashtringParams();
    setHashstringParams(rest)
    setPanelOpen(false);
  }

  useEffect(async () => {
    const resp = await bc.registry().getAssetComments({ asset: asset.slug });
    if (resp.status == 200){
      setComments(resp.data);
      getCommentFromURL();
      const unlisten = history.listen(getCommentFromURL);
      return unlisten;
    }


  },[asset.slug])

  return (
    <div style={{ display: "inline" }}>
      {assignComment && <PickUserModal 
        defaultUser={asset.owner}
        onClose={handleAddAssignComment} 
        hint="Assign someone to resolve this comment"
      />}
      <IconButton
        onClick={() => setPanelOpen(true)}
      >
        <Badge color="secondary" badgeContent={comments.filter(c => !c.resolved).length}>
          <Icon>{iconName}</Icon>
        </Badge>
      </IconButton>

      <Drawer
        width="100px"
        container={container}
        variant="temporary"
        anchor="right"
        open={panelOpen}
        onClose={() => closePanel()}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className={classes.notification}>
          <div className="notification__topbar elevation-z6 flex items-center p-4 mb-4">
            <Icon color="primary">{iconName}</Icon>
            <h5 className="ml-2 my-0 font-medium">{title}</h5>
          </div>
          {comments.length == 0 && <div className="px-4"><p>There are no comments on this asset.</p></div>}
          <div className="px-4 mb-3">
            <TextField
              className="text-muted"
              multiline
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              variant="outlined"
              name="commentText"
              placeholder='Click here to start writing a new commend or task'
              value={newComment?.text || ""}
              fullWidth
            />
            {newComment.text?.length > 0 && <Button 
              className="mt-2" 
              onClick={() => sendComment()}
              variant="contained" 
              color="primary" 
              fullWidth
            >Send comment</Button>}
          </div>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={clsx('relative', classes.notificationCard)}
            >
              <IconButton
                size="small"
                className="assign-button bg-light-gray mr-6"
                onClick={() => setAssignComment(comment)}
              >
                <Icon className="text-muted" fontSize="small">
                  person_add
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                className="delete-button bg-light-gray mr-6"
                onClick={() => deleteComment(comment)}
              >
                <Icon className="text-muted" fontSize="small">
                  delete
                </Icon>
              </IconButton>
              <div className="resolve-button">
                <small className={`${comment.delivered ? 'text-success' : 'text-muted'} mr-2`} onClick={() => toggleComment(comment, 'delivered')}>
                  {comment.delivered ? "delivered" : "deliver"}
                </small>
                <small className={`${comment.resolved ? 'text-success' : 'text-muted'}`} onClick={() => toggleComment(comment, 'resolved')}>
                  {comment.resolved ? "accepted" : "accept"}
                </small>
              </div>
              <Card className={`mx-4 mb-3 ${comment.id == panelOpen ? 'bg-light-warning' : ''}`} elevation={3}>
                <div className="px-4 pt-2 pb-4">
                  <p className="m-0">{comment.text}</p>
                  <small className="text-muted d-block">
                    {comment.author.first_name} {comment.author.last_name},{' '}
                    <small className="card__topbar__time text-muted">
                      {getTimeDifference(new Date(comment.created_at))}
                      {' '}
                      ago
                    </small>
                  </small>
                  {comment.resolved ? 
                    <small className="text-light-success d-block">Resolved</small>
                    :
                    comment.delivered ? 
                      <small className="text-orange d-block">Pending review</small>
                      :
                      <small className="text-orange d-block">Unresolved</small>
                  }
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default CommentBar;
