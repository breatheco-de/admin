import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import LayoutReducer from "./LayoutReducer";
import NotificationReducer from "./NotificationReducer";
import EcommerceReducer from "./MediaReducer";
import CohortReducer from "./CohortReducer";
import NavigationReducer from "./NavigationReducer";
import DialogReducer from './DialogReducer';

const RootReducer = combineReducers({
  user: UserReducer,
  layout: LayoutReducer,
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  cohorts: CohortReducer,
  dialog: DialogReducer
});

export default RootReducer;
