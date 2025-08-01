// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '性能洞察',
  ceTips: '当你需要监控数据源性能表现、定位问题根因时，可以使用性能监控功能。',
  dataSourceSelect: '数据源',
  autoRefreshTimeGap: '自动刷新时间间隔',
  dateRange: {
    twentyFourHours: '24小时',
    sevenDays: '7天',
    thirtyDays: '30天',
    custom: '自定义'
  },

  chart: {
    xAxisTitle: '日期',
    yAxisTitle: '数值',
    noData: '暂无数据',
    noValidData: '选区中没有任何有效数据'
  },

  taskEnabledTips: {
    currentControlTypeNotEnabled: '当前管控类型未开启',
    goToEnable: '[去开启]'
  },

  performanceTrend: {
    title: '数据源综合性能趋势'
  },
  slowSqlTrend: {
    title: '慢SQL趋势'
  },
  topSqlTrend: {
    title: 'TopSQL执行趋势'
  },
  activeSessionTrend: {
    title: '活跃会话数趋势'
  },
  relatedSqlList: {
    title: '选定区间关联的SQL',
    dateRangePlaceholder: '请选择日期范围',
    column: {
      sqlFingerprint: 'SQL指纹',
      source: '来源',
      executeStartAvg: '平均执行时间',
      maxExecuteTime: '最大执行时间',
      minExecuteTime: '最小执行时间',
      sumExecuteTime: '总执行时间',
      lockWaitTime: '锁等待时间'
    },
    source: {
      order: '工单',
      sqlManage: 'SQL管控',
      workbench: 'SQL工作台'
    },
    actions: {
      analyzeSql: 'SQL分析',
      viewRelatedTransactions: '查看关联事务'
    },
    sqlFingerprintDetail: {
      title: 'SQL指纹详情',
      chart: {
        xAxisTitle: '日期',
        yAxisTitle: '执行成本',
        analyzeButtonText: '点击节点到 SQL分析 查看当前sql的详细分析'
      }
    },
    sqlRelatedTransaction: {
      title: 'SQL关联事务',
      actions: {
        showSQAnalysis: '查看SQL分析'
      },
      noData: '暂无事务数据',
      originalSql: '原始SQL',
      transactionInfo: {
        id: '事务ID',
        lockType: '锁类型',
        duration: '事务总耗时',
        startTime: '开始时间',
        state: '状态',
        commitTime: '提交时间',
        lockTypeDict: {
          exclusive: '排他锁',
          shared: '共享锁',
          intentionShared: '意向共享锁',
          intentionExclusive: '意向排他锁',
          sharedIntentionExclusive: '共享意向排他锁',
          rowLock: '行锁',
          tableLock: '表锁',
          metadataLock: '元数据锁'
        }
      },
      timeline: '事务时间线',
      relatedSqlList: '关联SQL列表',
      sqlInfo: {
        executeDuration: '执行耗时',
        lockType: '锁类型',
        sqlAnalysis: 'SQL分析'
      },
      lockAnalysis: {
        title: '锁等待分析',
        desc: '{{table_name}}表: {{lock_type}} - 由{{create_lock_sql}}语句获取'
      }
    },
    noExecutionCostTrend: '没有执行成本趋势数据'
  }
};
