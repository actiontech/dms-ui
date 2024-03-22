import audit from './audit';
import dashboard from './dashboard';
import login from './login';
import menu from './menu';
import order from './order';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import system from './system';
import whitelist from './whitelist';
import workflowTemplate from './workflowTemplate';
import auditPlan from './auditPlan';
import sqlQuery from './sqlQuery';
import sqlAnalyze from './sqlAnalyze';
import reportStatistics from './reportStatistics';
import projectManage from './projectManage';
import operationRecord from './operationRecord';
import customRule from './customRule';
import ruleManager from './ruleManager';
import ruleKnowledge from './ruleKnowledge';
import sqlManagement from './sqlManagement';
import sqlAudit from './sqlAudit';
import pluginAudit from './pluginAudit';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    login,
    menu,
    ruleTemplate,
    rule,
    audit,
    order,
    dashboard,
    whitelist,
    system,
    workflowTemplate,
    auditPlan,
    sqlQuery,
    sqlAnalyze,
    reportStatistics,
    projectManage,
    operationRecord,
    customRule,
    ruleManager,
    ruleKnowledge,
    sqlManagement,
    sqlAudit,
    pluginAudit
  }
};
