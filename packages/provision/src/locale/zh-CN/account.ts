// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    title: '账号管理',
    findAccount: '账号发现',
    createAccount: '创建账号',
    member: '成员',
    lock: '禁用',
    unlock: '可用',
    managed: '已托管',
    unmanaged: '未托管',
    allAccount: '全部账号',
    availableAccount: '可用账号',
    disabledAccount: '禁用账号',
    expirationAccount: '临期账号',
    column: {
      account: '账号',
      desc: '说明',
      dbService: '数据源',
      permission: '权限',
      expiredTime: '密码有效期',
      policy: '密码安全策略',
      status: '账号状态',
      deposit: '托管密码',
      auth: '账号授权'
    },
    action: {
      view: '查看',
      authorize: '授权',
      modifyPassword: '修改密码',
      renewal: '续用当前密码',
      modifyPermission: '变更账号权限',
      disable: '禁用',
      delete: '删除',
      manage: '托管密码',
      cancelManage: '取消托管'
    },
    batchAction: {
      authorize: '批量授权',
      modifyPassword: '批量修改密码',
      renewal: '批量续期',
      disable: '禁用',
      delete: '删除',
      modifyPermission: '变更账号权限'
    }
  },
  discovery: {
    title: '账号发现',
    business: '业务',
    service: '数据源',
    dbAccount: '数据库账户',
    syncAccount: '同步账户',
    syncSuccess: '同步账户成功'
  },
  create: {
    returnText: '返回账号管理列表',
    title: '创建数据库账号',
    baseInfo: '基础配置',
    permissionInfo: '数据权限',
    permissionInfoOverview: '数据权限概览',
    result: {
      success: '创建账号成功',
      continue: '继续创建'
    },
    normalPolicy: '无',
    form: {
      username: '连接账号名',
      usernameExtra: '账号名检测通过',
      hostname: '连接域',
      hostnameTips: 'MySQL/OB必填参数',
      password: '连接密码',
      confirm_password: '确认连接密码',
      password_error: '您输入的两个密码不匹配',
      policy: '密码安全策略',
      effectiveTimeDay: '密码有效期',
      desc: '账号说明',
      descPlaceholder: '点击添加账户说明（选填）',
      removeConfirmTips: '是否确认删除当前数据权限信息?',
      clearConfirmTips: '是否确认清除当前数据权限信息？'
    }
  },
  update: {
    title: '更新数据库账号'
  }
};
