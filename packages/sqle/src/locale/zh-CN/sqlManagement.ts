// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL管控',
  pageHeader: {
    action: {
      export: '导出',
      exporting: '正在导出文件',
      exportSuccessTips: '导出文件成功'
    }
  },
  statistics: {
    SQLTotalNum: 'SQL总数',
    problemSQlNum: '问题SQL数',
    optimizedSQLNum: '已优化SQL数'
  },
  ceTips:
    'SQL管控为用户提供SQL全生命周期监控，面板将整合所有的业务SQL，用户可以在该面板中查看项目中采集并审核的所有SQL，暴露其中的问题SQL，同时支持用户解决问题SQL。',
  table: {
    action: {
      batch: {
        assignment: '批量指派',
        assignmentSuccessTips: '批量指派负责人成功',
        solve: '批量解决',
        solveTips: '是否确认将所选SQL设为已解决?',
        solveSuccessTips: '批量解决SQL成功',
        ignore: '批量忽略',
        ignoreTips: '是否确认将所选SQL设为已忽略?',
        ignoreSuccessTips: '批量忽略SQL成功'
      },
      single: {
        assignment: '指派负责人',
        assignmentSuccessTips: '指派负责人成功',
        updateStatus: {
          triggerText: '变更状态',
          label: '当前SQL状态',
          solve: '解决',
          ignore: '忽略',
          manualAudit: '人工审核',
          signalUpdateStatusSuccessTips: '更新SQL状态成功'
        }
      },
      analyze: '分析'
    },
    column: {
      SQLFingerprint: 'SQL指纹',
      source: '来源',
      instanceName: '数据源',
      priority: '优先级',
      highPriority: '高优先',
      lowPriority: '低优先',
      auditResult: '审核结果',
      firstOccurrence: '初次出现时间',
      lastOccurrence: '最后一次出现时间',
      occurrenceCount: '出现数量',
      personInCharge: '负责人',
      status: '状态',
      comment: '备注',
      endpoints: '端点信息'
    },
    filter: {
      time: '时间范围',
      status: {
        unhandled: '未处理',
        solved: '已解决',
        ignored: '已忽略',
        manual_audited: '已人工审核'
      },
      business: '业务',
      instanceName: '数据源',
      source: {
        label: '来源',
        auditPlan: '扫描任务',
        defaultAuditPlan: '扫描任务默认类型',
        apiAudit: 'SQL审核'
      },
      auditLevel: {
        label: '最低审核等级',
        normal: '普通',
        error: '错误',
        warn: '告警',
        notice: '提示'
      },
      assignee: '与我相关',
      viewHighPrioritySql: '查看高优先级SQL',
      rule: '审核规则'
    },
    statusReport: {
      title: 'SQL审核结果'
    }
  }
};
