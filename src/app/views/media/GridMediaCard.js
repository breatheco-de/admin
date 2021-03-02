import React from "react";
import { Card } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
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

const GridMediaCard = ({ media }) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const { cartList } = useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();

  const amount = cartList?.find((p) => p.id === media.id)?.amount || 0;

  return (
    <Card
      elevation={3}
      className={clsx("text-center relative h-full", classes.mediaCard)}
    >
      <div className="flex justify-center items-center relative">
        <span className="product-price font-medium bg-primary text-white py-1 px-3 m-0">
          ${media.price}
        </span>
        <img className="w-full" src={media.imgUrl} alt={media.title} />
        <div className="image-box-overlay flex justify-center items-center"></div>
      </div>
      <div className="p-6">
        <h5 className="m-0">{media.title}</h5>
      </div>
    </Card>
  );
};

export default GridMediaCard;