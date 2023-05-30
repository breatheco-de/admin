import bc from '../../services/breathecode';

export const GET_PRODUCT_LIST = 'GET_PRODUCT_LIST';
export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST';
export const UPLOAD_MEDIA_FILE = 'UPLOAD_MEDIA_FILE';
export const BULK_UPLOAD_MEDIA_FILE = 'BULK_UPLOAD_MEDIA_FILE';
export const UPDATE_MEDIA_FILE = 'UPDATE_MEDIA_FILE';
export const DELETE_MEDIA_FILE = 'DELETE_MEDIA_FILE';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const MEDIA_SELECTED = 'MEDIA_SELECTED';
export const CLEAN_MEDIA_SELECTED = 'CLEAN_MEDIA_SELECTED';

export const getProductList = (pagination) => (dispatch) => {
  delete pagination.count;
  bc.media().getMedia(pagination).then((res) => dispatch({
    type: GET_PRODUCT_LIST,
    payload: {
      results: res.data.results,
      pagination: {
        count: res.data.count,
        ...pagination,
      },
      next: res.data.next,
      previous: res.data.previous,
    },
  }));
};

export const getCategoryList = () => (dispatch) => {
  bc.media().getAllCategories().then((res) => dispatch({
    type: GET_CATEGORY_LIST,
    payload: res.data,
  }));
};

export const uploadFiles = (files) => (dispatch) => {

  const form = new FormData();
  for (const file of files) form.append('file', file, file.name.split(' ').join('-'));
  bc.media().upload(form).then((res) => {
    dispatch({
      type: UPLOAD_MEDIA_FILE,
      payload: res,
    });
  });
};
export const bulkUploadFiles = (files) => (dispatch) => {

  const form = new FormData();
  for (const file of files) form.append('file', file, file.name.split(' ').join('-'));
  bc.marketing().bulk_upload(form).then((res) => {
    dispatch({
      type: BULK_UPLOAD_MEDIA_FILE,
      payload: res,
    });
  });
};

export const updateFileInfo = (id, values) => (dispatch) => {
  bc.media().updateMedia(id, values).then((res) => dispatch({
    type: UPDATE_MEDIA_FILE,
    payload: res,
  }));
};

export const deleteFile = (id) => (dispatch) => {
  bc.media().deleteMedia(id).then((res) => dispatch({
    type: DELETE_MEDIA_FILE,
    payload: res,
  }));
};

export const createCategory = (values) => (dispatch) => {
  bc.media().createCategory(values).then((res) => dispatch({
    type: CREATE_CATEGORY,
    payload: res,
  }));
};

export const selectMedia = (value) => (dispatch) => {
  dispatch({
    type: MEDIA_SELECTED,
    payload: value,
  });
};

export const bulkEditMedia = (value) => (distpach) => {
  bc.media().updateMediaBulk(value).then((res) => {
    distpach({
      type: CLEAN_MEDIA_SELECTED,
      payload: res,
    });
  });
};

export const clearSelectedMedia = () => (distpach) => {
  distpach({
    type: CLEAN_MEDIA_SELECTED,
  });
};
