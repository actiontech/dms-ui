import audit from './audit';
import dashboard from './dashboard';
import dataSource from './dataSource';
import menu from './menu';
import order from './order';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import whitelist from './whitelist';
import reportStatistics from './reportStatistics';
import projectManage from './projectManage';
import ruleKnowledge from './ruleKnowledge';
import sqlManagement from './sqlManagement';
import sqlAudit from './sqlAudit';
import pluginAudit from './pluginAudit';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    menu,
    dataSource,
    ruleTemplate,
    rule,
    audit,
    order,
    dashboard,
    whitelist,
    reportStatistics,
    projectManage,
    ruleKnowledge,
    sqlManagement,
    sqlAudit,
    pluginAudit
  }
};
