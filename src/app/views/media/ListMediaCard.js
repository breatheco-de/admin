import React from "react";
import { Card, Button, Icon, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
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

const ListMediaCard = ({ product, onOpenDialog }) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const { cartList } = useSelector((state) => state.ecommerce);
  const dispatch = useDispatch();
  const type = {
    pdf:'https://www.flaticon.es/svg/vstatic/svg/617/617473.svg?token=exp=1618899561~hmac=fc7fa6dfba70053b4ec858faa24c7db3',
    video:'https://www.flaticon.es/svg/vstatic/svg/1783/1783489.svg?token=exp=1618899658~hmac=ff9e3b44a2210648785224fdcc192732'
  }
  const amount = cartList?.find((p) => p.id === product.id)?.amount || 0;

  return (
    <Card
      elevation={3}
      className={clsx("p-4 relative h-full", classes.productCard)}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <div className="flex justify-center items-center relative">
            <img className="w-full" src={product.mime.includes('pdf') ? type.pdf : product.url} alt={product.name} />
          </div>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12} className="p-6">
          <h5 className="m-0 mb-3">{product.name}</h5>
          <div className="flex justify-between mb-4">
            <span className="text-muted">Categories: {product.categories.map(c => c.name + ", ")}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-muted">Type: {product.mime}</span>
          </div>
          <p className="m-0 text-muted">
            Description: {product.description?.substring(0, 200)}
          </p>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Button size="medium" variant="contained" color="primary" className='mt-2' onClick={onOpenDialog}>Edit</Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ListMediaCard;