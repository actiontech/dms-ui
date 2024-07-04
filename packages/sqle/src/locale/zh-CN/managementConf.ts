// eslint-disable-next-line import/no-anonymous-default-export
export default {
  common: {
    backToConf: '返回智能扫描配置'
  },
  list: {
    pageTitle: 'SQL管控配置',
    pageAction: {
      enableAuditPlan: '为数据源开启智能扫描',
      planType: '任务类型'
    },
    table: {
      filter: {
        taskType: {
          allDataSource: '全部数据源',
          allTaskType: '全部任务类型'
        },
        status: {
          disabled: '停用',
          normal: '正常'
        }
      },
      column: {
        dbName: '数据源名称',
        dbType: '数据源类型',
        business: '所属业务',
        enabledScanTypes: '启用的扫描类型',
        dbTaskStatus: '数据源任务状态',
        scanStatus: '采集状态',
        notificationMethod: '推送方式',
        createdAt: '创建时间',
        creator: '创建人'
      },
      action: {
        inactive: {
          text: '停用',
          confirmTips: '禁用后所有数据将不再更新，是否确认停用？',
          successTips: '停用成功'
        },
        delete: {
          confirmTips: '删除后所有数据将不再保留，是否确认删除？',
          successTips: '删除成功'
        }
      }
    }
  },
  create: {
    title: '为数据源开启扫描任务',
    dataSourceSelection: '选择数据源',
    dataSourceNeedsAudit: '是否需要连接数据源审核',
    businessScope: '所属业务',
    dbName: '数据源名称',
    schema: '数据库',
    schemaTips: '如果选择了数据库，只会采集该数据库对应的SQL',
    scanTypesSelection: '选择扫描类型',
    scanType: '扫描类型',
    scanTypeTips: '选择您需要扫描的SQL对象',

    result: {
      title: '创建智能扫描成功',
      clone: '克隆扫描任务',
      reset: '重置表单',
      jumpToDetail: '查看扫描任务详情'
    }
  },
  detail: {
    title: '{{dbName}} 智能扫描详情',

    overview: {
      title: '概览',
      column: {
        auditPlanType: '智能扫描类型',
        auditRuleTemplate: '审核规则模板',
        scanType: '采集方式',
        connectionInfo: '连接信息',
        collectedSqlCount: '采集到的SQL数',
        problematicSqlCount: '审核有问题的SQL数',
        lastCollectionTime: '最近一次采集时间'
      },
      actions: {
        enabled: '启用',
        disabled: '停用'
      }
    },
    scanTypeSqlCollection: {
      filter: {
        searchInputPlaceholder: '输入SQL、规则名称'
      },
      action: {
        urgentAudit: '立即审核',
        lastAuditTime: '最近一次审核时间：{{time}}'
      },

      column: {
        index: '序号',
        sqlFingerprint: 'SQL指纹',
        source: '来源',
        belongingDataSource: '所属数据源',
        execTime: '执行时间',
        lastAppearanceTime: '最近一次出现时间',
        firstAppearanceTime: '最早一次出现时间',
        occurrenceCount: '出现次数',
        status: '状态',
        explanation: {
          text: '说明',
          operator: '添加说明'
        },
        action: {
          analysis: '分析'
        }
      }
    }
  }
};
