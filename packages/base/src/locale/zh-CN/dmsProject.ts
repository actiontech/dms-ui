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
    desc: '项目描述'
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
  }
};
