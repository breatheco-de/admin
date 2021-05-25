import React from "react";
import { Card, Button, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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
  const type = {
    pdf:'https://image.freepik.com/free-vector/illustration-folder-icon_53876-5845.jpg',
    video:'https://www.flaticon.es/svg/vstatic/svg/1783/1783489.svg?token=exp=1618899658~hmac=ff9e3b44a2210648785224fdcc192732'
  }

  return (
    <Card
      elevation={3}
      className={clsx("pr-4 relative h-full", classes.productCard)}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item lg={4} md={4} sm={4} xs={12} style={{padding:0, width:"200px", height:"250px"}}>
            <img src={product.mime.includes('pdf') ? type.pdf : product.mime.includes('video') ? type.pdf : product.url} alt={product.name} style={{
              height: "100%",
              width:"100%",
              position: "relative",
              left: 0,
              top: 0,
              objectFit: "cover"
              }}/>
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={12} className="p-6">
          <h5 className="m-0 mb-3">{product.name}</h5>
          <div className="flex justify-between mb-4">
            <span className="text-muted"><strong>Categories: </strong> {product.categories.map(c => <strong className="border-radius-4 px-2 pt-2px bg-secondary mr-1 text-white">{c.name}</strong>)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-muted"> <strong>Type: </strong>{product.mime}</span>
          </div>
          <Button size="medium" variant="contained" color="primary" className='mt-2' onClick={onOpenDialog}>Edit</Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ListMediaCard;