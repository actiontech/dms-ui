// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Dashboard',
  high: '高',
  medium: '中',
  low: '低',
  tab: {
    workflow: '工单管理',
    sqlGovernance: 'SQL治理',
    account: '账号管理'
  },
  common: {
    missingProject: '缺少项目信息，无法跳转'
  },
  workflow: {
    card: {
      pendingMine: '待我处理',
      pendingMineSubtitle: '需立即行动',
      initiated: '我发起的',
      initiatedSubtitle: '关注进度',
      archived: '已归档',
      archivedSubtitle: '已完结任务'
    },
    column: {
      name: '工单名称',
      type: '工单类型',
      project: '项目',
      instance: '数据源',
      assignee: '当前处理人',
      priority: '优先级',
      status: '状态'
    },
    status: '工单状态',
    name: '工单名称',
    desc: '工单描述',
    createTime: '创建时间',
    statusLabel: {
      pending_approval: '待审批',
      pending_action: '待处理',
      in_progress: '处理中',
      exporting: '导出中',
      rejected: '已驳回',
      cancelled: '已取消',
      failed: '已失败',
      completed: '已完成',
      unknown: '未知'
    },
    workflowTypeLabel: {
      sql_release: 'SQL上线工单',
      data_export: '数据导出工单'
    },
    filter: {
      workflowType: '工单类型'
    },
    toolbar: {
      searchPlaceholder: '搜索工单标题或工单 ID'
    }
  },
  sql: {
    card: {
      pending: '待治理SQL',
      pendingSubtitle: 'SQL管控过程中需调整的SQL',
      optimized: '优化完成',
      optimizedSubtitle: '已优化的SQL'
    },
    column: {
      sqlFingerprint: 'SQL指纹',
      suggestion: '优化建议/说明',
      source: '来源',
      project: '项目',
      instance: '数据源',
      lastSeenAt: '最后出现',
      status: '状态',
      action: '操作',
      avgTime: '平均 {{value}}s',
      execCount: '执行 {{value}} 次'
    },
    taskStatus: {
      unhandled: '待处理',
      solved: '已优化',
      ignored: '已忽略',
      manual_audited: '人工审核中',
      sent: '已分配'
    },
    action: {
      optimize: '去优化',
      detail: '详情'
    },
    toolbar: {
      searchPlaceholder: '搜索 SQL 指纹、优化建议或来源'
    }
  },
  pendingSql: {
    title: '待解决SQL',
    column: {
      desc: '说明',
      source: '来源',
      status: '处理状态',
      firstAppearTime: '出现时间',
      instance: '所属数据源',
      project: '所属项目',
      projectPriority: '项目优先级',
      detail: '详情'
    },
    ceTips:
      '待处理SQL面板将整合SQL管控中被识别为问题的SQL，如您需要集中追踪问题SQL解决进度，可以在待处理SQL面板中进行全局访问。'
  },
  pendingExportWorkflow: {
    title: '导出工单',
    ceTips: '此处汇总了所有待处理的数据导出工单，方便用户集中查看与操作。',
    column: {
      status: '工单状态',
      name: '工单名称',
      desc: '工单描述',
      createTime: '创建时间',
      instance: '所属数据源',
      viewWorkflowDetail: '查看工单详情',
      project: '所属项目',
      projectPriority: '项目优先级'
    },
    status: {
      canceled: '已关闭',
      exporting: '正在导出',
      finished: '导出成功',
      failed: '导出失败',
      rejected: '已驳回',
      waiting_for_export: '待导出',
      wait_for_approve: '待审核'
    }
  },
  pendingWorkOrder: '待解决工单',
  onlineWorkOrder: '上线工单',
  exportWorkOrder: '导出工单',
  initiatedWorkOrder: '发起的工单',
  pendingMyAction: '仅看待我操作',
  account: {
    card: {
      expiringSoon: '即将过期',
      expiringSoonSubtitle: '请尽快续期',
      active: '活跃账号总数',
      activeSubtitle: '状态正常',
      myActive: '我的可用账号',
      myActiveSubtitle: '状态正常'
    },
    column: {
      accountName: '账号名称',
      project: '项目',
      instance: '数据库',
      creator: '账号创建人',
      expiredTime: '剩余有效期',
      status: '状态',
      action: '操作'
    },
    expireDaysRemaining: '剩余 {{count}} 天',
    expireDaysOverdue: '已过期 {{count}} 天',
    statusValue: {
      active: '正常',
      expiring: '临期',
      expired: '已过期',
      locked: '已锁定'
    },
    action: {
      renew: '一键续期',
      applyRenew: '申请续期',
      recycle: '强制回收',
      logout: '注销账号',
      detail: '详情'
    },
    confirm: {
      recycle: '确定要强制回收该账号吗？',
      logout: '确定要注销该账号吗？'
    }
  },
  filter: {
    project: '项目',
    instance: '数据源'
  }
};
