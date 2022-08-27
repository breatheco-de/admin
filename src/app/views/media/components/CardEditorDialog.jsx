import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Icon,
  Avatar,
  Button,
  Divider,
  IconButton,
  Grid,
  Chip,
  MenuItem,
  Input,
  FormControlLabel,
  Checkbox,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import dayjs from 'dayjs';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

import { Alert, AlertTitle } from '@material-ui/lab';
import { useTheme } from "@material-ui/core/styles";
import Scrollbar from "react-perfect-scrollbar";
import { labels, iconTypes } from "./initBoard"
import bc from "../../../services/breathecode"

const CardEditorDialog = ({ open, card, handleClose, handleAction, handleCardUpdate }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [comments, setComments] = useState([]);
  const [url, setUrl] = useState(card.url);
  const [newComment, setNewComment] = useState({});

  const closeDialog = () => {
    handleClose();
  };

  const sendComment = async () => {
    const resp = await bc.registry().createAssetComment({ ...newComment, asset: card.id })
    if (resp.status == 201) setComments([...comments, resp.data]);
  };

  const toggleResolveComment = async (c) => {
    const resp = await bc.registry().updateComment(c.id, { resolved: !c.resolved })
    if (resp.status == 200) setComments(comments.map(com => com.id === resp.data.id ? resp.data : com));
  };

  const deleteComment = async (c) => {
    const resp = await bc.registry().deleteComment(c.id)
    if (resp.status == 204) setComments(comments.filter(com => com.id != c.id));
  };

  useEffect(async () => {
    const resp = await bc.registry().getAssetComments(card.slug)
    if (resp.status == 200) setComments(resp.data);
  }, [])
  useEffect(() => { setUrl(card.url) }, [card.url])

  return (
    <Dialog
      onClose={closeDialog}
      open={open}
      fullScreen={isMobile}
      fullWidth={true}
      scroll="body"
    >
      <div className="scrum-board">
        {(card.sync_status != "OK" || card.test_status != "OK") && <Alert severity="warning">
          <AlertTitle className="m-auto">{card.status_text}</AlertTitle>
        </Alert>}
        <div className="px-sm-24 pt-sm-24">
          <div className="flex items-center">
            <div className="flex items-center flex-grow">
              <Icon className="text-muted">{iconTypes[card.type.toLowerCase()]}</Icon>
              <Input
                className="flex-grow  ml-3 pl-3px pr-2 capitalize font-medium text-16"
                type="text"
                autoFocus
                name="title"
                disableUnderline={true}
                value={`${card.type}: ${card.title}`}
              ></Input>
            </div>
            <IconButton size="small" onClick={closeDialog}>
              <Icon>clear</Icon>
            </IconButton>
          </div>

          <div className="ml-10">
            <div className="mb-4 flex flex-wrap">
              <div className="flex relative face-group">
                {card.members.length === 0 ? <Tooltip title="No one has been assigned to this card, click to assign">
                  <IconButton onClick={() => handleAction('assign')}>
                    <Icon>person_add</Icon>
                  </IconButton>
                </Tooltip> :
                  card.members.map((member) => (
                    <Tooltip title={member.name} key={member.id}><Avatar
                      className="avatar mt-2 ml-2"
                      src={member.avatar}
                    /></Tooltip>
                  ))}
                <Tooltip title={`Test status is ${card.test_status}, click to test again`}>
                  <IconButton onClick={() => handleAction('test')}>
                    <Icon color={labels[card.test_status.toLowerCase()]}>{card.test_status === "OK" ? 'check_circle' : 'cancel'}</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Sync status is ${card.sync_status}, click to sync again`}>
                  <IconButton color={labels[card.sync_status.toLowerCase()]} onClick={() => handleAction('sync')}>
                    {card.sync_status === "OK" ? <Icon>cloud_done</Icon> : <Icon>cloud_download</Icon>}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        {card.seo_keywords && card.seo_keywords.length > 0 && <div className="px-sm-24">
          <div className="flex items-center mb-2">
            <Icon className="text-muted">search</Icon>
            <h6 className="m-0 ml-4 uppercase text-muted">SEO Keywords</h6>
          </div>
          <div className="ml-10 mb-4 flex">
            {card.seo_keywords.map(k => <Chip key={k} size="small" label={k.title} color='gray' className="mr-2" />)}
          </div>
        </div>}

        <Scrollbar className="relative mb-4 max-h-380">
          <div className="px-sm-24">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">description</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">Requirements</h6>
            </div>
            <div className="ml-10 mb-4 flex">
              {(!card.requirements || card.requirements == "") && <span>No requirements defined.</span>}
              {card.requirements}
            </div>
          </div>
          <div className="px-sm-24">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">insert_link</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">Article URL</h6>
            </div>
            <div className="ml-10 mb-4 flex">
              <TextField
                className="text-muted"
                onChange={(e) => setUrl(e.target.value)}
                name="description"
                value={url}
                variant="outlined"
                fullWidth
              />
              {url != card.url && <Button variant="contained" color="primary" onClick={() => handleCardUpdate({ ...card, url })}>Save</Button>}
            </div>
          </div>

          <div className="px-sm-24">
            <div className="flex items-center mb-2">
              <Icon className="text-muted">message</Icon>
              <h6 className="m-0 ml-4 uppercase text-muted">comments</h6>
            </div>
            <div className="comments ml-10">
              {comments.map((comment) => {
                return (
                  <div className="mb-4" key={comment.id}>
                    <div className="flex items-center mb-2">
                      <Avatar className="avatar size-36" src={comment.author.profile.avatar_url} />
                      <div className="ml-3">
                        <h6 className="m-0">{comment.author.first_name || "User without first name"} {comment.author.last_name}</h6>
                        <small>
                          {comment.created_at ? dayjs(comment.created_at).fromNow() : "0 sec ago"}
                        </small>
                        <small>
                          {comment.resolved ?
                            <span><Icon size="small" className="text-11 ml-2">check</Icon> Resolved</span>
                            :
                            <span><Icon color="error" className="text-11 ml-2">cancel</Icon> Not resolved</span>
                          }
                        </small>
                      </div>
                      <div className="ml-3">
                        <IconButton onClick={() => toggleResolveComment(comment)}>
                          {comment.resolved ? <Icon size="small">undo</Icon> : <Icon size="small">check</Icon>}
                        </IconButton>
                        {!comment.resolved && <IconButton onClick={() => deleteComment(comment)}>
                          <Icon size="small">delete</Icon>
                        </IconButton>}
                      </div>
                    </div>
                    <p className="m-0 text-muted">{comment.text}</p>
                  </div>
                );
              })}

              <div className="flex items-center mb-4">
                <div className="flex-grow flex">
                  <TextField
                    className="ml-3 text-muted"
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    variant="outlined"
                    name="commentText"
                    value={newComment?.text || ""}
                    fullWidth
                    inputProps={{
                      style: {
                        padding: "10px",
                      },
                    }}
                  />
                </div>
                <Button onClick={sendComment}>Send</Button>
              </div>
            </div>
          </div>
        </Scrollbar>

      </div >
    </Dialog >
  );
};

export default CardEditorDialog;
