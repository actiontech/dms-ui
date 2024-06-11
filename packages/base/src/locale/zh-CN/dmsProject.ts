// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '项目管理',
  pageDesc:
    '从项目维度组织管理DMS平台的资源和功能，以项目为入口支持各种审核功能，不同项目之间资源隔离。',
  projectList: {
    title: '项目列表',
    deleteSuccessTips: '删除项目"{{name}}"成功',
    archiveProjectSuccessTips: '冻结项目"{{name}}"成功',
    unarchiveProjectSuccessTips: '启用项目"{{name}}"成功',
    exportMessage: '正在导出项目',
    columns: {
      status: '项目状态',
      available: '可用',
      unavailable: '不可用',
      createTime: '创建时间',
      createUser: '创建人',
      deleteProjectTips: '确认要删除项目"{{name}}"么?',
      archive: '冻结',
      unarchive: '启用',
      archiveProjectTips: '确认要冻结项目"{{name}}"么?',
      unarchiveProjectTips: '确认要启用项目"{{name}}"么?'
    }
  },
  projectForm: {
    name: '项目名称',
    desc: '项目描述',
    business: '可用业务',
    addBusiness: '添加业务',
    deleteTip: '当前业务已有关联资源，无法删除',
    fixedBusiness: '是否固定可选业务标签',
    fixedBusinessExtra:
      '若开启，项目内可用的业务标签将被固定，仅能由管理员管理',
    businessName: '业务名称'
  },
  createProject: {
    modalTitle: '创建项目',
    createSuccessTips: '创建项目{{name}}成功'
  },
  updateProject: {
    modalTitle: '编辑项目',
    updateSuccessTips: '更新项目{{name}}成功'
  },
  detail: {
    modalTitle: '选择项目',
    modalTips: ' 暂无最近打开的项目, 请选择一个项目!',
    projectSelectorDropdownSlot: '项目列表'
  },
  exportProject: {
    buttonText: '导出'
  },
  importProject: {
    buttonText: '导入',
    title: '导入项目及业务',
    selectFile: '请选择导入文件',
    submitText: '导入',
    fileRequireTips: '当前未选择任何文件',
    successTitle: '导入项目及业务成功',
    successTips: '到项目列表查看刚刚导入的项目',
    importingFile: '正在导入文件...',
    downloadTemplate: '下载导入模板',
    table: {
      project: '项目',
      desc: '描述',
      business: '业务'
    }
  },
  batchImportDataSource: {
    buttonText: '批量导入数据源',
    title: '批量导入数据源',
    successTitle: '批量导入数据源成功',
    requestAuditErrorMessage:
      '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入'
  },
  backToList: '返回项目列表'
};
