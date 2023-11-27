import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '../types/common.type';
import user from '../../../base/src/store/user';
import userCenter from '../../../base/src/store/userCenter';
import member from '../../../base/src/store/member';
import project from '../../../base/src/store/project';
import database from '../../../base/src/store/database';
import system from '../../../base/src/store/system';
import nav from '../../../base/src/store/nav';

const reducers = combineReducers({
  user,
  userCenter,
  member,
  project,
  database,
  system,
  nav
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({ reducer: reducers, preloadedState: initStore });
};
