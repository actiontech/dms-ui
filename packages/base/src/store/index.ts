import { configureStore } from '@reduxjs/toolkit';
import home from './home';
import user from './user';
import userCenter from './userCenter';
import member from './member';
import project from './project';
import system from './system';

//sqle redux
import auditPlan from 'sqle/src/store/auditPlan';
import globalRuleTemplate from 'sqle/src/store/globalRuleTemplate';
import locale from 'sqle/src/store/locale';
import nav from 'sqle/src/store/nav';
import reportStatistics from 'sqle/src/store/reportStatistics';
import ruleTemplate from 'sqle/src/store/ruleTemplate';
import whitelist from 'sqle/src/store/whitelist';
// import system from 'sqle/src/store/system';
import projectManage from 'sqle/src/store/projectManage';

const store = configureStore({
  reducer: {
    home,
    user,
    userCenter,
    member,
    project,
    system,
    nav,
    auditPlan,
    globalRuleTemplate,
    locale,
    reportStatistics,
    ruleTemplate,
    whitelist,
    projectManage
  }
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
