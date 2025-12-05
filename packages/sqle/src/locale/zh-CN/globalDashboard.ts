// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Dashboard',
  high: '高',
  medium: '中',
  low: '低',
  pendingWorkOrder: '待解决工单',
  onlineWorkOrder: '上线工单',
  exportWorkOrder: '导出工单',
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
  initiatedWorkOrder: '发起的工单',
  pendingMyAction: '仅看待我操作',
  filter: {
    project: '项目',
    instance: '数据源',
    projectPriority: '项目优先级'
  },
  workflow: {
    status: '工单状态',
    name: '工单名称',
    desc: '工单描述',
    createTime: '创建时间'
  }
};
