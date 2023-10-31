// eslint-disable-next-line import/no-anonymous-default-export
export default {
  username: 'username',
  password: 'password',

  unknownError: 'Unknown Error',
  unknownStatus: 'Unknown Status',
  unknown: 'Unknown',
  status: 'status',

  all: '全部',

  true: 'true',
  false: 'false',
  refresh: 'refresh',
  ok: 'Ok',
  cancel: 'Cancel',
  submit: 'Submit',
  close: 'Close',
  edit: 'Edit',
  modify: 'Modify',
  manage: 'Manage',
  delete: 'Delete',
  reset: 'Reset',
  search: 'Search',
  retry: 'Retry',
  back: 'Back',
  more: 'More',
  upload: 'Upload',
  resetAndClose: 'Reset Form And Close',
  operateSuccess: 'Operate successfully',
  operate: 'Operate',
  alreadyUsed: 'Already used',
  userNumber: 'User number',
  tips: '注意',
  hide: '隐藏',
  wait: '请稍后',
  save: '保存',
  open: '开启',
  generate: '生成',
  generatePasswordSuccess: '已生成16位密码并复制在剪贴板中',
  test: 'Test',

  prevStep: 'Prev',
  nextStep: 'Next',

  expansion: 'Expand',
  collapse: 'Collapse',

  showAll: 'Show All',
  showDetail: 'Show Detail',
  showMore: 'Show More',

  in: '在',
  on: '的',
  and: '且',
  at: '中',
  preview: '预览',

  success: '成功',
  fail: '失败',

  theme: {
    light: 'Light Theme',
    dark: 'Dark Theme'
  },

  logout: 'Logout',
  account: 'Account',

  copySuccess: '复制成功',
  clickHere: '点击此处',

  request: {
    noticeFailTitle: 'Request Failed'
  },
  tip: {
    net_error: '数据链接异常，请检查网络',
    no_data: '暂无数据'
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
      input: 'Please input {{name}}',
      select: 'Please select {{name}}',
      searchInput: 'Input the {{name}} to search',
      searchSelect: 'Select the {{name}} to search'
    },
    rule: {
      require: 'Please input {{name}}',
      selectFile: '必须选择一个文件',
      passwordNotMatch: 'The two passwords that you entered do not match!',
      passwordConfirmTips: '请确保两次输入的密码一致',
      email: 'The input is not valid E-mail!',
      phone: 'The input is not valid cellphone',
      startWithLetter: '必须要以字母开头',
      onlyLetterAndNumber: '只能包含字母、数字、中划线和下划线',
      startWithWords: '必须要以字母、中文开头',
      onlyWordsAndNumber: '只能包含汉字、字母、数字、中划线和下划线',
      cidr: '请输入有效的ipv4以及掩码',
      onlyNumber: '只能包含数字',
      portRange: '端口号范围为{{min}}-{{max}}',
      integer: '只能输入正整数',
      numberRange: '{{name}}范围是{{min}}-{{max}}间的正整数'
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
    placeholder: '请输入审核时间',
    subTitle: {
      auditsFrequency: '审核频率',
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
    testDatabaseConnection: '测试数据库连通性',
    testing: '正在尝试进行连接...',
    testSuccess: '数据库连通性测试成功',
    testFailed: '未能成功链接到数据库'
  },

  sqlStatements: 'SQL语句',

  enterpriseFeatureDisplay: {
    featureDescription: '功能说明',
    additionalAttention: '更多关注',
    businessLink:
      '{{featureName}}为企业版功能。如您想使用该功能，可以通过以下链接联系我们。',
    compareLink: '如您想了解更多关于企业版及社区版功能的差异，可参考用户手册：'
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
  }
};
