import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import LayoutReducer from './LayoutReducer';
import ScrumBoardReducer from './ScrumBoardReducer';
import NotificationReducer from './NotificationReducer';
import EcommerceReducer from './MediaReducer';
import NavigationReducer from './NavigationReducer';
import CohortReducer from './CohortReducer';
import DialogReducer from './DialogReducer';

const RootReducer = combineReducers({
  user: UserReducer,
  layout: LayoutReducer,
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  cohorts: CohortReducer,
  dialog: DialogReducer,
});

export default RootReducer;
