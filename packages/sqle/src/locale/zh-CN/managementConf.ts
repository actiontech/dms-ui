// eslint-disable-next-line import/no-anonymous-default-export
export default {
  common: {
    backToConf: '返回智能扫描配置'
  },
  list: {
    pageTitle: 'SQL管控配置',
    pageAction: {
      enableAuditPlan: '为数据源开启扫描任务',
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
        staticScanType: '静态扫描',
        dbName: '数据源名称',
        dbType: '数据源类型',
        environmentAttribute: '环境属性',
        enabledScanTypes: '启用的扫描类型',
        dbTaskStatus: '数据源任务状态',
        taskStatus: {
          disabled: '停用',
          normal: '启用'
        },
        scanStatus: '采集状态',
        notificationMethod: '推送方式',
        createdAt: '创建时间',
        creator: '创建人',
        abnormalTips: 'SQL采集存在异常'
      },
      action: {
        disabled: {
          text: '停用',
          confirmTips: '禁用后所有数据将不再更新，是否确认停用？',
          successTips: '停用成功'
        },
        enabled: {
          text: '启用',
          successTips: '启用成功'
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
    environmentAttribute: '环境属性',
    instanceName: '数据源名称',
    instanceNameTips: '请选择所属业务来获取对应的数据源',
    schema: '数据库',
    schemaTips: '如果选择了数据库，只会采集该数据库对应的SQL',
    scanTypesSelection: '选择扫描类型',
    scanType: '扫描类型',
    scanTypeRequiredMessage: '请选择一项扫描任务',
    scanTypeTips: '选择您需要扫描的SQL对象',
    emptyScanTypeTips: '选择数据源类型后获取对应的扫描任务类型',

    scanTypeParams: {
      title: '编辑扫描详情·{{typeName}}',
      hightPriorityConditions: {
        mark: '标记高优先级SQL',
        standard: '标准',
        threshold: '阈值',
        operator: '运算符'
      },
      auditTemplate: {
        ruleTemplate: {
          label: '审核规则模板',
          tip: '如果未指定此项会优先使用数据源绑定的模板'
        }
      }
    },

    defaultScanTypes: {
      sqlFile: 'SQL文件',
      myBatisFile: 'MyBatis文件',
      allAppExtract: '应用程序SQL抓取',
      default: '自定义'
    },

    result: {
      title: '创建SQL管控配置成功',
      reset: '重置表单',
      jumpToDetail: '查看配置详情'
    }
  },
  update: {
    successTips: '更新智能扫描配置成功！'
  },
  detail: {
    title: '{{instanceName}} 智能扫描详情',
    staticScanTypes: '静态扫描',
    export: '导出',
    auditImmediately: '立即审核',
    auditImmediatelySuccessTips: '审核成功',
    exportTips: '正在导出扫描任务详情',
    overview: {
      title: '概览',
      column: {
        auditPlanType: '智能扫描类型',
        auditRuleTemplate: '审核规则模板',
        status: '任务状态',
        scanType: '采集方式',
        connectionInfo: '连接信息',
        collectedSqlCount: '采集到的SQL数',
        problematicSqlCount: '审核有问题的SQL数',
        lastCollectionTime: '最近一次采集时间',
        taskStatus: {
          disabled: '停用',
          normal: '运行中',
          abnormal: '运行异常'
        },
        abnormalTips:
          '请根据"execute extract sql failed"关键字到sqled.log日志中检索相关信息'
      },
      actions: {
        enabled: '启用',
        enabledSuccessTips: '启用成功！',
        disabled: '停用',
        disabledSuccessTips: '停用成功！',
        disabledConfirmTips:
          '停用后，将不再扫描该类型的SQL，当前数据会被保留，是否确认停用？',
        delete: '删除',
        deleteSuccessTips: '删除成功！',
        deleteConfirmTips:
          '删除后该类型智能扫描数据将不再被保留，是否确认删除？'
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
        sqlAuditResultReportTitle: 'SQL审核结果',
        action: {
          analysis: '分析'
        }
      }
    }
  }
};
