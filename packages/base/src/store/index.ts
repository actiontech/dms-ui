import { configureStore } from '@reduxjs/toolkit';
import { baseStoreData } from './base';
import { SQLEStoreData } from 'sqle/src/store';
import { findDuplicateKeys } from '../utils/findDuplicateKeys';

// IFTRUE_isDebug
const dupKeys = findDuplicateKeys([baseStoreData, SQLEStoreData]);
if (dupKeys.length > 0) {
  throw new Error(
    `Redux store error: The same key exists: ${dupKeys.toString()}`
  );
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
