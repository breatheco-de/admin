/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton } from '@material-ui/core';
import bc from '../../../services/breathecode';

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
};

const CustomToolbarSelectCertificates = (props) => {
  const { classes } = props;
  const [bulkCertificates, setBulkCertificates] = useState([]);

  useEffect(() => {
    const indexList = props.selectedRows.data.map((item) => item.index);
    let certificates = [];
    // eslint-disable-next-line array-callback-return
    indexList.map((item, index) => {
      if (index === 0) {
        const certificate = {
          user_id: props.items[item].user.id,
          cohort_slug: props.items[item].cohort.slug,
        };
        certificates = [certificate];
      }
      if (index > 0) {
        const certificate = {
          user_id: props.items[item].user.id,
          cohort_slug: props.items[item].cohort.slug,
        };
        certificates.push(certificate);
      }
    });
    setBulkCertificates(certificates);
  }, [props.selectedRows]);

  const reattempCertificates = () => {
    bc.certificates()
      .addBulkCertificates(bulkCertificates)
      .then((response) => {
        if (response.status === 200) {
          props.loadData();
          props.setSelectedRows([]);
          setBulkCertificates([]);
        }
        throw Error('We were unable to process your request');
      })
      .catch((error) => error);
  };

  return (
    <Tooltip title="Re-attemps certificates">
      <IconButton
        className={classes.iconButton}
        onClick={() => {
          reattempCertificates();
        }}
      >
        <PostAddIcon className={classes.icon} />
      </IconButton>
    </Tooltip>
  );
};

export default withStyles(defaultToolbarSelectStyles, {
  name: 'CustomToolbarSelectCertificates',
})(CustomToolbarSelectCertificates);
