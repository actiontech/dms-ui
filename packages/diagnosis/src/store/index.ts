import { configureStore } from '@reduxjs/toolkit';
import monitorSourceConfig from './monitorSourceConfig';

const store = configureStore({
  reducer: {
    monitorSourceConfig
  }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
