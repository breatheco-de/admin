import React, { useState, useEffect } from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';

const propTypes = {
  classes: PropTypes.number.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.array).isRequired,
  items: PropTypes.string.isRequired,
  loadData: PropTypes.string.isRequired,
  setSelectedRows: PropTypes.string.isRequired,
};

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
  const {
    classes, selectedRows, items, loadData, setSelectedRows,
  } = props;
  const [bulkCertificates, setBulkCertificates] = useState([]);

  useEffect(() => {
    const indexList = selectedRows.data.map((item) => item.index);
    let certificates = [];
    indexList.map((item, index) => {
      if (index === 0) {
        const certificate = {
          user_id: items[item].user.id,
          cohort_slug: items[item].cohort.slug,
        };
        certificates = [certificate];
      }
      if (index > 0) {
        const certificate = {
          user_id: items[item].user.id,
          cohort_slug: items[item].cohort.slug,
        };
        certificates.push(certificate);
      }
      return certificates;
    });
    setBulkCertificates(certificates);
  }, [selectedRows]);

  const reattempCertificates = () => {
    bc.certificates()
      .addBulkCertificates(bulkCertificates)
      .then((response) => {
        if (response.status === 200) {
          loadData();
          setSelectedRows([]);
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

CustomToolbarSelectCertificates.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'CustomToolbarSelectCertificates',
})(CustomToolbarSelectCertificates);
