// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '管控SQL例外',
  ceTips:
    '用户现在可以利用平台的管控SQL例外功能，自定义设置以忽略特定的SQL语句或数据源，避免它们出现在管控面板中。一旦SQL语句被识别为例外，它将自动排除在SQL管控列表之外，减少不必要的关注和干扰，提升管控效率和准确性。',
  allWhitelist: '所有管控SQL例外语句',
  table: {
    content: '内容',
    desc: '描述',
    matchType: '匹配类型',
    matchCount: '匹配次数',
    lastMatchedTime: '最近一次匹配时间'
  },

  matchType: {
    sql: '关键字',
    fingerPrint: 'SQL指纹',
    ip: 'IP',
    cidr: '网段',
    host: '主机名',
    instance: '数据源'
  },

  operate: {
    add: '添加管控SQL例外',

    deleting: '正在删除管控SQL例外语句...',
    deleteSuccess: '删除管控SQL例外语句成功',
    confirmDelete: '确认删除这条管控SQL例外么？'
  },

  modal: {
    add: {
      title: '添加管控SQL例外',
      success: '添加管控SQL例外成功'
    },
    update: {
      title: '更新管控SQL例外',
      success: '更新管控SQL例外成功',
      tips: '当修改匹配类型或匹配内容后，该条记录的匹配次数和最后匹配时间将被重置。'
    },
    sql: 'SQL语句'
  }
};
