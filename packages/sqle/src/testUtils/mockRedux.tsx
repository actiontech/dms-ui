import { Dictionary } from '../types/common.type';
import locale from '../store/locale';
import whitelist from '../store/whitelist';
import nav from '../store/nav';
import projectManage from '../store/projectManage';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({
  locale,
  whitelist,
  nav,
  // system,
  projectManage
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
