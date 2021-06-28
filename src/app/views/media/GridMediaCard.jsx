/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Card, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';

// eslint-disable-next-line no-unused-vars
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
      background: 'rgba(0, 0, 0, 0.74)',
      zIndex: 2,
      opacity: 0,
      transition: 'all 250ms ease-in-out',
    },
    '&:hover': {
      '& .image-box-overlay': {
        opacity: 1,
      },
    },
  },
  img: {
    objectFit: 'cover',
    height: '200px',
  },
}));

const GridMediaCard = ({ media, onOpenDialog }) => {
  const classes = useStyles();
  const type = {
    pdf: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png',
    video:
      'https://www.flaticon.es/svg/vstatic/svg/1783/1783489.svg?token=exp=1618899658~hmac=ff9e3b44a2210648785224fdcc192732',
  };

  return (
    <Card
      elevation={3}
      className={clsx(
        'text-center relative h-full myHeight',
        classes.mediaCard,
      )}
      style={{ maxHeight: '300px' }}
    >
      <div className="flex justify-center items-center relative">
        <button
          type="button"
          className="product-price font-medium bg-primary text-white py-1 px-3 m-0 cursor-pointer"
          onClick={onOpenDialog}
        >
          <Icon>mode_edit</Icon>
        </button>
        <img
          className={clsx('w-full', classes.img)}
          src={
            media.mime.includes('pdf')
              ? type.pdf
              : media.mime.includes('video')
                ? type.pdf
                : media.thumbnail
          }
          alt={media.slug}
        />
      </div>
      <div
        className="p-2"
        style={{
          position: 'absolute',
          bottom: 0,
          background: 'white',
          width: '100%',
        }}
      >
        <h6 className="m-0">{media.name}</h6>
      </div>
    </Card>
  );
};

export default GridMediaCard;
