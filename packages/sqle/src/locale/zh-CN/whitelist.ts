// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核SQL例外',
  pageDesc:
    '您可以在这里添加一些SQL语句，这些SQL语句在进行审核的时候不会触发任何审核规则。',

  ceTips:
    '如果用户开启了某条规则，但在实际使用中又想临时规避某些规则的触发，可以启用平台的审核SQL例外功能。\n目前支持按字符串匹配或按照SQL指纹匹配，添加在SQL审核审核SQL例外中的语句，在提交工单申请时，将不受审核规则的约束。',
  allWhitelist: '所有审核SQL例外语句',
  table: {
    sql: '内容',
    desc: '描述',
    matchType: '匹配类型',
    matchCount: '匹配次数',
    lastMatchedTime: '最后一次匹配时间'
  },

  matchType: {
    exact: '字符串匹配',
    fingerPrint: 'SQL指纹匹配'
  },

  operate: {
    addWhitelist: '添加审核SQL例外',

    deleting: '正在删除审核SQL例外语句...',
    deleteSuccess: '删除审核SQL例外语句成功',
    confirmDelete: '确认删除这条审核SQL例外么？'
  },

  modal: {
    add: {
      title: '添加审核SQL例外',
      success: '添加审核SQL例外成功'
    },
    update: {
      title: '更新审核SQL例外',
      success: '更新审核SQL例外成功',
      tips: '当修改匹配类型或匹配内容后，该条记录的匹配次数和最后匹配时间将被重置。'
    },
    sql: 'SQL语句'
  }
};
