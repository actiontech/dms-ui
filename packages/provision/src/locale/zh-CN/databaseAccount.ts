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
    lockSuccessTips: '账号已禁用',
    usedByWorkbenchTips: '开启工作台查询成功',
    cancelUsedByWorkbenchTips: '取消工作台查询成功',
    unlockSuccessTips: '账号已启用',
    managedSuccessTips: '密码已托管',
    unmanagedSuccessTips: '密码已取消托管',
    deleteSuccessTips: '账号删除成功',
    deleteConfirm: '确定要删除账号：{{name}}？',
    cancelManage:
      '取消托管后，平台将不再记录账号密码，成员无法通过CB工作台访问该账号，是否确认取消托管？',
    column: {
      account: '账号',
      desc: '说明',
      dbService: '数据源',
      privilege: '权限',
      expiredTime: '密码有效期',
      remainingDay: '密码有效时间',
      policy: '密码安全策略',
      status: '账号状态',
      statusTips:
        '用于标识账号当前的可用状态，禁用状态意味着账户无法登录，也无法使用任何功能',
      deposit: '托管密码',
      depositTips:
        '用于标识账号是否由平台管理密码，如果未托管，就无法授权并用于SQL工作台',
      workbench: '是否用于SQL工作台',
      auth: '账号授权'
    },
    action: {
      view: '查看',
      authorize: '授权',
      modifyPassword: '修改密码',
      renewal: '续用当前密码',
      modifyPrivilege: '变更账号权限',
      disable: '禁用',
      enable: '启用',
      delete: '删除',
      manage: '托管密码',
      cancelManage: '取消托管',
      usedByWorkbench: '开启工作台查询',
      cancelUsedByWorkbench: '取消工作台查询'
    },
    batchAction: {
      authorize: '批量授权',
      modifyPassword: '批量修改密码',
      renewal: '批量续期',
      disable: '禁用',
      delete: '删除'
    }
  },
  discovery: {
    title: '账号发现',
    business: '业务',
    service: '数据源',
    dbAccount: '数据库账户',
    dbAccountNumber: '本次发现数据库账号数量：{{number}}',
    pleaseSelectDBAccount: '请选择本次需要同步的数据库账号',
    syncAccount: '同步账户',
    syncAccountTip:
      '对同一数据源可以进行多次账号发现，账号发现时将会过滤掉已经在平台上的账号',
    syncSuccess: '同步账户成功',
    userFilterPlaceholder: '输入账号名进行搜索'
  },
  create: {
    returnText: '返回账号管理列表',
    title: '创建数据库账号',
    baseInfo: '账户基本信息',
    privilegeInfo: '数据权限',
    objectPrivilegesOverview: '对象权限概览',
    result: {
      success: '创建账号成功',
      continue: '继续创建',
      viewDetail: '查看账号详情'
    },
    normalPolicy: '无',
    form: {
      syncDatabase: '同步数据库最新的库表数据',
      username: '连接账号名',
      usernameExtra: '账号名检测通过',
      hostname: '主机名(host)',
      hostnameDesc: '用来指定允许连接的IP地址或主机名',
      hostnameTips: 'MySQL/OB必填参数',
      password: '连接密码',
      confirm_password: '确认连接密码',
      password_error: '您输入的两个密码不匹配',
      policy: '密码安全策略',
      effectiveTimeDay: '密码有效期',
      effectiveTimeDayValidationMessage: '密码有效期必须填写大于0的值。',
      desc: '账号说明',
      descPlaceholder: '点击添加账户说明（选填）',
      removeConfirmTips: '是否确认删除当前对象权限信息?',
      clearConfirmTips: '是否确认清除当前对象权限信息？',
      objects: '数据对象',
      operation: '操作权限',
      syncSuccessTips: '同步字典数据成功',
      extraEmptyTips: '您还没有为当前账号添加对象权限',
      addObjectPrivileges: '添加对象权限',
      editDataPrivileges: '编辑对象权限',
      resetObjectPrivileges: '清除所有对象权限',
      selectObjects: '选择数据库表',
      oracleTypeSchemaValidationMessage:
        '添加对象权限时，Oracle类型需选择数据库。',
      addDatabaseTable: '添加数据库表',
      selectPrivileges: '选择对象权限',
      objectPrivilegesValidateMessage:
        'GRANT权限不能单独授予，必须至少伴随一个其他权限。请确保您的权限配置符合要求。',
      duplicateError: '已存在相同数据源、相同数据对象、相同数据操作的权限',
      privilegesTip:
        '当选择的对象权限范围不包含表时，您只能设置数据库级别的权限，而不能选择具体的表对象。',
      containerName: '容器名',
      role: '角色',
      systemPrivileges: '系统权限',
      objectPrivileges: '对象权限',
      quickCreateRoles: '快速创建角色'
    },
    previewModal: '账号创建预览'
  },
  update: {
    title: '更新数据库账号',
    result: {
      success: '变更账号权限成功'
    }
  },
  detail: {
    title: '账号详情',
    accountInfo: '连接信息',
    address: '链接地址',
    explanation: '说明',
    copyString: '复制连接串',
    getConnection: '授权信息',
    createTime: '本次密码生成时间',
    expireTime: '密码有效期',
    copyAll: '全文复制',
    authInfo: '授权信息',
    authUser: '授权成员',
    role: '角色',
    roleInfo: '角色信息',
    privilege: '权限',
    privilegeInfo: '权限信息'
  },
  authorize: {
    title: '账号授权',
    currentAccount: '当前账号',
    selectUser: '授权成员',
    successTip: '授权成功'
  },
  modifyPassword: {
    title: '修改密码',
    successTip: '修改密码成功'
  },
  renewalPassword: {
    title: '续用当前密码',
    dateTime: '设置续用时间（天）',
    successTip: '续用当前密码成功'
  },
  batchModifyPassword: {
    selectedAccount: '已选账号',
    successTip: '批量修改密码成功',
    password: '密码',
    batchGenerate: '批量生成密码'
  },
  manageAccount: {
    successTip: '托管密码成功',
    passwordTip: '请输入正确的连接密码，连接成功后您将收到“托管成功”的提示'
  }
};
