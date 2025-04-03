// eslint-disable-next-line import/no-anonymous-default-export
export default {
  username: '用户名',
  password: '密码',

  unknownError: '未知错误...',
  unknownStatus: '未知状态...',
  unknown: '未知',
  status: '状态',

  all: '全部',
  enabled: '已启用',
  notEnabled: '未启用',
  disabled: '已禁用',

  opened: '已开启',
  notOpen: '未开启',

  copied: '复制成功',
  true: '是',
  false: '否',
  refresh: '刷新',
  ok: '确认',
  cancel: '取消',
  submit: '提交',
  close: '关闭',
  edit: '编辑',
  modify: '修改',
  manage: '管理',
  delete: '删除',
  add: '添加',
  clear: '清除',
  activate: '激活',
  reset: '重置',
  resetAll: '重置所有内容',
  search: '搜索',
  retry: '重试',
  back: '返回',
  more: '更多',
  upload: '选择文件上传',
  resetAndClose: '关闭并重置表单',
  operateSuccess: '操作成功',
  operate: '操作',
  tips: '注意',
  hide: '隐藏',
  wait: '请稍后',
  save: '保存',
  open: '开启',
  alreadyUsed: '已使用',
  userNumber: '用户数量',
  generate: '生成',
  generatePasswordSuccess: '已生成16位密码并复制在剪贴板中',
  test: '测试',
  download: '下载',
  uploadAndUpdate: '上传并更新',

  prevStep: '上一步',
  nextStep: '下一步',

  expansion: '展开',
  collapse: '收起',

  showAll: '查看所有',
  showDetail: '查看详情',
  showMore: '查看更多',

  in: '在',
  on: '的',
  and: '且',
  at: '中',
  preview: '预览',

  success: '成功',
  fail: '失败',

  phone: '手机号',

  theme: {
    light: '明亮模式',
    dark: '暗黑模式'
  },

  logout: '退出登录',
  account: '个人中心',

  copy: '复制',
  copySuccess: '复制成功',
  clickHere: '点击此处',

  request: {
    noticeFailTitle: '请求错误'
  },
  tip: {
    net_error: '数据链接异常，请检查网络',
    no_data: '暂无数据',
    no_rule_data: '暂无更多规则',
    selectFile: '请选择文件'
  },

  time: {
    hour: '小时',
    year: '年',
    month: '月',
    day: '天',
    week: '星期',
    minute: '分钟',
    everyDay: '每天',
    everyWeek: '每周',
    permanent: '永久',
    oneYear: '一年',
    oneMonth: '一个月',
    oneWeek: '一个星期',
    per: '每'
  },

  week: {
    monday: '每周一',
    tuesday: '每周二',
    wednesday: '每周三',
    thursday: '每周四',
    friday: '每周五',
    saturday: '每周六',
    sunday: '每周日'
  },

  form: {
    placeholder: {
      input: '请输入{{name}}',
      select: '请选择{{name}}',
      upload: '请上传{{name}}',
      searchInput: '请输入要搜索的 {{name}}',
      searchSelect: '请选择要搜索的 {{name}}'
    },
    rule: {
      require: '必须填写{{name}}',
      selectFile: '必须选择一个文件',
      passwordNotMatch: '两次密码输入不一致',
      passwordConfirmTips: '请确保两次输入的密码一致',
      email: '请输入有效的邮箱地址',
      phone: '请输入有效的手机号',
      startWithLetter: '必须要以字母开头',
      onlyLetterAndNumber: '只能包含字母、数字、中划线和下划线',
      startWithWords: '必须要以字母、中文开头',
      onlyWordsAndNumber: '只能包含汉字、字母、数字、中划线和下划线',
      cidr: '请输入有效的ipv4以及掩码',
      onlyNumber: '只能包含数字',
      portRange: '端口号范围为{{min}}-{{max}}',
      integer: '只能输入正整数',
      numberRange: '{{name}}范围是{{min}}-{{max}}间的正整数',
      maxLength: '至多 {{max}} 个字符',
      nameRule: '只能包含字母、数字、中文、中划线和下划线'
    }
  },
  cron: {
    mode: {
      select: '可视化选择',
      manual: '手工填写'
    },
    label: {
      interval: '频率',
      point: '时间点'
    },
    time: {
      everyDay: '每天',
      everyWeek: '每周'
    },
    errorMessage: {
      invalid: '无效的cron表达式',
      mustBeString: 'cron表达式必须是一个字符串',
      mustBeArray: '变更的值必须是一个数组',
      lenMustBeFive: 'cron表达式必须只包含（分钟 小时 日期 月份 星期）5个元素',
      onlyHaveValidChar: 'cron表达式只能包含数字中划线(-),斜线(/),和逗号(,)',
      limit:
        '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    },
    placeholder: '请输入时间',
    subTitle: {
      auditsFrequency: '频率',
      timerPoint: '时间点'
    },
    week: {
      Sun: '星期日',
      Mon: '星期一',
      Tue: '星期二',
      Wed: '星期三',
      Thu: '星期四',
      Fri: '星期五',
      Sat: '星期六'
    }
  },
  maintenanceTimePicker: {
    placeholder: '请选择时间段',
    duplicate: '不可重复添加相同的时间段',
    range: '时间段'
  },
  testDatabaseConnectButton: {
    testDatabaseConnection: '测试数据源连通性',
    testing: '正在尝试进行连接...',
    testSuccess: '数据源连通性测试成功',
    testFailed: '未能成功链接到数据源'
  },

  sqlStatements: 'SQL语句',

  enterpriseFeatureDisplay: {
    featureDescription: '功能说明',
    additionalAttention: '更多关注',
    businessLink:
      '{{featureName}}为企业版功能。如您想使用该功能，可以通过以下链接联系我们。',
    compareLink: '如您想了解更多关于企业版及社区版功能的差异，可参考用户手册',
    userBook: '用户手册',
    linkUs: '爱可生官网'
  },

  actiontechTable: {
    searchInput: {
      placeholder: '输入关键字搜索'
    },
    filterButton: {
      filter: '筛选',
      clearFilter: '收起筛选'
    },
    setting: {
      buttonText: '表格设置',
      fixedLeft: '固定在左侧',
      fixedRight: '固定在右侧',
      noFixed: '不固定'
    },
    filterContainer: {
      rangePickerPlaceholderStart: '开始时间',
      rangePickerPlaceholderEnd: '结束时间'
    },
    pagination: {
      total: '共 {{total}} 条数据'
    }
  },
  version: {
    currentVersion: '当前版本',
    ce: '社区版',
    ee: '企业版',
    demo: '专业版',
    startApply: '开始试用',
    ceDesc:
      '支持纳管MySQL数据源\n提供专业SQL审核能力\n集成CloudBeaver在线查询\n支持IDE工具审核\n支持多方式采集MySQL数据\n无实例限制',
    demoDesc:
      '支持纳管10多种主流数据源\n提供专业SQL审核能力\n集成CloudBeaver在线查询\n支持IDE工具审核\n支持多方式采集各数据源数据\n最大实例个数20',
    eeDesc:
      '支持纳管10多种主流数据源\n提供专业SQL审核能力\n集成CloudBeaver在线查询\n支持IDE工具审核\n支持多方式采集各数据源数据\n无实例限制\n提供SQL问题下钻能力\n支持 SQL 变更的版本化管理\n支持备份恢复\n支持结构对比\nSQL合规重写\nSQL智能优化\n支持版本控制\n多维度智能统计\n个性化定制',
    ceSubTitle: '适用于MySQL基础审核场景',
    demoSubTitle: '适用于多种数据源类型体验场景',
    eeSubTitle: '适用于私有云用户定制场景',
    ceTitle: '免费',
    demoTitle: '免费',
    eeTitle: '定制',
    ceTerm: '永久',
    demoTerm: '永久',
    ceButtonText: '快速部署',
    demoButtonText: '立即申请',
    eeButtonText: '联系我们',
    bottomDesc: '各版本完整功能对比请参考：',
    functionalComparison: '功能对比'
  },
  verificationCodeInput: {
    code: '验证码',
    sendCode: '发送验证码',
    secondsLater: '{{number}}秒后重试'
  }
};
