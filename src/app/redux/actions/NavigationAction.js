export const SET_USER_NAVIGATION = 'SET_USER_NAVIGATION';

const getfilteredNavigations = (navList = [], role) => navList.reduce((array, nav) => {
  if (nav.auth) {
    if (nav.auth.includes(role)) {
      array.push(nav);
    }
  } else if (nav.children) {
    // eslint-disable-next-line no-param-reassign
    nav.children = getfilteredNavigations(nav.children, role);
    array.push(nav);
  } else {
    array.push(nav);
  }
  return array;
}, []);

export function getNavigationByUser() {
  return (dispatch, getState) => {
    const { user, navigations = [] } = getState();

    const filteredNavigations = getfilteredNavigations(navigations, user.role);

    dispatch({
      type: SET_USER_NAVIGATION,
      payload: [...filteredNavigations],
    });
  };
}
