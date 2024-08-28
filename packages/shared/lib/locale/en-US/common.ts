// eslint-disable-next-line import/no-anonymous-default-export
export default {
  username: 'Username',
  password: 'Password',

  unknownError: 'Unknown error...',
  unknownStatus: 'Unknown status...',
  unknown: 'Unknown',
  status: 'Status',

  all: 'All',
  enabled: 'Enabled',
  notEnabled: 'Not enabled',
  disabled: 'Disabled',

  opened: 'Opened',
  notOpen: 'Not opened',

  copied: 'Copied successfully',
  true: 'Yes',
  false: 'No',
  refresh: 'Refresh',
  ok: 'Confirm',
  cancel: 'Cancel',
  submit: 'Submit',
  close: 'Close',
  edit: 'Edit',
  modify: 'Modify',
  manage: 'Manage',
  delete: 'Delete',
  add: 'Add',
  clear: 'Clear',
  activate: 'Activate',
  reset: 'Reset',
  resetAll: 'Reset all',
  search: 'Search',
  retry: 'Retry',
  back: 'Back',
  more: 'More',
  upload: 'Upload file',
  resetAndClose: 'Close and reset form',
  operateSuccess: 'Operation successful',
  operate: 'Operate',
  tips: 'Notice',
  hide: 'Hide',
  wait: 'Please wait',
  save: 'Save',
  open: 'Open',
  alreadyUsed: 'Already used',
  userNumber: 'User number',
  generate: 'Generate',
  generatePasswordSuccess:
    'Generated a 16-digit password and copied it to the clipboard',
  test: 'Test',
  download: 'Download',
  uploadAndUpdate: 'Upload and update',

  prevStep: 'Previous step',
  nextStep: 'Next step',

  expansion: 'Expand',
  collapse: 'Collapse',

  showAll: 'Show all',
  showDetail: 'View details',
  showMore: 'Show more',

  in: 'In',
  on: 'On',
  and: 'And',
  at: 'In',
  preview: 'Preview',

  success: 'Success',
  fail: 'Fail',

  theme: {
    light: 'Light mode',
    dark: 'Dark mode'
  },

  logout: 'Log out',
  account: 'Personal center',

  copySuccess: 'Copied successfully',
  clickHere: 'Click here',

  request: {
    noticeFailTitle: 'Request error'
  },
  tip: {
    net_error: 'Data link exception, please check network',
    no_data: 'No data',
    no_rule_data: 'No more rules',
    selectFile: 'Please select a file'
  },

  time: {
    hour: 'Hour',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    week: 'Week',
    minute: 'Minute',
    everyDay: 'Every day',
    everyWeek: 'Every week',
    permanent: 'Permanent',
    oneYear: 'One year',
    oneMonth: 'One month',
    oneWeek: 'One week',
    per: 'Per'
  },

  week: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  },

  form: {
    placeholder: {
      input: 'Please enter {{name}}',
      select: 'Please select {{name}}',
      upload: 'Please upload {{name}}',
      searchInput: 'Please enter the {{name}} you want to search',
      searchSelect: 'Please select the {{name}} you want to search'
    },
    rule: {
      require: '{{name}} must be filled in',
      selectFile: 'You must select a file',
      passwordNotMatch: 'The two passwords entered do not match',
      passwordConfirmTips:
        'Please make sure that the two passwords entered are consistent',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid mobile number',
      startWithLetter: 'Must start with a letter',
      onlyLetterAndNumber:
        'Can only contain letters, numbers, hyphens and underscores',
      startWithWords: 'Must start with a letter or Chinese',
      onlyWordsAndNumber:
        'Can only contain Chinese characters, letters, numbers, hyphens and underscores',
      cidr: 'Please enter a valid ipv4 and mask',
      onlyNumber: 'Can only contain numbers',
      portRange: 'The port range is {{min}}-{{max}}',
      integer: 'Can only enter positive integers',
      numberRange:
        'The range of {{name}} is a positive integer between {{min}}-{{max}}',
      maxLength: 'At most {{max}} characters',
      nameRule:
        'Can only contain letters, numbers, Chinese, hyphens and underscores'
    }
  },
  cron: {
    mode: {
      select: 'Visual selection',
      manual: 'Manual input'
    },
    label: {
      interval: 'Frequency',
      point: 'Time point'
    },
    time: {
      everyDay: 'Every day',
      everyWeek: 'Every week'
    },
    errorMessage: {
      invalid: 'Invalid cron expression',
      mustBeString: 'Cron expression must be a string',
      mustBeArray: 'The changed value must be an array',
      lenMustBeFive:
        'Cron expression must only contain (minute hour date month week) 5 elements',
      onlyHaveValidChar:
        'Cron expression can only contain numbers hyphens (-), slashes (/), and commas (,)',
      limit:
        'Your expression contains invalid numerical ranges, minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    },
    placeholder: 'Please enter the time',
    subTitle: {
      auditsFrequency: 'Frequency',
      timerPoint: 'Time point'
    },
    week: {
      Sun: 'Sunday',
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday'
    }
  },
  maintenanceTimePicker: {
    placeholder: 'Please select a time period',
    duplicate: 'Cannot add the same time period repeatedly',
    range: 'Time period'
  },
  testDatabaseConnectButton: {
    testDatabaseConnection: 'Test data source connectivity',
    testing: 'Attempting to connect...',
    testSuccess: 'Data source connectivity test successful',
    testFailed: 'Failed to connect to the data source'
  },

  sqlStatements: 'SQL statements',

  enterpriseFeatureDisplay: {
    featureDescription: 'Feature description',
    additionalAttention: 'More attention',
    businessLink:
      '{{featureName}} is an enterprise version feature. If you want to use this feature, you can contact us through the following link.',
    compareLink:
      'If you want to know more about the difference between the enterprise version and the community version, please refer to the user manual',
    userBook: 'User manual',
    linkUs: 'Actionstech official website'
  },

  actiontechTable: {
    searchInput: {
      placeholder: 'Enter keywords to search'
    },
    filterButton: {
      filter: 'Filter',
      clearFilter: 'Close filter'
    },
    setting: {
      buttonText: 'Table settings',
      fixedLeft: 'Fixed on the left',
      fixedRight: 'Fixed on the right',
      noFixed: 'Not fixed'
    },
    filterContainer: {
      rangePickerPlaceholderStart: 'Start time',
      rangePickerPlaceholderEnd: 'End time'
    },
    pagination: {
      total: 'Total {{total}} records'
    }
  },
  version: {
    currentVersion: 'Current version',
    ce: 'Community edition',
    ee: 'Enterprise edition',
    demo: 'Professional edition',
    startApply: 'Start trial',
    ceDesc:
      'Supports the management of MySQL data sources\nsupports resource permission isolation\nintegrated CloudBeaver online query\nprovides professional SQL audit capabilities\nsupports multiple methods for collecting MySQL data\nno instance limit',
    demoDesc:
      'Supports the management of more than 10 mainstream data sources\nsupports resource permission isolation\nintegrated CloudBeaver online query\nprovides professional SQL audit capabilities\nsupports multiple methods for collecting data from various data sources\nmaximum instance number 20',
    eeDesc:
      'Supports the management of more than 10 mainstream data sources\nsupports resource permission isolation\nintegrated CloudBeaver online query\nprovides professional SQL audit capabilities\nsupports multiple methods for collecting data from various data sources\nno instance limit\nmultidimensional intelligent statistics\npersonalized customization',
    ceSubTitle: 'Suitable for MySQL basic audit scenarios',
    demoSubTitle: 'Suitable for various data source type experience scenarios',
    eeSubTitle: 'Suitable for private cloud user customization scenarios',
    ceTitle: 'Free',
    demoTitle: 'Free',
    eeTitle: 'Customized',
    ceTerm: 'Permanent',
    demoTerm: 'Permanent',
    ceButtonText: 'Fast deployment',
    demoButtonText: 'Apply now',
    eeButtonText: 'Contact us',
    bottomDesc:
      'For complete functional comparisons of each version, please refer to:',
    functionalComparison: 'Functional comparison'
  }
};
