export const SET_USER_NAVIGATION = "SET_USER_NAVIGATION";
export const SET_NAVIGATION = 'SET_NAVIGATION';
export const GET_NAVIGATION = 'GET_NAVIGATION';
export const RESET_NAVIGATION = 'RESET_NAVIGATION';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

const getfilteredNavigations = (navList = [], role) => {
  return navList.reduce((array, nav) => {
    if (nav.auth) {
      if (nav.auth.includes(role)) {
        array.push(nav);
      }
    } else {
      if (nav.children) {
        nav.children = getfilteredNavigations(nav.children, role);
        array.push(nav);
      } else {
        array.push(nav);
      }
    }
    return array;
  }, []);
};

export function getNavigationByUser() {
  return (dispatch, getState) => {
    let { user, navigations = [] } = getState();

    let filteredNavigations = getfilteredNavigations(navigations, user.role);

    dispatch({
      type: SET_USER_NAVIGATION,
      payload: [...filteredNavigations]
    });
  };
}

export function getNavigation(user) {
  return {
    type: GET_NAVIGATION,
  };
}

export function logoutUser() {
  return (dispatch) => {
    jwtAuthService.logout();

    history.push({
      pathname: '/session/signin',
    });

    dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}
