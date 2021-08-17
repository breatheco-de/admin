import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Icon,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  MenuItem,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AnswerStatus from '../../../components/AnswerStatus';
import { npsScoreColors } from '../../../../utils';
import clsx from 'clsx';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  productTable: {
    '& small': {
      height: 15,
      width: 50,
      borderRadius: 500,
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    },
    '& td': {
      borderBottom: 'none',
    },
    '& td:first-child': {
      paddingLeft: '16px !important',
    },
  },
  score: {
    padding: '4px',
    fontSize:"14px"
  },
  about: {
    padding: '4px',
    marginLeft: '3px',
    marginTop: '3px',
  }
}));


const Answers = ({ filteredAnswers = [], answered = [], sortBy, filter, mentors = [] }) => {
  const classes = useStyles();
  const [answer, setAnswer] = useState({
    color: '',
    score: '',
    title: '',
    comment: '',
    highest: '',
    lowest: '',
    user: {
      imgUrl: '',
      first_name: '',
      last_name: '',
    },
    academy: {
      name: '',
      slug: '',
    },
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getAboutStr = (item) => {
    if(!item.cohort && !item.mentor) return 'About Academy';
    if(item.cohort && !item.mentor) return 'About Cohort';
    if(item.mentor) return `About ${item.mentor.first_name} ${item.mentor.last_name}`;
  }
  return (
    <Card elevation={3} className="pt-5 mb-6">
      <div className="flex justify-between items-center px-6 mb-3">
        <span className="card-title">{answered.length === 0 ? 'No answers have been collected yet' : `${answered.length} answers have been collected`}</span>
        <Select size="small" defaultValue="answered" disableUnderline onChange={sortBy}>
          <MenuItem value="answered">Responses only</MenuItem>
          <MenuItem value="all">Include unanswered</MenuItem>
          <MenuItem value="cohort">Only Cohort</MenuItem>
          <MenuItem value="academy">Only Academy</MenuItem>
          {mentors.map(m => {
            return <MenuItem value={m.name} key={m.name}>Only {m.name}</MenuItem>
          })}
        </Select>
      </div>
      <div className="overflow-auto">
        <Table className={clsx('whitespace-pre min-w-400', classes.productTable)}>
          <TableHead>
            <TableRow>
              <TableCell className="px-6" colSpan={4}>
                Student
              </TableCell>
              <TableCell className="px-0" colSpan={2}>
                Score
              </TableCell>
              <TableCell className="px-0" colSpan={1}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          {filter === 'answered' ? <TableBody>
            {answered.length !== 0 ? answered.map((a, index) => (
              <TableRow key={index} hover>
                <TableCell className="px-0 capitalize" colSpan={4} align="left">
                  <div className="flex items-center">
                    <Avatar src={a.imgUrl} />
                    <div >
                      <p className="m-0 ml-8">{`${a.user.first_name} ${a.user.last_name}`}</p>
                      <span className={clsx(classes.about, "m-0 ml-8 text-muted")}>{getAboutStr(a)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  <small className={clsx(classes.score, `m-0 ml-5 ${npsScoreColors[a.score]}`)}>{a.score}</small>
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  <IconButton onClick={() => {
                    setAnswer(a);
                    handleClickOpen();
                  }}>
                    <Icon color="primary">arrow_right_alt</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : <caption>
              There is no answers collected yet,   but you can filter by unanswered questions
            </caption>
            }
          </TableBody> : <TableBody>
            {filteredAnswers.map((a, index) => (
              <TableRow key={index} hover>
                <TableCell className="px-0 capitalize" colSpan={4} align="left">
                  <div className="flex items-center">
                    <Avatar src={a.imgUrl} />
                    <div >
                      <p className="m-0 ml-8">{`${a.user.first_name} ${a.user.last_name}`}</p>
                      <span className={clsx(classes.about, "m-0 ml-8 text-muted")}>{getAboutStr(a)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  <small className={clsx(classes.score, `m-0 ml-5 ${npsScoreColors[a.score]}`)}>{a.score !== null ? a.score : '?'}</small>
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  <IconButton onClick={() => {
                    setAnswer(a);
                    handleClickOpen();
                  }}>
                    <Icon color="primary">arrow_right_alt</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>}
        </Table>
      </div>
      <AnswerStatus answer={answer} handleClose={handleClose} open={open} />
    </Card>
  );
};

Answers.propTypes = {
  answered: PropTypes.array,
  answers: PropTypes.array,
  sortBy: PropTypes.func,
  filter: PropTypes.string,
  mentors: PropTypes.array
};

export default Answers;
