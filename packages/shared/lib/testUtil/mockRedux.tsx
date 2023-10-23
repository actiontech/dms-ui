import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '../types/common.type';
import user from '../../../base/src/store/user';
import userCenter from '../../../base/src/store/userCenter';
import member from '../../../base/src/store/member';
import project from '../../../base/src/store/project';

const reducers = combineReducers({
  user,
  userCenter,
  member,
  project
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({ reducer: reducers, preloadedState: initStore });
};
