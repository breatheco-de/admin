import React from "react";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  mediaCard: {
    "& .product-price": {
      position: "absolute",
      right: 0,
      top: 24,
      borderTopLeftRadius: 26,
      borderBottomLeftRadius: 26,
      zIndex: 4,
    },
    "& .image-box-overlay": {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(0, 0, 0, 0.74)",
      zIndex: 2,
      opacity: 0,
      transition: "all 250ms ease-in-out",
    },
    "&:hover": {
      "& .image-box-overlay": {
        opacity: 1,
      },
    },
  },
}));

const GridMediaCard = ({ media, onOpenDialog }) => {
  const classes = useStyles();
  const type = {
    pdf:'https://image.freepik.com/free-vector/illustration-folder-icon_53876-5845.jpg',
    video:'https://www.flaticon.es/svg/vstatic/svg/1783/1783489.svg?token=exp=1618899658~hmac=ff9e3b44a2210648785224fdcc192732'
  }

  return (
    <Card
      elevation={3}
      className={clsx("text-center relative h-full myHeight", classes.mediaCard)}
      style={{maxHeight:"300px"}}
    >
      <div className="flex justify-center items-center relative" >
        <span className="product-price font-medium bg-primary text-white py-1 px-3 m-0 cursor-pointer" onClick={onOpenDialog}>
          <Icon>mode_edit</Icon>
        </span>
        <img className="w-full" src={media.mime.includes('pdf') ? type.pdf : media.mime.includes('video') ? type.pdf : media.thumbnail} alt={media.slug} />
      </div>
      <div className="p-6" style={{position:"absolute", bottom:0, background:"white", width:"100%"}}><h5 className="m-0">{media.name}</h5></div>
    </Card>
  );
};

export default GridMediaCard;
