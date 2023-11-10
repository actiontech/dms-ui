import { configureStore } from '@reduxjs/toolkit';
import { baseStoreData } from './base';
import { SQLEStoreData } from 'sqle/src/store';

const store = configureStore({
  reducer: {
    ...baseStoreData,
    ...SQLEStoreData
  }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
