import React from "react";
import { Card } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  addProductToCart,
  updateCartAmount,
} from "app/redux/actions/EcommerceActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { AddToCartButton } from "matx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  productCard: {
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

const GridProductCard = ({ product }) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const { cartList } = useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();

  const amount = cartList?.find((p) => p.id === product.id)?.amount || 0;

  const handleUpdateCart = (productAmount) => {
    dispatch(updateCartAmount(user.userId, product.id, productAmount));
  };

  const handleAddProduct = () => {
    dispatch(addProductToCart(user.userId, product.id));
  };

  return (
    <Card
      elevation={3}
      className={clsx("text-center relative h-full", classes.productCard)}
    >
      <div className="flex justify-center items-center relative">
        <span className="product-price font-medium bg-primary text-white py-1 px-3 m-0">
          ${product.price}
        </span>
        <img className="w-full" src={product.imgUrl} alt={product.title} />
        <div className="image-box-overlay flex justify-center items-center"></div>
      </div>
      <div className="p-6">
        <h5 className="m-0">{product.title}</h5>
      </div>
      <AddToCartButton
        className="mb-4 mx-auto px-4"
        amount={amount}
        totalUnit={product.totalUnit}
        handleAddProduct={handleAddProduct}
        handleUpdateCart={handleUpdateCart}
      />
    </Card>
  );
};

export default GridProductCard;
