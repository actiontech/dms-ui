// eslint-disable-next-line import/no-anonymous-default-export
export default {
  authAudit: {
    title: '授权审计',
    columns: {
      time: '产生时间',
      permissionUser: '使用人',
      purpose: '目的或用途',
      template: '权限模板',
      actionUser: '操作用户',
      actionType: '操作类型'
    },
    type: {
      authCreated: '创建授权',
      authUpdated: '更新授权',
      authDeleted: '删除授权'
    }
  },
  templateAudit: {
    title: '权限模版审计',
    columns: {
      template: '模板名称'
    },
    type: {
      templateCreated: '创建权限模版',
      templateUpdated: '更新权限模版',
      templateDeleted: '删除权限模版'
    }
  },
  serviceAudit: {
    title: '数据源操作审计',
    columns: {
      service: '数据源',
      business: '数据所在业务',
      statement: '语句'
    }
  },
  authAuditDetail: {
    title: '授权详情',
    subTitle: {
      actionInfo: '动作信息',
      objectInfo: '对象信息'
    },
    time: '产生时间',
    type: '操作类型',
    purpose: '目的或用途',
    authUser: '使用人',
    actionUser: '操作用户',
    template: '权限模版',
    memo: '备注',
    details: '数据库账号详情',
    columns: {
      username: '连接账号名',
      hostname: '连接域',
      password: '连接密码',
      explain: '说明'
    }
  },
  templateAuditDetail: {
    title: '模版详情',
    templateDetail: '权限模版详情'
  },
  serviceAuditDetail: {
    title: '数据源操作详情',
    operateResult: '操作结果'
  }
};
