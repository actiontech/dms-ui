import { configureStore } from '@reduxjs/toolkit';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import auditPlan from './auditPlan';
import reportStatistics from './reportStatistics';
import globalRuleTemplate from './globalRuleTemplate';
import sqlManagement from './sqlManagement';
import pluginAudit from './pluginAudit';
import sqlExecWorkflow from './sqlExecWorkflow';
import sqlManagementException from './sqlManagementException';
import pipeline from './pipeline';
import versionManagement from './versionManagement';

export const SQLEStoreData = {
  whitelist,
  ruleTemplate,
  auditPlan,
  reportStatistics,
  globalRuleTemplate,
  sqlManagement,
  pluginAudit,
  sqlExecWorkflow,
  sqlManagementException,
  pipeline,
  versionManagement
};

const store = configureStore({
  reducer: SQLEStoreData
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
