import { configureStore } from '@reduxjs/toolkit';
import monitorSourceConfig from './monitorSourceConfig';
import user from './user';
import userManagement from './userManagement';

export const diagnosisStoreData = {
  monitorSourceConfig,
  user,
  userManagement
};

const store = configureStore({
  reducer: diagnosisStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
