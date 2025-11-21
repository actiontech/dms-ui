import { configureStore } from '@reduxjs/toolkit';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import auditPlan from './auditPlan';
import reportStatistics from './reportStatistics';
import globalRuleTemplate from './globalRuleTemplate';
import sqleManagement from './sqleManagement';
import sqlOptimization from './sqlOptimization';
import sqlAnalyze from './sqlAnalyze';

export const SQLEStoreData = {
  whitelist,
  ruleTemplate,
  auditPlan,
  reportStatistics,
  globalRuleTemplate,
  sqleManagement,
  sqlOptimization,
  sqlAnalyze
};

const store = configureStore({
  reducer: SQLEStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
