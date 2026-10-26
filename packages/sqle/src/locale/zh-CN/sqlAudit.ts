// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: '快捷审核',
    action: {
      create: '创建审核',
      aggregate: '审核汇总',
      updateTags: {
        successTips: '更新业务标签成功',
        addTag: {
          text: '新增业务标签',
          notTags: '暂无标签数据',
          placeholder: '请输入新增的业务标签'
        }
      }
    },
    filter: {
      instanceName: '数据源',
      auditTime: '审核时间',
      inputTagPlaceholder: '请输入业务标签搜索'
    },
    status: {
      auditStatus: {
        auditing: '审核中',
        successfully: '审核成功'
      }
    },
    columns: {
      auditID: '审核ID',
      auditStatus: '审核状态',
      businessTag: '业务标签',
      auditRating: '审核评分',
      auditPassRate: '审核通过率（%）',
      createUser: '创建人',
      auditTime: '审核时间',
      instanceName: '数据源'
    }
  },
  common: {
    goBackList: '返回SQL审核列表'
  },
  aggregate: {
    pageTitle: '快捷审核汇总',
    pageSubtitle:
      '结果按当前账号在快捷审核列表中的可见范围过滤，不包含评分与通过率',
    scopeMode: {
      filters: '按筛选条件',
      records: '指定审核记录'
    },
    filter: {
      scopeMode: '汇总方式',
      auditTime: '审核时间',
      instance: '数据源',
      tags: '快捷审核标签',
      allInstances: '全部数据源',
      allTags: '全部标签',
      selectedTagsCount: '已选 {{count}} 个标签',
      dateTo: '至',
      tagsMatchAny: '多选时，匹配任意一个标签即可',
      records: '审核记录',
      recordsPlaceholder: '搜索并选择审核记录（记录 ID 或标签）',
      recordsHint:
        '可选 1–50 条当前账号可见且已审核完成的记录；支持按记录 ID 或标签搜索',
      pickerTriggerEmpty: '选择审核记录',
      pickerTriggerSelected: '已选择 {{count}} 条审核记录',
      pickerOpen: '选择',
      pickerTitle: '选择审核记录',
      pickerHint: '仅展示当前账号有权查看且已完成审核的记录，最多选择 50 条',
      pickerSearchPlaceholder: '搜索审核记录 ID 或标签',
      pickerSelectVisible: '选择当前结果',
      pickerClear: '清空',
      pickerConfirm: '确认选择',
      pickerSelectedCount: '已选择 {{count}} / {{max}} 条',
      pickerEmptyTitle: '未找到审核记录',
      pickerEmptyTip: '调整搜索关键字后重试。',
      pickerOffline: '离线审核',
      pickerSqlCount: '{{value}} 条 SQL'
    },
    action: {
      query: '查询',
      export: '导出报表',
      back: '返回快捷审核'
    },
    export: {
      title: '导出报表',
      confirm: '确认下载',
      reportTime: '报告时间',
      customFieldsTitle: '文件名自定义字段',
      customFieldsHint:
        '可不填。最多 {{max}} 组；仅字段值会按顺序写入文件名；空值项将被忽略。',
      customFieldsEmpty: '暂无自定义字段，可点击「添加字段」手动新增',
      addField: '添加字段',
      removeField: '删除',
      moveUp: '上移',
      moveDown: '下移',
      fieldNamePlaceholder: '字段名（最多 16 字）',
      fieldValuePlaceholder: '字段值（加入文件名，最多 32 字）',
      filenamePreview: '文件名预览',
      downloading: '正在导出报表…',
      downloadSuccess: '报表已开始下载',
      downloadFailed: '导出失败，请缩小范围或检查权限后重试'
    },
    validate: {
      auditTimeRequired: '请选择审核时间后再查询',
      spanExceeded: '审核时间跨度不能超过 31 天，请缩小查询范围',
      recordsRequired: '请选择至少 1 条审核记录后再查询',
      recordsOverLimit: '最多选择 50 条审核记录'
    },
    reportScope: {
      title: '汇总报告范围',
      permissionHint: '数据已按当前账号权限过滤',
      project: '项目',
      mode: '汇总方式',
      auditTime: '审核时间',
      instance: '数据源',
      tags: '快捷审核标签',
      instanceAndTags: '数据源 / 标签',
      recordCount: '审核记录',
      recordCountValue: '{{count}} 条',
      visibility: '可见范围',
      visibilityTip: '当前用户可见任务'
    },
    overview: {
      title: '总览',
      taskCount: '审核任务',
      taskUnit: '次',
      sqlCount: 'SQL',
      sqlUnit: '条',
      ruleHitCount: '规则触发',
      ruleHitNote: '次（已排除豁免结果）',
      placeholder: '--'
    },
    levelHint: '按未豁免规则问题统计',
    content: {
      sqlTab: 'SQL 明细',
      rulesTab: '规则汇总'
    },
    result: {
      notQueried: '查询条件已准备',
      notQueriedTip: '已带入可用条件，确认后点击「查询」生成审核汇总。',
      stale: '查询条件已变化',
      staleTip: '当前结果已失效，请点击「查询」重新生成审核汇总。',
      summaryTitle: '汇总报告',
      loadFailed: '汇总报告加载失败，请稍后重试',
      sqlsLoadFailed: 'SQL 明细加载失败，请稍后重试',
      recordsRejected: '所选审核记录无效或不存在，请重新选择后重试',
      emptyTitle: '未查询到审核数据',
      emptyTip: '调整时间范围或数据源后重新查询。'
    },
    sqls: {
      title: 'SQL 明细',
      columns: {
        createdAt: '审核时间',
        recordId: '审核记录 ID',
        taskId: '任务 ID',
        creator: '创建人',
        instanceName: '数据源名称',
        offlineInstance: '（离线审核，无数据源）',
        dbType: '数据库类型',
        schema: 'Schema',
        sqlSource: 'SQL 来源',
        sourceFile: '来源文件及起始行',
        execSql: 'SQL 原文',
        auditLevel: '审核等级',
        auditResult: '审核结果',
        ruleHitCount: '规则触发数'
      }
    }
  },
  detail: {
    download: '下载审核结果',
    auditID: '审核ID',
    auditRating: '审核评分',
    auditPassRate: '审核通过率',
    sourceHeader: {
      instanceName: '数据源',
      address: '地址',
      instanceDbType: '实例类型',
      instanceSchema: 'Schema',
      sqlSource: 'SQL 来源',
      sourceFiles: '来源文件',
      sqlSourceEnum: {
        form_data: '表单',
        sql_file: 'SQL 文件',
        mybatis_xml_file: 'MyBatis',
        zip_file: 'ZIP',
        git_repository: 'GIT'
      }
    },
    levelHitSummary: {
      title: '等级命中数',
      sqlCount: 'SQL 条数',
      loading: '加载中…',
      loadFailed: '等级命中数加载失败'
    },
    ruleHitDetails: {
      title: '规则汇总',
      empty: '暂无规则命中',
      loading: '加载中…',
      loadFailed: '规则汇总加载失败',
      columns: {
        rule: '规则名',
        level: '等级',
        hitCount: '触发次数',
        message: '说明',
        sqlNumbers: '涉及 SQL'
      }
    }
  },
  create: {
    title: '创建SQL审核',
    createTagErrorTips: '当前标签已存在',
    successTips: '创建审核成功',
    baseInfoForm: {
      tags: '业务标签',
      tagsPlaceholder: '要搜索的业务标签'
    },
    sqlInfo: {
      title: '审核SQL语句信息',
      audit: '审核',
      format: 'SQL美化',
      formatTips:
        '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。',
      form: {
        auditType: '审核方式',
        auditTypeDesc:
          '在线审核时，平台审核将根据所选数据源的实际库表结构给出建议；离线审核时，平台审核将不会连接数据源。',
        dbType: '数据库类型',
        instanceName: '数据源',
        instanceSchema: '数据库',
        staticAudit: '离线审核',
        dynamicAudit: '在线审核',
        uploadType: '选择SQL语句上传方式'
      },
      uploadTypeEnum: {
        sql: '输入SQL语句',
        sqlFile: '上传SQL文件',
        mybatisFile: '上传Mybatis的XML文件',
        zipFile: '上传ZIP文件',
        git: '配置GIT仓库'
      },
      uploadLabelEnum: {
        sql: 'SQL语句',
        sqlFile: 'SQL文件',
        mybatisFile: 'Mybatis的XML文件',
        zipFile: 'ZIP文件',
        gitUrl: 'GIT地址',
        gitUrlTips:
          '请输入git仓库的HTTP(S)克隆地址，若为私有GIT仓库，则必须输入有读权限的账号密码'
      },
      uploadFileTip: {
        sqlFile: '点击选择SQL文件或将文件拖拽到此区域',
        mybatisFile: '点击选择Mybatis的XML文件或将文件拖拽到此区域',
        zipFile:
          '点击选择ZIP文件或将文件拖拽到此区域，当前仅支持对ZIP文件中的.xml文件及.sql文件做SQL审核'
      }
    }
  },
  result: {
    deleteRuleTip: '该规则已删除'
  }
};
