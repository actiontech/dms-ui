import { configureStore } from '@reduxjs/toolkit';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import auditPlan from './auditPlan';
import reportStatistics from './reportStatistics';
import globalRuleTemplate from './globalRuleTemplate';
import sqleManagement from './sqleManagement';
import database from '../../../base/src/store/database';

export const SQLEStoreData = {
  whitelist,
  ruleTemplate,
  auditPlan,
  reportStatistics,
  globalRuleTemplate,
  sqleManagement
};

const store = configureStore({
  reducer: { ...SQLEStoreData, database }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
