import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from '@material-ui/core';
import dayjs from 'dayjs';
import useInfiniteScroll from 'app/hooks/useInfiniteScroll';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const InfiniteScrollTable = ({ items, setItems, columns, search }) => {
  const [pageNumber, setPageNumber] = useState(1);

  const styles = {
    textAlign: 'center',
    width: '100%',
  };

  const { loading, error, hasMore } = useInfiniteScroll(pageNumber, items, setItems, search);

  const observer = useRef()
  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => <TableCell className="px-0">{column.label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(items) && items.map((item, i) => {
            return items.length === i +1 ? (
              <TableRow ref={lastElementRef}>
                {columns.map((column, j) => column.customBodyRender(item, j))}
              </TableRow>
            ) : (
              <TableRow>
                {columns.map((column, j) => column.customBodyRender(item, j))}
              </TableRow>
            )
          })}
        </TableBody>
        
      </Table>
      {loading && (
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '15px' }}>
            <CircularProgress />
          </Box>
        )}
      {items.length === 0 && !loading && (
        <p style={styles}> No Elements yet </p>
      )}
      {error && (
        <p className="text-error" style={styles}> Something went wrong! </p>
      )}
    </div>
  );
};

export default InfiniteScrollTable;

InfiniteScrollTable.propTypes = {
  items: PropTypes.array,
};

InfiniteScrollTable.defaultProps = {
  items: [],
};