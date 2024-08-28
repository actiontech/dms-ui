// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Approval workflow template',
  pageDesc: 'You can manage default approval workflow templates here.',

  list: {
    title: {
      listTable: 'Approval workflow template list'
    },

    table: {
      workflowTemplateName: 'Approval workflow template name',
      desc: 'Approval workflow template description'
    },

    operator: {
      create: 'Create approval workflow template'
    }
  },

  create: {
    title: {
      returnButton: 'Return approval workflow template',
      wrapper: 'Create approval workflow template'
    },
    result: {
      title: 'Create approval workflow template successfully',
      createNew: 'Create a new approval workflow template',
      backToList:
        'Return to the list to view the newly created approval workflow template'
    }
  },

  update: {
    title: {
      wrapper: 'Update approval workflow template'
    },
    result: {
      title: 'Update approval workflow template successfully',
      showNow: 'View the newly updated approval workflow template'
    }
  },

  delete: {
    confirm: 'Confirm remove approval workflow template {{name}}?',
    deleting: 'Removing approval workflow template {{name}}...',
    successTips: 'Remove approval workflow template {{name}} successfully'
  },

  detail: {
    title: {
      wrapper: 'Approval workflow template details',
      base: 'Approval workflow template basic information',
      step: 'Approval workflow template steps',
      noticeInfo: 'Notice',
      updateTime: 'Approval workflow template update time'
    },
    updateTemplate: 'Modify current approval workflow template',
    authLevelInfo: {
      first:
        'If the project administrator modifies the approval workflow template, it will not affect the tickets that are already in the approval process;',
      second:
        'Rejected tickets need the creator to update the SQL statement and submit it again. The rejection record can be viewed in “ticket progress-ticket history operation”;',
      third:
        'Tickets in the “audit node” can be closed by the creator at any time on the ticket details page;',
      fourth:
        'Audit tickets: the auditor can execute “pass audit” or “reject” operations in this step;',
      fifth:
        'Online tickets: the executor can execute “execute online” or “reject” operations in this step.'
    }
  },

  step: {
    baseFormTitle: 'Basic information',
    baseFormDesc: 'Set the basic information of the template',

    progressTitle: 'Audit node',
    progressDesc:
      'Edit the audit process, drag and drop to reorder the audit nodes. The auditor can execute “pass audit” or “reject” operations in this step',

    execTitle: 'Execute online',
    execDesc:
      'Edit the audit process. The executor can execute “execute online” or “reject” operations in this step',

    resultTitle: 'Result',
    resultDesc: 'Change result'
  },

  form: {
    label: {
      name: 'Approval workflow template name',
      desc: 'Approval workflow template description',
      allowSubmitWhenLessAuditLevel:
        'Allow the highest audit level for creating tickets',
      instanceNameList: 'Application data source',
      reviewUser: 'Auditor',
      reviewUserType: 'Auditor type',
      reviewDesc: 'Step description',
      execUser: 'Executor',
      execUserType: 'Executor type'
    },
    rule: {
      descMessage: 'Step description cannot exceed 255 characters',
      userRequired: 'At least one specified person needs to be added',
      userMessage: 'Only three specified persons can be added at most'
    }
  },

  progressConfig: {
    levelStep: {
      desc: 'Highest level'
    },
    createStep: {
      title: 'Ticket initiation/ticket update SQL statement',
      desc: 'The ticket is created, or the ticket is rejected and waiting for the SQL statement to be modified'
    },
    review: {
      title: 'Audit node',
      subTitle:
        'The auditor can execute “pass audit” or “reject” operations in this step',
      reviewUserType: {
        specifyAudit: 'Specify auditor',
        matchAudit: 'Match members who have data source audit permissions'
      }
    },
    exec: {
      title: 'Execute online',
      subTitle:
        'The executor can execute “execute online” or “reject” operations in this step',
      executeUserType: {
        specifyExecute: 'Specify executor',
        matchExecute: 'Match members who have data source online permissions'
      }
    },
    operator: {
      remove: 'Remove this step',
      moveUp: 'Move this step up',
      moveDown: 'Move this step down',
      addReview: 'Add audit node'
    },
    ruler: {
      title:
        'Please note the following when creating/updating the approval workflow:',
      rule1:
        'The approval process starts from the initiation of the ticket, and ends with the execution online after passing through the set audit steps;',
      rule2:
        'The approval workflow template can set up to 4 audit steps, or no audit steps can be set;',
      rule3:
        'When specifying the executor for a single step, at least one specified person needs to be added, and a maximum of three specified persons can be added.'
    }
  },

  auditLevel: {
    normal: 'Normal',
    error: 'Error',
    warn: 'Warning',
    notice: 'Notice'
  }
};
