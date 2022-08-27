import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  Grid,
} from "@material-ui/core";
import history from "history.js";
import bc from 'app/services/breathecode';
import ScrumBoardContainer from "./components/ScrumBoardContainer";
import { getSession } from '../../redux/actions/SessionActions';
import DowndownMenu from '../../components/DropdownMenu';
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MatxMenu } from "matx";

import {
  getBoardById,
  addListInBoard,
  getAllMembers,
  getAllLabels,
  addMemberInBoard,
  addNewCardInList,
  deleteMemberFromBoard,
} from "../../redux/actions/ScrumBoardActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { newMember, newBoard, newColumn, newCard } from "./components/initBoard"
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "2px solid white",
  },
}));

dayjs.extend(tz);
dayjs.extend(utc);

const Board = () => {

  const [session] = useState(getSession());
  if (session?.academy?.timezone) dayjs.tz.setDefault(session.academy.timezone);

  const [board, setBoard] = useState({ list: [] });
  const [assets, setAssets] = useState([]);
  const [memberList, setMemberList] = useState();
  const ago30Days = dayjs().subtract(30, 'day').tz(session.academy.timezone || 'America/New_York');

  const classes = useStyles();

  useEffect(async () => {
    const members = await bc.auth().getAcademyMembers({ role: 'content_writter' });
    setMemberList(members.data.map(m => newMember(m)));

    const _assets = await bc.registry().getAllAssets({ published_before: ago30Days.format('YYYY-MM-DD') });
    setAssets(_assets)
    setBoard(newBoard({
      title: 'Article Issues',
      members: members.data.map(m => newMember(m)),
      columns: ['UNASSIGNED', 'WRITING', 'DRAFT', 'PUBLISHED'].map(c => newColumn(c, c, _assets.data.filter(a => a.status === c).map(a => newCard(a))))
    }))
  }, []);

  const handleMoveCard = async (fromStatus, toStatus, assetSlug) => {
    const resp = await bc.registry().updateAsset({ slug: assetSlug, status: toStatus });
    console.log("board.list before", board.list)
    if (resp.status == 200)
      setBoard({
        ...board, list: board.list.map(c => {
          if (c.id === fromStatus) return { ...c, cardList: c.cardList.filter(card => card.id !== assetSlug) }
          else if (c.id === toStatus) return { ...c, cardList: [newCard(resp.data), ...c.cardList] }
          else return c
        })
      })
  }

  const updateAsset = (updatedCard) => {
    setBoard({
      ...board, list: board.list.map(col => {
        if (col.id === updatedCard.status) return {
          ...col,
          cardList: col.cardList.map(_card => {
            return (_card.id == updatedCard.id) ? newCard(newCard) : _card
          })
        }
        else return col
      })
    })
  }
  const handleCardAction = async (action, card) => {
    if (action === 'assign') {
      // TODO: if the session role is a content_write if will assign itself 
      // otherwise it will show modal to search and pick a writter.
    }
    else {
      const resp = await bc.registry().assetAction(card.slug, action);
      if (resp.status == 200) updateAsset(resp.data);
    }
  }

  const handleCardUpdate = async (_c) => {
    const resp = await bc.registry().updateAsset({ url: _c.url, slug: _c.slug })
    if (resp.status == 200) updateAsset(resp.data);
  }

  return (
    <div className="scrum-board m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <Grid item xs={12} sm={8}>
          <h3 className="my-0 font-medium text-28">Article Issues Pipeline</h3>
        </Grid>

        <Grid item xs={6} sm={4} align="right">
          <DowndownMenu
            options={[
              { label: 'Swich to: New Articles', value: 'new_articles'},
              { label: 'Swich to: Issues on previous articles', value: 'article_issues'}
            ]}
            icon="more_horiz"
            onSelect={({ value }) => history.push(`./${value}`)}
          >
            <Button variant="contained" color="primary">
              Switch to another Pipeline
            </Button>
          </DowndownMenu>
        </Grid>
      </div>
      <div className="relative">

      </div>
    </div>
  );
};

export default Board;