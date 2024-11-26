// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '角色管理',
  actions: {
    create: {
      label: '创建角色',
      succeedTips: '角色权限创建成功！'
    },
    update: {
      succeedTips: '角色权限更新成功！'
    },
    delete: {
      confirmTitle: '是否删除当前角色？',
      succeedTips: '角色权限删除成功！'
    }
  },
  tableColumns: {
    role: '角色名',
    childRoles: '子角色',
    permissions: '权限',
    dbService: '数据源',
    containerName: '容器名称'
  },
  tableFilters: {
    dbService: '数据源',
    containerName: '容器名称'
  },
  createRole: {
    title: '创建角色',
    successTips: '创建成功',
    dbService: '数据源',
    roleName: '角色名称',
    rolePermissions: '角色权限',
    role: '角色',
    permission: '权限'
  },
  updateRole: {
    title: '更新角色'
  },
  roleDetail: {
    title: '角色详情',
    roleInfo: '角色信息',
    roleName: '角色名',
    dbServiceName: '数据源',
    dataPermission: '数据权限'
  }
};
