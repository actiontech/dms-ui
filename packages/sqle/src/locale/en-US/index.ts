import audit from './audit';
import dashboard from './dashboard';
import dataSource from './dataSource';
import menu from './menu';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import whitelist from './whitelist';
import reportStatistics from './reportStatistics';
import projectManage from './projectManage';
import ruleKnowledge from './ruleKnowledge';
import sqlManagement from './sqlManagement';
import sqlAudit from './sqlAudit';
import pluginAudit from './pluginAudit';
import home from './home';
import components from './components';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    menu,
    dataSource,
    ruleTemplate,
    rule,
    audit,
    dashboard,
    whitelist,
    reportStatistics,
    projectManage,
    ruleKnowledge,
    sqlManagement,
    sqlAudit,
    pluginAudit,
    home,
    components
  }
};
