import { configureStore } from '@reduxjs/toolkit';
import { baseStoreData } from './base';
import { SQLEStoreData } from 'sqle/src/store';

// IFTRUE_isDebug
const getKeysLen = (obj: Record<string, any>) => Object.keys(obj).length;
if (
  getKeysLen({ ...baseStoreData, ...SQLEStoreData }) !==
  getKeysLen(baseStoreData) + getKeysLen(SQLEStoreData)
) {
  throw new Error('Redux store error: The same key exists');
}
// FITRUE_isDebug

const store = configureStore({
  reducer: {
    ...baseStoreData,
    ...SQLEStoreData
  }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
