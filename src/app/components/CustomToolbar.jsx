/* eslint-disable react/prop-types */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import BulkDelete from './ToolBar/BulkDelete';
// import AddBulkToCohort from './AddBulkToCohort';

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
};

const CustomToolbarSelect = (props) => {
  const {
    classes,
    selectedRows,
    displayData,
    setSelectedRows,
    items,
    key,
    history,
    deleting,
    onBulkDelete,
  } = props;

  return (
    <div className={classes.iconContainer}>
      <BulkDelete
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        items={items}
        key={key}
        history={history}
        deleting={deleting}
        onBulkDelete={onBulkDelete}
      />
    </div>
  );
};

export default withStyles(defaultToolbarSelectStyles, {
  name: 'CustomToolbarSelect',
})(CustomToolbarSelect);
