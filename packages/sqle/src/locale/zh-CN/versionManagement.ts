// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '版本管理',
  ceTips:
    '在多人协作的数据库开发中，版本管理能让您轻松追踪和控制SQL变更，监控从开发到生产的全流程变更，实时掌握发布进度，确保您的数据库变更安全可控。',
  operation: {
    add: '添加版本',
    backToListPage: '返回版本管理列表'
  },
  list: {
    column: {
      name: '版本名称',
      desc: '版本说明',
      status: '版本状态',
      createTime: '创建时间',
      lockTime: '锁定时间'
    },
    action: {
      lock: '锁定',
      lockConfirm: '锁定后无法再修改版本中的变更内容，确认锁定该版本吗？',
      deleteConfirm:
        '删除版本记录后，将去除工单上的版本标签，确定删除改版本吗？',
      locking: '正在锁定版本...',
      lockSuccessTip: '锁定版本成功',
      deleting: '正在删除版本...',
      deleteSuccessTip: '删除版本成功'
    },
    locked: '已锁定',
    releasing: '发布中'
  },
  create: {
    title: '创建版本',
    successTips: '创建版本成功',
    viewVersionDetail: '查看版本详情',
    continueText: '继续创建版本'
  },
  update: {
    title: '更新版本',
    successTips: '更新版本成功'
  },
  form: {
    baseInfo: '版本基础信息',
    name: '版本名称',
    nameTip: '请填写具有标识性的版本名称，用来识别本次发布，如SQLE2.2409.0',
    desc: '版本说明',
    descTip: '请填写本次发布的目的，提示版本变更范围',
    deploymentStageConf: '部署阶段配置',
    addStage: '添加部署阶段',
    stageName: '阶段名称',
    instance: '数据源',
    dev: '开发',
    test: '测试',
    prod: '生产'
  },
  detail: {
    backToVersionDetail: '返回版本详情',
    deploy: '发布',
    execute: '上线'
  },
  release: {
    title: '批量发布工单',
    targetDataSource: '目标发布数据源',
    currentDataSource: '工单当前数据源',
    schemaPlaceholder: '请选择数据库（选填）',
    successTips: '批量发布工单成功'
  },
  execute: {
    title: '批量上线工单',
    currentAllowExecuteWorkflow: '当前阶段可上线工单',
    successTips: '批量上线工单成功'
  },
  stageNode: {
    workflowDesc: '工单描述',
    executeTime: '上线时间',
    retry: '重试',
    offlineExecuted: '已线下执行',
    addExistingWorkflow: '添加已有工单',
    createWorkflow: '创建新工单'
  },
  associateWorkflow: {
    title: '关联已有工单',
    workflow: '工单',
    workflowName: '工单名称',
    workflowDesc: '工单描述',
    workflowStatus: '工单状态',
    successTips: '关联工单成功'
  },
  offlineExec: {
    title: '线下执行',
    remarks: '备注',
    successTips: '线下执行成功'
  }
};
