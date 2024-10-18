import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '../types/common.type';
import user from '../../../base/src/store/user';
import userCenter from '../../../base/src/store/userCenter';
import member from '../../../base/src/store/member';
import project from '../../../base/src/store/project';
import database from '../../../base/src/store/database';
import system from '../../../base/src/store/system';
import nav from '../../../base/src/store/nav';
import permission from '../../../base/src/store/permission';

const reducers = combineReducers({
  user,
  userCenter,
  member,
  project,
  database,
  system,
  nav,
  permission
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({ reducer: reducers, preloadedState: initStore });
};
