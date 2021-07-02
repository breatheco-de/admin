import React, { useState, useMemo, useEffect } from 'react';
import { Hidden } from '@material-ui/core';
import { debounce } from 'lodash';
import ListTopbar from './ListTopbar';
import { getAllList } from './ListService';
import ListView from './ListView';
import GridView from './GridView';

const AppList = () => {
  const [originalList, setOriginalList] = useState([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [list, setList] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const search = useMemo(
    () => debounce((query) => {
      const tempList = originalList.filter(
        (item) => item.projectName.toLowerCase().match(query.toLowerCase()),
      );
      setList([...tempList]);
    }, 200),
    [originalList],
  );

  const handleInputChange = (event) => {
    const { value } = event.target;
    search(value);
  };

  const handleSldierChange = (event, value) => {
    setSliderValue(value);
  };

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  useEffect(() => {
    getAllList().then((response) => {
      setOriginalList(response.data);
      setList(response.data);
    });
  }, []);

  return (
    <div className="list m-sm-30">
      <div className="mb-4">
        <ListTopbar
          viewMode={viewMode}
          handleViewChange={handleViewChange}
          handleInputChange={handleInputChange}
          handleSldierChange={handleSldierChange}
          sliderValue={sliderValue}
        />
      </div>
      <Hidden xsDown>
        {viewMode === 'list' ? (
          <ListView list={list} />
        ) : (
          <GridView list={list} sliderValue={sliderValue} />
        )}
      </Hidden>

      <Hidden smUp>
        <GridView list={list} sliderValue={sliderValue} />
      </Hidden>
    </div>
  );
};

export default AppList;
