import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Icon,
  IconButton,
  Button,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
} from '@material-ui/core';

const AnswerStatus = ({ handleClose, open, answer = {} }) => (
  <Dialog
    onClose={handleClose}
    open={open}
    aria-labelledby="simple-dialog-title"
  >
    <div className="px-sm-24 pt-sm-24">
      <div className="flex items-center">
        <div className="flex items-center flex-grow">
          <p className="m-0 mb-4 text-small text-muted">
            Answer with details
          </p>
        </div>
        <IconButton size="small" onClick={handleClose}>
          <Icon>clear</Icon>
        </IconButton>
      </div>
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item md={6} xs={6}>
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={answer.user.imgUrl} />
              <div className="ml-3 mt-3">
                <h3 className="my-0 text-15">
                  {answer.user.first_name}
                  {' '}
                  {answer.user.last_name}
                </h3>
              </div>
            </div>
          </Grid>
          <Grid item md={6} xs={6}>
            {answer.score === null ? (
              <Card className="bg-gray items-center flex justify-between p-4">
                <div>
                  <h5 className="font-normal text-white uppercase pt-2 mr-3">
                    Waiting fot answer
                  </h5>
                </div>
              </Card>
            ) : answer.score > 7 ? (
              <Card className="bg-green items-center flex justify-between p-4">
                <div>
                  <span className="text-white uppercase">TOTAL SCORE:</span>
                </div>
                <div>
                  <h2 className="font-normal text-white uppercase pt-2 mr-3">
                    {answer.score}
                  </h2>
                </div>
              </Card>
            ) : answer.score < 7 ? (
              <Card className="bg-error items-center flex justify-between p-4">
                <div>
                  <span className="text-white uppercase">TOTAL SCORE:</span>
                </div>
                <div>
                  <h2 className="font-normal text-white uppercase pt-2 mr-3">
                    {answer.score}
                  </h2>
                </div>
              </Card>
            ) : (
              <Card className="bg-secondary items-center flex justify-between p-4">
                <div>
                  <span className="text-white uppercase">TOTAL SCORE:</span>
                </div>
                <div>
                  <h2 className="font-normal text-white uppercase pt-2 mr-3">
                    {answer.score}
                  </h2>
                </div>
              </Card>
            )}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <div>
          <div className="comments">
            <div className="mb-4">
              <div className="mb-2">
                <h2 className="m-0">{answer.title}</h2>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        <div>
          <div className="comments">
            <div className="mb-4">
              {answer.comment ? (
                <p className="m-0 text-muted">
                  {answer.comment.substring(0, 10000)}
                </p>
              ) : (
                <p className="m-0 text-muted">Waiting for comments</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className="mb-3 bg-primary text-white"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </div>
  </Dialog>
);

AnswerStatus.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  answer: PropTypes.object,
};

export default AnswerStatus;
