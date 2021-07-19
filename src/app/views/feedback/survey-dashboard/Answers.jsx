import React,{useState} from 'react';
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
  score:{
    color:'green',
    padding:'2px'
  }
}));

const Answers = ({answers = [], answered = []}) => {
  const classes = useStyles();
  const [filter, setFilter] = useState('answered');
  return (
    <Card elevation={3} className="pt-5 mb-6">
      <div className="flex justify-between items-center px-6 mb-3">
        <span className="card-title">{answered.length} Answers have been collected:</span>
        <Select size="small" defaultValue="answered" disableUnderline onChange={ e => setFilter(e.target.value)}>
          <MenuItem value="answered">Responses only</MenuItem>
          <MenuItem value="all">Include unanswered</MenuItem>
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
          {filter == 'answered' ? <TableBody>
            {answered.map((a, index) => (
              <TableRow key={index} hover>
                <TableCell className="px-0 capitalize" colSpan={4} align="left">
                  <div className="flex items-center">
                    <Avatar src={a.imgUrl} />
                    <p className="m-0 ml-8">{`${a.user.first_name} ${a.user.last_name}`}</p>
                  </div>
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  <small className={classes.score}>{a.score}</small>
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  <IconButton>
                    <Icon color="primary">arrow_right_alt</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> : <TableBody>
            {answers.map((a, index) => (
              <TableRow key={index} hover>
                <TableCell className="px-0 capitalize" colSpan={4} align="left">
                  <div className="flex items-center">
                    <Avatar src={a.imgUrl} />
                    <p className="m-0 ml-8">{`${a.user.first_name} ${a.user.last_name}`}</p>
                  </div>
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  {a.score !== null ? <small className={classes.score}>{a.score}</small> : a.score}
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  <IconButton>
                    <Icon color="primary">arrow_right_alt</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>}
        </Table>
      </div>
    </Card>
  );
};


Answers.propTypes = {
  answered: PropTypes.array,
  answers: PropTypes.array,
};

export default Answers;
