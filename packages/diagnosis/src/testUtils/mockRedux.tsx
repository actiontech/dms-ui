import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import monitorSourceConfig from '../store/monitorSourceConfig';
import user from '../store/user';
import userManagement from '../store/userManagement';

const reducers = combineReducers({
  user,
  monitorSourceConfig,
  userManagement
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({ reducer: reducers, preloadedState: initStore });
};
