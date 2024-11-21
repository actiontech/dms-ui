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
      permission: '权限',
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
      modifyPermission: '变更账号权限',
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
    syncAccountTip:
      '对同一数据源可以进行多次账号发现，账号发现时将会过滤掉已经在平台上的账号',
    syncSuccess: '同步账户成功'
  },
  create: {
    returnText: '返回账号管理列表',
    title: '创建数据库账号',
    baseInfo: '账户基本信息',
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
      hostname: '主机名(host)',
      hostnameDesc: '用来指定允许连接的IP地址或主机名',
      hostnameTips: 'MySQL/OB必填参数',
      password: '连接密码',
      confirm_password: '确认连接密码',
      password_error: '您输入的两个密码不匹配',
      policy: '密码安全策略',
      effectiveTimeDay: '密码有效期',
      desc: '账号说明',
      descPlaceholder: '点击添加账户说明（选填）',
      removeConfirmTips: '是否确认删除当前数据权限信息?',
      clearConfirmTips: '是否确认清除当前数据权限信息？',
      objects: '数据对象',
      operation: '数据操作',
      permissionErrorTips: '请添加数据权限',
      syncSuccessTips: '同步字典数据成功',
      extraEmptyTips: '您还没有为当前账号添加数据权限',
      addDataPermission: '添加数据权限',
      editDataPermission: '编辑数据权限',
      resetPermission: '清除所有权限',
      selectObjects: '选择数据库表',
      addDatabaseTable: '添加数据库表',
      selectPermission: '选择权限',
      duplicateError: '已存在相同数据源、相同数据对象、相同数据操作的权限',
      permissionTip:
        '如果您选定了一个Schema，此时再选中该数据源中的所有数据对象将无意义',
      containerName: '容器名',
      role: '角色',
      permission: '权限',
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
    originPermission: '原始权限',
    role: '角色',
    permission: '权限'
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
