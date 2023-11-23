import { configureStore } from '@reduxjs/toolkit';
import monitorSourceConfig from './monitorSourceConfig';
import user from './user';

export const diagnosisStoreData = {
  monitorSourceConfig,
  user
};

const store = configureStore({
  reducer: diagnosisStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
