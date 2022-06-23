import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Avatar,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import bc from 'app/services/breathecode';
import ScrumBoardContainer from "./components/ScrumBoardContainer";
import { getSession } from '../../redux/actions/SessionActions';
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
  const ago30Days = dayjs().subtract(30, 'day').tz(session.academy.timezone);

  const classes = useStyles();

  useEffect(async () => {
    const members = await bc.auth().getAcademyMembers({ role: 'content_writter' });
    setMemberList(members.data.map(m => newMember(m)));

    const _assets = await bc.registry().getAllAssets({ published_before: ago30Days.format('YYYY-MM-DD') });
    setAssets(_assets)
    setBoard(newBoard({
      title: 'Asset Kanban',
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

  return (
    <div className="scrum-board m-sm-30">

      <div className="relative">
        <ScrumBoardContainer
          list={board.list}
          // handleAddList={handleAddList}
          // handleAddNewCard={handleAddNewCard}
          handleMoveCard={handleMoveCard}
        ></ScrumBoardContainer>
      </div>
    </div>
  );
};

export default Board;