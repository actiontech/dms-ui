// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '外部数据源',
  columns: {
    name: '来源',
    version: '版本',
    address: '地址',
    last_sync: '最近一次同步结果',
    normalStatus: '正常'
  },
  matchMode: {
    reg: '正则匹配',
    exact: '全文匹配'
  }
};
