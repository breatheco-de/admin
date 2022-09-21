import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import LayoutReducer from './LayoutReducer';
import NotificationReducer from './NotificationReducer';
import EcommerceReducer from './MediaReducer';
import NavigationReducer from './NavigationReducer';
import CohortReducer from './CohortReducer';
import DialogReducer from './DialogReducer';
import SurveyReducer from './SurveyReducer';
import HostReducer from './HostReducer';

const RootReducer = combineReducers({
  user: UserReducer,
  layout: LayoutReducer,
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  cohorts: CohortReducer,
  dialog: DialogReducer,
  survey: SurveyReducer,
  host: HostReducer
});

export default RootReducer;
