import whitelist from '../store/whitelist';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import sqlManagement from '../store/sqlManagement';
import sqlManagementException from '../store/sqlManagementException';
import pipeline from '../store/pipeline';

const reducers = combineReducers({
  whitelist,
  sqlManagement,
  sqlManagementException,
  pipeline
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
