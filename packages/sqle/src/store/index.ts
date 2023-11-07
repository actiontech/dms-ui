import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import nav from './nav';
import auditPlan from './auditPlan';
import reportStatistics from './reportStatistics';
import globalRuleTemplate from './globalRuleTemplate';
import projectManage from './projectManage';
import sqleManagement from './sqleManagement';

const store = configureStore({
  reducer: {
    locale,
    whitelist,
    ruleTemplate,
    nav,
    auditPlan,
    reportStatistics,
    globalRuleTemplate,
    projectManage,
    sqleManagement
  }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
