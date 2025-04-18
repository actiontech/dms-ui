// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '报表统计',
  cardLine: {
    title: {
      orderTotal: '工单总数',
      todayIncreased: '今日新增',
      orderAverageAuditTime: '工单平均审核时间',
      auditPassRate: '审核通过率'
    },
    noteCont: {
      deadline: '截止 {{time}}',
      orderAverageAuditTime: {
        min: '最短',
        max: '最长'
      },
      auditPassRate: {
        passed: '已通过',
        notPass: '未通过'
      }
    }
  },
  orderQuantityTrend: {
    title: '工单趋势',
    emptyText: '暂无数据，选择其他时间段或创建工单后回到本页查看',
    timeLabel: '时间段：',
    toolTip: {
      label: '新增工单'
    }
  },
  workOrderState: {
    title: '按工单状态的工单构成',
    emptyText: '暂无数据，创建工单后回到本页查看',
    state: {
      waiting_for_audit: '待审核',
      waiting_for_execution: '待上线',
      executing: '正在上线',
      rejected: '已驳回',
      executing_failed: '上线失败',
      closed: '已关闭',
      execution_success: '上线成功'
    }
  },
  databaseTypeOrder: {
    title: '按数据库类型的工单构成',
    emptyText: '暂无数据，创建工单后回到本页查看',
    tooltip: {
      number: '工单数量',
      proportion: '工单占比'
    }
  },
  databaseSourceOrder: {
    title: '按数据库类型的数据源构成',
    emptyText: '暂无数据，添加数据源后回到本页查看',
    sourceTotal: '数据源总计',
    sourceNumItem: '数据源数量',
    sourceProportionItem: '数据源占比'
  },
  licenseStatistics: {
    title: 'License 使用情况',
    emptyText: '暂无数据，购买License后回到本页查看',
    used: '已使用',
    proportion: '占比',
    charts: {
      validity: '有效期',
      user: '用户数量',
      instanceNum: '实例数量'
    }
  },
  topList: {
    diffOrderReject: {
      title: '不同用户工单驳回率(Top10)',
      noData: '暂无数据，创建工单后回到本页查看',
      column: {
        creator: '用户名',
        workflow_total_num: '工单总数',
        rejected_percent: '驳回率'
      }
    },
    sqlOnLineSpendTime: {
      title: 'SQL上线平均耗时 (Top10)',
      noData: '暂无数据，创建工单后回到本页查看',
      column: {
        instance_name: '数据源名称',
        average_execution_seconds: '平均上线耗时',
        max_execution_seconds: '最长上线耗时',
        min_execution_seconds: '最短上线耗时'
      }
    }
  },
  tableTopList: {
    noData: '暂无数据',
    noMoreData: '暂无更多数据'
  },
  ce: {
    feature: {
      desc: '如果管理员需要全面了解平台业务的审核进度以及平台的使用情况，可以使用报表统计功能。该功能提供多维度的业务分析视角，协助管理员了解工单的审核效率和提交的SQL质量，从而更高效、灵活地开展SQL审核工作。'
    }
  }
};
