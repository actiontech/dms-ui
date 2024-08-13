// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '配置推送规则',
  pushRule: {
    title: '推送规则',
    workflowUpdateNotifier: {
      label: '工单变更推送',
      labelTips: '工单状态发生变更时，会自动推送给有操作权限的成员',
      pushFrequency: '推送频率',
      pushFrequencyTips:
        '根据Crontab格式进行定时推送，当前展示时间基于浏览器本地时间，准确时间根据服务器时间确定。',
      pushFrequencyValueFormatter: '下次推送时间为 {{time}}',
      pushFrequencyErrorTips: '当前Crontab表达式格式出现错误！',
      pushFrequencyEmptyTips: '当前Crontab表达式为空！',
      pusher: '推送人',
      lastPushTime: '最近一次推送时间',
      permissionMatch: '根据权限匹配有操作权限的成员',
      immediately: '根据工单状态变更即时触发',
      successTips: '更新成功！',
      enabledConfirmTitle: '当前操作将开启配置，是否继续？',
      closedConfirmTitle: '当前操作将关闭配置，是否继续？'
    },
    sqlManagementIssuePush: {
      label: 'SQL管控问题推送',
      labelTips: '当SQL管控中出现有问题的SQL时，会自动推送给指定的成员',
      pushFrequency: '推送频率',
      pusher: '推送人',
      lastPushTime: '最近一次推送时间',
      closedConfirmTitle:
        '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？',
      form: {
        pushFrequency: '推送频率',
        pushFrequencyValidator: '请输入一个正整数',
        pusher: '推送人',
        cronTips: '手动输入Crontab格式时间，或点击右侧按钮开启可视化选择'
      }
    },
    SqlManagementQualityReport: {}
  }
};
