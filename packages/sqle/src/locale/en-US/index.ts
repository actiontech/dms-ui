import audit from './audit';
import dashboard from './dashboard';
import dataSource from './dataSource';
import login from './login';
import menu from './menu';
import order from './order';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import whitelist from './whitelist';
import system from './system';
import reportStatistics from './reportStatistics';
import projectManage from './projectManage';
import sqlManagement from './sqlManagement';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    login,
    menu,
    dataSource,
    ruleTemplate,
    rule,
    audit,
    order,
    dashboard,
    whitelist,
    system,
    reportStatistics,
    projectManage,
    sqlManagement
  }
};
