// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL分析',
  pageDesc: '你可以在这里查看执行的SQL语句的解析',

  sqlExplain: 'SQL解析',
  tableTitle: '{{tableName}}表',
  optimize: 'SQL优化',
  optimization: {
    confirmTitle: '是否启用高精度索引推荐？',
    confirmContent:
      '高精度索引推荐将统计SQL中列的区分度，提供更准确的索引优化建议，但可能会产生较大的数据库性能开销。',
    enableHighAnalysis: '是，启用高精度推荐',
    useRegularAnalysis: '否，使用常规推荐'
  },
  optimizationResultDrawer: {
    title: 'SQL调优结果详情',
    trackProgressTips: '也可进入 快捷诊断-SQL调优 页面追踪进度',
    resultTips: '优化进行中，预计5-10分钟后完成。感谢您的耐心等待。'
  }
};
