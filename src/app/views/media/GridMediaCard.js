import React,{useState, useEffect} from "react";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  mediaCard: {
    '& .product-price': {
      position: 'absolute',
      right: 0,
      top: 24,
      borderTopLeftRadius: 26,
      borderBottomLeftRadius: 26,
      zIndex: 4,
    },
    '& .image-box-overlay': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(25, 118, 210, 0.54)",
      zIndex: 2,
      opacity: 0,
      transition: 'all 250ms ease-in-out',
    },
    '&:hover': {
      '& .image-box-overlay': {
        opacity: 1,
      },
    },
    "& .selected":{
      background: "rgba(25, 118, 210, 0.54)",
      transition: "all 250ms ease-in-out",
      zIndex: 2,
      opacity: 1,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    } 
  },
  img: {
    objectFit: "cover",
    height: "200px"
  },
}));

const GridMediaCard = ({ media, onOpenDialog, onSelected, isSelected }) => {
  const classes = useStyles();
  const type = {
    pdf:'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png',
    video:'https://www.flaticon.es/svg/vstatic/svg/1783/1783489.svg?token=exp=1618899658~hmac=ff9e3b44a2210648785224fdcc192732'
  }
  const [selected, setSelected ] = useState(false);
  useEffect(()=>{
    if(isSelected.length === 0) setSelected(false);
  }, [isSelected])
  return (
    <Card
      elevation={3}
      className={clsx(`text-center relative h-full ${selected ? "selected":""}`, classes.mediaCard)}
      style={{maxHeight:"300px"}}
      onClick={()=> {
        console.log(media)
        setSelected(selected ? false: true);
        onSelected(media);
      }}
    >
      <div className="flex justify-center items-center relative" >
        {!selected ? <span className="product-price font-medium bg-primary text-white py-1 px-3 m-0 cursor-pointer" onClick={onOpenDialog}>
          <Icon>mode_edit</Icon>
        </span> : <span className="product-price font-medium bg-white text-green py-1 px-3 m-0">
          <Icon>done</Icon>
        </span>}
        <img className={clsx("w-full", classes.img)} src={media.mime.includes('pdf') ? type.pdf : media.mime.includes('video') ? type.pdf : media.thumbnail} alt={media.slug} />
        <div className={clsx(`image-box-overlay flex justify-center items-center ${selected ? "selected":""}`)}></div>
      </div>
      <div className="p-2" style={{position:"absolute", bottom:0, background:"white", width:"100%"}}><h6 className="m-0">{media.name}</h6></div>
    </Card>
  );
};

export default GridMediaCard;
