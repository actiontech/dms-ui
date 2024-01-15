import whitelist from '../store/whitelist';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import sqleManagement from '../store/sqleManagement';

const reducers = combineReducers({
  whitelist,
  sqleManagement
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({
    reducer: reducers,
    preloadedState: initStore
  });
};

export const CustomProvider: React.FC<{
  initStore: Dictionary;
  children: JSX.Element;
}> = (props) => {
  return (
    <Provider store={storeFactory(props.initStore)}>{props.children}</Provider>
  );
};
