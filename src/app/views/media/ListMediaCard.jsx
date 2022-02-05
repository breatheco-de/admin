import React, { useState, useEffect } from 'react';
import {
  Card, Button, Grid, Icon,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  productCard: {
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
      right: '66%',
      background: 'rgba(25, 118, 210, 0.54)',
      zIndex: 2,
      opacity: 0,
      transition: 'all 250ms ease-in-out',
    },
    '&:hover': {
      '& .image-box-overlay': {
        opacity: 1,
      },
    },
    '& .selected': {
      background: 'rgba(25, 118, 210, 0.54)',
      transition: 'all 250ms ease-in-out',
      zIndex: 2,
      opacity: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
}));

const ListMediaCard = ({
  product, onOpenDialog, onSelected, isSelected,
}) => {
  const classes = useStyles();
  const type = {
    pdf: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png',
    video: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png',
  };
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (isSelected.length === 0) setSelected(false);
  }, [isSelected]);

  const checkMedia = (mediaType) => {
    if (mediaType.mime.includes('pdf')) return type.pdf;
    if (mediaType.mime.includes('video')) return type.pdf;
    return mediaType.thumbnail;
  };
  return (
    <Card
      elevation={3}
      className={clsx('pr-4 relative h-full', classes.productCard)}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(!selected);
        onSelected(product);
      }}
    >
      {selected ? (
        <span className="product-price font-medium bg-white text-green py-1 px-3 m-0">
          <Icon>done</Icon>
        </span>
      ) : null}
      <Grid container spacing={2} alignItems="center">
        <Grid
          item
          lg={4}
          md={4}
          sm={4}
          xs={12}
          style={{ padding: 0, width: '200px', height: '250px' }}
        >
          <img
            src={
              checkMedia(product)
              // product.mime.includes('pdf')
              //   ? type.pdf
              //   : product.mime.includes('video')
              //     ? type.pdf
              //     : product.thumbnail
            }
            alt={product.name}
            style={{
              height: '100%',
              width: '100%',
              position: 'relative',
              left: 0,
              top: 0,
              objectFit: 'cover',
            }}
          />
          <div
            className={clsx(
              `image-box-overlay flex justify-center items-center ${selected ? 'selected' : ''}`,
            )}
          />
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={12} className="p-6">
          <h6 className="m-0 mb-3">{product.name}</h6>
          <div className="flex justify-between mb-4">
            <span className="text-muted">
              <strong>Categories: </strong>
              {' '}
              {product.categories.map((c) => (
                <strong className="border-radius-4 px-2 pt-2px bg-secondary mr-1 text-white">
                  {c.name}
                </strong>
              ))}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-muted">
              {' '}
              <strong>Type: </strong>
              {product.mime}
            </span>
          </div>
          <Button
            size="medium"
            variant="contained"
            color="primary"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDialog();
            }}
          >
            Edit
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ListMediaCard;
