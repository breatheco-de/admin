import React from "react";
import { Card, Button, Icon, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  addProductToCart,
  updateCartAmount,
} from "app/redux/actions/EcommerceActions";
import Rating from "@material-ui/lab/Rating";
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

const ListProductCard = ({ product }) => {
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
      className={clsx("p-4 relative h-full", classes.productCard)}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <div className="flex justify-center items-center relative">
            <img className="w-full" src={product.imgUrl} alt={product.title} />
            <div className="image-box-overlay flex justify-center items-center">
              <Button
                variant="outlined"
                className="bg-default"
                onClick={() => handleAddProduct(user.userId, product.id)}
              >
                <Icon className="mr-2">shopping_cart</Icon>
                <span>Add to cart</span>
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12} className="p-6">
          <h5 className="m-0 mb-3">{product.title}</h5>
          <div className="flex justify-between mb-4">
            <span className="text-muted">${product.price.toFixed(2)}</span>
            <Rating
              size="small"
              readOnly={true}
              name="half-rating"
              value={product.rating}
              precision={0.5}
            />
          </div>
          <AddToCartButton
            className="mb-4"
            amount={amount}
            totalUnit={product.totalUnit}
            handleAddProduct={handleAddProduct}
            handleUpdateCart={handleUpdateCart}
          />
          <p className="m-0 text-muted">
            {product.description.substring(0, 200)}
          </p>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ListProductCard;
