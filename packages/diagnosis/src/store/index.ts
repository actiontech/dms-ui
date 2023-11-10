import { configureStore } from '@reduxjs/toolkit';
import monitorSourceConfig from './monitorSourceConfig';

export const diagnosisStoreData = {
  monitorSourceConfig
};

const store = configureStore({
  reducer: diagnosisStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
