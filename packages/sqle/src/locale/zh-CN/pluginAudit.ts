// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'IDE审核',
  ceTips:
    '当您需要在开发过程中自主检验SQL质量时，可以配置SQLE提供的IDE审核插件。此外，当您需要复盘在IDE中审核的SQL时，可以使用SQLE提供的记录功能，查看使用情况及相关统计信息。',
  promptTitle: '暂未生成审核记录',
  promptDesc:
    '通过查看IDE审核记录，支持复盘在IDE中审核的SQL，并获取相关统计信息',
  promptStep: '使用IDE审核，获得审核结果\n平台实时生成使用记录',
  userBook: '用户手册',
  table: {
    sql: 'SQL',
    sqlFingerprint: 'SQL指纹',
    source: '数据源',
    schema: 'Schema',
    result: '审核结果',
    count: '出现次数',
    firstAppearTime: '最早出现时间',
    lastReceiveTime: '最近一次出现时间',
    creator: '创建人',
    createWhitelist: '添加为审核SQL例外'
  },
  drawerTitle: 'IDE审核结果'
};
