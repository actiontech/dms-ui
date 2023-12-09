import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import monitorSourceConfig from '../store/monitorSourceConfig';
import user from '../store/user';

const reducers = combineReducers({
  user,
  monitorSourceConfig
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({ reducer: reducers, preloadedState: initStore });
};
