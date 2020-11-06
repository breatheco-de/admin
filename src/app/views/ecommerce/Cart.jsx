import React from "react";
import {
  Grid,
  Divider,
  Card,
  TextField,
  IconButton,
  Icon,
  Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteProductFromCart,
  updateCartAmount,
} from "app/redux/actions/EcommerceActions";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cart: {
    minWidth: 900,
    overflowX: "scroll",
  },
}));

const Cart = () => {
  const { cartList = [] } = useSelector((state) => state.ecommerce);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const getTotalCost = () => {
    let totalCost = 0;
    cartList.forEach((product) => {
      totalCost += product.amount * product.price;
    });
    return totalCost;
  };

  const handleChange = (event, productId) => {
    let amount = event.target.value;
    dispatch(updateCartAmount(user.userId, productId, Math.abs(amount)));
  };

  const handleDeleteFromCart = (productId) => {
    dispatch(deleteProductFromCart(user.userId, productId));
  };

  return (
    <Card elevation={3} className={clsx("m-sm-30", classes.cart)}>
      <div className="py-4 px-4">
        <Grid container>
          <Grid item lg={3} md={3} sm={3} xs={3}></Grid>
          <Grid item lg={4} md={4} sm={4} xs={4}>
            <h6 className="m-0">Name</h6>
          </Grid>
          <Grid
            item
            lg={true}
            md={true}
            sm={true}
            xs={true}
            className="text-center"
          >
            <h6 className="m-0">Price</h6>
          </Grid>
          <Grid
            item
            lg={true}
            md={true}
            sm={true}
            xs={true}
            className="text-center"
          >
            <h6 className="m-0">Quantity</h6>
          </Grid>
          <Grid
            item
            lg={true}
            md={true}
            sm={true}
            xs={true}
            className="text-center"
          >
            <h6 className="m-0">Total</h6>
          </Grid>
        </Grid>
      </div>
      <Divider></Divider>

      {cartList.map((product) => (
        <div key={product.id} className="py-4 px-4">
          <Grid container alignItems="center">
            <Grid item lg={3} md={3} sm={3} xs={3}>
              <div className="flex items-center">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteFromCart(product.id)}
                >
                  <Icon fontSize="small">clear</Icon>
                </IconButton>
                <div className="px-4">
                  <img
                    className="border-radius-4 w-full"
                    src={product.imgUrl}
                    alt={product.title}
                  />
                </div>
              </div>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={4}>
              <h6 className="m-0">{product.title}</h6>
              <p className="mt-2 m-0 text-muted">{product.description}</p>
            </Grid>
            <Grid
              item
              lg={true}
              md={true}
              sm={true}
              xs={true}
              className="text-center"
            >
              <h6 className="m-0">${product.price}</h6>
            </Grid>
            <Grid
              item
              lg={true}
              md={true}
              sm={true}
              xs={true}
              className="text-center"
            >
              <TextField
                variant="outlined"
                name="amount"
                type="number"
                size="small"
                value={product.amount}
                onChange={(e) => handleChange(e, product.id)}
                inputProps={{
                  style: {
                    // padding: "10px",
                    width: "60px",
                  },
                }}
              ></TextField>
            </Grid>
            <Grid
              item
              lg={true}
              md={true}
              sm={true}
              xs={true}
              className="text-center"
            >
              <h6 className="m-0">${product.price * product.amount}</h6>
            </Grid>
          </Grid>
        </div>
      ))}

      <div>
        <Divider className="mb-12"></Divider>
        <Grid container className="mb-12 px-4">
          <Grid item lg={3} md={3} sm={3} xs={3}></Grid>
          <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
          <Grid item lg={true} md={true} sm={true} xs={true}></Grid>
          <Grid
            item
            lg={true}
            md={true}
            sm={true}
            xs={true}
            className="text-center"
          >
            <h6 className="m-0">Total</h6>
          </Grid>
          <Grid
            item
            lg={true}
            md={true}
            sm={true}
            xs={true}
            className="text-center"
          >
            <h6 className="m-0">${getTotalCost().toFixed(2)}</h6>
          </Grid>
        </Grid>
        <div className="flex items-center mb-4 px-4">
          <TextField
            variant="outlined"
            placeholder="Discount Coupon"
            className="flex-grow"
            size="small"
          ></TextField>
          <Button className="mx-3" variant="contained" color="secondary">
            Apply
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/ecommerce/checkout")}
          >
            Checkout
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Cart;
