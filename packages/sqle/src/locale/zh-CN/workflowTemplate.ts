// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审批流程模版',
  pageDesc: '你可以在这里管理默认审批流程模版。',
  list: {
    title: {
      listTable: '审批流程模版列表'
    },

    table: {
      workflowTemplateName: '审批流程模版名称',
      desc: '审批流程模版描述'
    },

    operator: {
      create: '创建审批流程模版'
    }
  },

  create: {
    title: {
      returnButton: '返回审批流程模版',
      wrapper: '创建审批流程模版'
    },
    result: {
      title: '创建审批流程模版成功',
      createNew: '再创建一个新的审批流程模版',
      backToList: '返回列表查看刚刚创建的审批流程模版'
    }
  },

  update: {
    title: {
      wrapper: '更新审批流程模版'
    },
    result: {
      title: '更新审批流程模版成功',
      showNow: '查看刚刚更新的审批流程模版'
    }
  },

  delete: {
    confirm: '确认移除审批流程模版 {{name}} ？',
    deleting: '正在移除审批流程模版 {{name}}...',
    successTips: '移除审批流程模版 {{name}} 成功'
  },

  detail: {
    title: {
      wrapper: '审批流程模版详情',
      base: '审批流程模版基本信息',
      step: '审批流程模版步骤',
      noticeInfo: '注意事项',
      updateTime: '审批流程模板更新时间'
    },
    updateTemplate: '修改当前审批流程模版',
    authLevelInfo: {
      first:
        '若项目管理员对审批流程模板进行了修改，不会对已经在审批流程的工单造成影响；',
      second:
        '被驳回的工单，需要创建人更新SQL语句后重新发起，驳回记录可在 “工单进度-工单历史操作” 中查看；',
      third: '处于 “审核节点” 中的工单，创建人可在工单详情页随时关闭；',
      fourth: '审核工单：审核人在该步骤可以执行「审核通过」或「驳回」操作；',
      fifth: '上线工单：执行人在该步骤可以执行「执行上线」或「驳回」操作。'
    }
  },

  step: {
    baseFormTitle: '基本信息',
    baseFormDesc: '设定模版的基本信息',

    progressTitle: '审核节点',
    progressDesc:
      '编辑审核流程，拖拽移动审核节点顺序，审核人在该步骤可以执行「审核通过」或「驳回」操作',

    execTitle: '执行上线',
    execDesc: '编辑审核流程，执行人在该步骤可以执行「执行上线」或「驳回」操作',

    resultTitle: '结果',
    resultDesc: '变更结果'
  },

  form: {
    label: {
      name: '审批流程模版名称',
      desc: '审批流程模版描述',
      allowSubmitWhenLessAuditLevel: '允许创建工单的最高审核等级',
      instanceNameList: '应用的数据源',
      reviewUser: '审核人',
      reviewUserType: '审核人类型',
      reviewDesc: '步骤描述',
      execUser: '执行人',
      execUserType: '执行人类型'
    },
    rule: {
      descMessage: '步骤描述不能超过255个字符',
      userRequired: '最少需要添加一个指定人',
      userMessage: '最多只能添加三个指定人'
    }
  },

  progressConfig: {
    levelStep: {
      desc: '最高等级'
    },
    createStep: {
      title: '工单发起/工单更新SQL语句',
      desc: '工单被创建，或者工单被驳回后等待修改SQL语句'
    },
    review: {
      title: '审核节点',
      subTitle: '审核人在该步骤可以执行 审核通过或驳回 操作',
      reviewUserType: {
        specifyAudit: '指定审核人',
        matchAudit: '匹配拥有数据源审核权限的成员'
      }
    },
    exec: {
      title: '执行上线',
      subTitle: '执行人在该步骤可以执行 执行上线或驳回 操作',
      executeUserType: {
        specifyExecute: '指定执行人',
        matchExecute: '匹配拥有数据源上线权限的成员'
      }
    },
    operator: {
      remove: '移除该步骤',
      moveUp: '上移该步骤',
      moveDown: '下移该步骤',
      addReview: '添加审核节点'
    },
    ruler: {
      title: '创建/更新审批流程时请注意以下几点：',
      rule1:
        '审核流程自工单发起开始，通过设置的审核步骤后，最后以执行上线结束；',
      rule2: '审核流程模板最多可设置4个审核步骤，也可不设置审核步骤；',
      rule3:
        '单个步骤指定执行人时，最少需要添加一个指定人，最多只能添加三个指定人。'
    }
  },

  auditLevel: {
    normal: '普通(Normal)',
    error: '错误(Error)',
    warn: '告警(Warning)',
    notice: '提示(Notice)'
  }
};
