import { configureStore } from '@reduxjs/toolkit';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import auditPlan from './auditPlan';
import reportStatistics from './reportStatistics';
import globalRuleTemplate from './globalRuleTemplate';
import sqlManagement from './sqlManagement';
import pluginAudit from './pluginAudit';
import sqleManagement from './sqlManagement';
import sqlOptimization from './sqlOptimization';
import sqlAnalyze from './sqlAnalyze';

export const SQLEStoreData = {
  whitelist,
  ruleTemplate,
  auditPlan,
  reportStatistics,
  globalRuleTemplate,
  sqlManagement,
  pluginAudit,
  sqleManagement,
  sqlOptimization,
  sqlAnalyze
};

const store = configureStore({
  reducer: SQLEStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
