export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const openDialog = (value) => (dispatch) => {
  dispatch({
    type: OPEN,
    payload: value,
  });
};

export const closeDialog = () => (dispatch) => {
  dispatch({
    type: CLOSE,
  });
};
