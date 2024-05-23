// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: '工单列表',
    pageDesc: '工单列表中只会展示与您相关的工单。',

    allWorkflowAboutMe: '所有与我相关的工单',
    workflowStatus: {
      review: '待审核',
      exec: '待上线'
    },
    batchClose: {
      buttonText: '批量关闭',
      closePopTitle: '您确认关闭所选工单吗？',
      messageWarn:
        '您所选的工单包含不可关闭的工单!（只有工单状态为“{{process}}”和“{{reject}}”的工单可以关闭。）'
    },

    exportWorkflow: {
      buttonText: '导出工单',
      exporting: '正在导出历史工单',
      exportSuccessTips: '历史工单导出成功'
    },

    createButtonText: '创建工单',

    name: '工单名称',
    dataSource: '数据源',
    schema: '数据库',
    schemaPlaceholder: '请选择数据库（选填）',
    createUser: '创建人',
    assignee: '待操作人',
    createTime: '创建时间',
    executeTime: '上线时间',
    desc: '工单描述',
    status: '工单状态',
    time: '定时时间',
    stepType: '当前步骤类型',
    sqlTaskStatus: 'Sql审核状态',
    instanceName: '数据源',
    passRate: '审核通过率',
    taskScore: '审核结果评分',
    id: '工单号'
  },
  create: {
    backToList: '返回工单列表',
    title: '创建工单',
    mustAuditTips: '您必须先对您的SQL进行审核才能进行创建工单',
    mustHaveAuditResultTips: '不能对审核结果为空的SQL进行创建工单',

    form: {
      baseInfo: {
        title: '工单基本信息',

        name: '工单名称',
        workflowNameRule: '只能包含字母、数字、中文、中划线和下划线',
        describe: '工单描述',
        describePlaceholder: '点此添加工单描述（选填）'
      },

      sqlInfo: {
        title: '审核SQL语句信息',

        isSameSqlForAll: '选择相同SQL',
        tipsDataSourceTypeForSameSql: '当数据源类型相同时，才能使用相同SQL模式',
        sameSql: '相同Sql',
        differenceSql: '不同Sql',

        instanceName: '数据源',

        instanceNameTips: '后续添加的数据源流程模板与当前数据源相同',
        instanceSchema: '数据库',
        schemaPlaceholder: '请选择数据库（选填）',

        sql: 'SQL语句',
        sqlFile: 'SQL文件',
        sqlFileTips: '点击选择SQL文件或将文件拖拽到此区域',
        mybatisFile: 'Mybatis的XML文件',
        mybatisFileTips: '点击选择XML文件或将文件拖拽到此区域',
        zipFile: 'zip文件',
        zipFileTips: '点击选择zip文件或将文件拖拽到此区域',

        addInstanceTips: '请添加数据源',
        addInstance: '添加数据源',
        uploadType: '选择SQL语句上传方式',
        manualInput: '输入SQL语句',
        uploadFile: '上传SQL文件',
        updateMybatisFile: '上传Mybatis的XML文件',
        uploadZipFile: '上传ZIP文件',

        audit: '审核',
        analyze: 'SQL分析',
        format: 'SQL美化',
        formatTips:
          '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。',

        selectExecuteMode: '选择上线模式',
        selectExecuteModeTips:
          '当选择文件模式上线时，审核结果将以文件为单位进行聚合展示',
        executeSqlMode: 'SQL模式',
        executeFileMode: '文件模式'
      }
    },

    auditResult: {
      clearDuplicate: '数据去重',
      allLevel: '全部等级',
      submit: '提交工单',
      updateInfo: '编辑工单信息',
      disabledOperatorWorkflowBtnTips:
        '项目 {{currentProject}} 创建工单时最高只能允许有 {{allowAuditLevel}} 等级的审核错误，但是当前审核结果中最高包含 {{currentAuditLevel}} 等级的审核结果。',
      mustHaveAuditResultTips: '不能对审核结果为空的SQL进行创建工单',
      leaveTip: '是否离开本页面？当前工单暂未提交！'
    },
    createResult: {
      success: '工单创建成功',
      guide: '查看刚刚创建的工单',
      cloneWorkflow: '克隆工单',
      viewWorkflowDetail: '查看工单详情'
    }
  },

  detail: {},

  audit: {
    result: '审核结果',
    passRage: '审核通过率',
    source: '审核结果评分',
    duplicate: '是否去重',
    downloadSql: '下载SQL语句',
    downloadReport: '下载审核报告',
    table: {
      number: '序号',
      auditLevel: '规则等级',
      auditStatus: '审核状态',
      auditResult: '审核结果',
      execSql: '执行语句',
      execStatus: '执行状态',
      execResult: '执行结果',
      rollback: '回滚语句',
      rollbackTips: '仅提示，不支持执行回滚',
      describe: '说明',
      analyze: '分析',
      addDescribe: '添加说明'
    },

    filterForm: {
      highestAuditLevel: '最高审核告警等级'
    },

    sqlFileSource: {
      tips: '当前仅支持查看SQL/ZIP文件中的SQL来源',
      source: '所在文件',
      fileLine: '所在行'
    },

    auditStatus: {
      initialized: '准备审核',
      doing: '正在审核',
      finished: '审核完毕'
    },
    copyExecSql: '复制执行语句',
    auditSuccess: '审核通过',

    fileModeExecute: {
      headerTitle: '文件信息概览',
      sqlsTips: '当前仅展示前5条数据，<0>查看更多<0>'
    },

    fileModeSqls: {
      backToDetail: '返回工单详情',
      title: '文件信息详情',

      statistics: {
        audit: '审核结果信息',
        execute: '执行结果信息'
      }
    }
  },

  common: {
    workflowStatus: {
      process: '处理中',
      finished: '上线成功',
      canceled: '已关闭',
      executing: '正在上线',
      execFailed: '上线失败',
      waitForAudit: '待审核',
      waitForExecution: '待上线',
      reject: '已驳回',
      execScheduled: '定时上线',
      execSucceeded: '上线成功',
      manuallyExecuted: '人工上线',
      terminateFailed: '中止失败',
      terminateSucceeded: '中止成功',
      terminating: '正在中止'
    },
    execStatus: {
      initialized: '准备执行',
      doing: '正在执行',
      succeeded: '执行成功',
      failed: '执行失败',
      manually_executed: '人工执行',
      terminate_fail: '中止失败',
      terminate_succ: '中止成功',
      terminating: '正在中止',
      allStatus: '全部状态'
    }
  }
};
