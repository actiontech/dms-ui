// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据导出',
  ceTips:
    '当您没有某个数据源的查看权限，但需要导出其中的数据时，可以利用数据导出功能。通过进行审批流程，您可以获取相应的数据。这样，即使没有直接的查看权限，您仍然可以获得所需的数据。',
  status: {
    wait_for_audit: '待审核',
    wait_for_masking_approve: '待脱敏审批',
    partial_failed: '部分导出失败',
    wait_for_export: '待导出',
    finished: '导出成功',
    exporting: '正在导出',
    export_failed: '导出失败',
    expired: '已过期',
    rejected: '已驳回',
    canceled: '已关闭',
    file_deleted: '已移除'
  },
  failStage: {
    task_schedule: '任务调度',
    connect: '数据源连接',
    prepare: '导出准备',
    sql_execute: 'SQL 执行',
    file_generate: '文件生成',
    unknown: '未知'
  },
  execStatus: {
    success: '成功',
    failed: '失败',
    not_executed: '未执行',
    notExecutedHint: '导出任务已失败，本条 SQL 未执行'
  },
  batchCancel: {
    messageWarn:
      '您所选的工单包含不可关闭的工单!（只有工单状态为“{{waitAudit}}”和“{{reject}}”的工单可以关闭。）'
  },
  create: {
    backToList: '返回工单列表',
    button: '创建导出',
    form: {
      base: {
        title: '创建导出工单',
        name: '数据导出工单名称',
        describe: '工单描述',
        describePlaceholder: '点击添加数据导出描述',
        workflowTemplate: '审批流程模板',
        workflowTemplateTips: '多套审批模板时请选择本次导出工单使用的审批流程',
        addOpsType: '添加运维类型',
        addOpsTypeSuccess: '运维类型添加成功',
        updateOpsTypeSuccess: '运维类型更新成功',
        deleteOpsTypeSuccess: '运维类型删除成功',
        deleteOpsTypeConfirm: '确认删除该运维类型吗？',
        deleteOpsTypeReferenced: '该运维类型已被工单引用，暂无法删除',
        emptyOpsTypeMemberTip: '请联系项目管理员配置运维类型'
      },
      source: {
        title: '选择导出对象',
        titleTips: '数据导出仅支持MySQL/Oracle/PG/SQL Server',
        business: '业务类型',
        dbService: '数据源',
        schema: '数据库'
      },
      method: {
        title: '选择导出方式',
        manualInput: '输入SQL语句'
      },
      action: {
        audit: '审核',
        format: 'SQL美化',
        formatTips:
          '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。'
      }
    },
    submit: {
      buttonText: '提交工单',
      onlySupportDDLSqls: '仅支持对DQL语句创建导出工单',
      hasExceptionRule: '当前存在审核规则未被校验，请排除问题后重新触发审核',
      continueSubmission: '仍要创建',
      plaintextWarning: '已命中脱敏字段，可按 SQL 粒度选择“导出原文数据”。',
      plaintextReasonPlaceholder: '请说明需要导出原文数据的业务原因',
      plaintextReasonRequired: '请选择需导出原文的 SQL 并填写申请理由',
      plaintextApplyCreateFailed:
        '导出工单已创建，但原文申请创建失败，请稍后在审批中心确认状态',
      plaintextApplyCreateFailedWithDetail:
        '导出工单已创建，但原文申请创建失败（失败数据源 {{count}} 个）',
      plaintextApplyCompensateGuide:
        '可先进入已创建工单查看审批状态，并在审批中心补齐或重新发起原文申请。',
      plaintextApplyCompensateAction: '查看已创建工单'
    },
    approvalProcess: {
      title: '审批流程',
      hint: '审批流程可在 项目配置 > 审批流程 中修改',
      stepLabel: '步骤 {{number}}',
      matchByPermission: '按权限匹配',
      loadFailed: '加载审批流程失败',
      stepType: {
        export_review: '导出审批',
        export_execute: '导出执行确认'
      }
    },
    update: {
      baseTitle: '工单基本信息',
      sourceTitle: '工单导出对象',
      methodTitle: '导出方式',
      updateInfoAction: '修改工单'
    },
    result: {
      success: '工单创建成功',
      guide: '查看刚刚创建的工单',
      alertTitle: '审批通过后，请留意两件事：',
      exportTimeLimitTitle: '1. 导出操作时限：',
      exportTimeLimitDesc: '系统将为您保留此次导出任务24小时。',
      fileDownloadLimitTitle: '2. 文件下载时限：',
      fileDownloadLimitDesc: '导出文件生成后，文件本身也仅保留 24小时。',
      reminder:
        '为确保您能顺利获取文件，请及时查看审批结果，并立即完成导出和文件下载操作。'
    }
  },
  batchClose: {
    button: '批量关闭',
    tips: '您确认关闭所选导出工单吗？'
  },
  list: {
    column: {
      id: '工单号',
      name: '工单名称',
      dbService: '数据源',
      desc: '描述',
      exportMethod: '导出方式',
      createUser: '创建人',
      createTime: '创建时间',
      exportTime: '导出时间',
      status: '状态',
      assignee: '待操作人',
      workflowTemplate: '审批模板',
      opsType: '运维类型',
      plaintextExport: '原文导出',
      viewOrderDetail: '查看工单详情'
    },
    actions: {
      closed: '关闭',
      closeTips: '确认要关闭任务"{{name}}"么？'
    }
  },
  detail: {
    reject: {
      reason: '{{name}}驳回了当前工单，审批意见为：',
      tips: '当工单被驳回时，工单创建者需要对其进行修改，然后重新提交审核。（目前暂不支持修改工单。）'
    },
    exportResult: {
      title: '导出结果',
      overview: {
        title: '概览',
        plaintextNotice: {
          pending: {
            message: '原文导出申请审批中',
            description:
              '当前工单已提交原文导出申请，审批通过后方可下载原文数据。',
            link: '前往审批页面'
          },
          approved: {
            message: '原文导出申请已通过',
            description:
              '请在 {{deadline}} 前完成原文数据下载，剩余时间：{{remain}}。'
          },
          downloaded: {
            message: '原文数据已下载',
            description:
              '当前下载凭证将于 {{deadline}} 失效（剩余 {{remain}}），窗口期内可重复下载。'
          },
          rejected: {
            message: '原文导出申请已被驳回',
            description: '请前往审批页面查看驳回详情，了解原因后重新提交申请。',
            link: '查看审批详情'
          },
          postDownloadExpired: {
            message: '原文数据已成功下载',
            description:
              '30 分钟重复下载窗口已关闭，如需再次下载请重新提交原文导出申请。'
          },
          expired: {
            message: '原文数据下载申请已失效',
            description:
              '原文下载时限已过期，如需获取原文数据请重新提交原文导出申请。'
          }
        },
        partialFailedNotice:
          '当前工单存在“部分导出失败”：已成功任务可继续下载，失败任务请修复后重试。',
        column: {
          dbService: '数据源',
          status: '状态',
          failStage: '失败阶段：',
          failReason: '失败原因：',
          assigneeUser: '待操作人',
          exportStartTime: '导出开始时间',
          exportEndTime: '导出结束时间',
          exportType: '导出方式',
          exportFileType: '导出文件类型',
          action: {
            download: '下载数据',
            downloadOriginal: '下载原文数据',
            downloadTips:
              '请在24小时内下载数据集，如超期，则需要重新提交工单。',
            downloadOriginalFailed: '下载原文数据失败，请稍后重试'
          }
        }
      },
      taskDetail: {
        copy: '复制SQL语句',
        exportContent: '导出内容',
        exportFileType: '导出格式',
        auditResult: '审核结果',
        exportResult: '导出结果',
        downloadSQL: '下载SQL语句'
      }
    },
    record: {
      title: '工单信息',
      basicInfo: {
        title: '基本信息',
        createUser: '创建人',
        createTime: '创建时间',
        status: '状态',
        exportFailSummaryLabel: '失败原因：',
        exportFailSummaryFallback:
          '导出失败，暂未获取到具体原因，请联系管理员查看服务日志',
        exportMode: '导出类型',
        exportModePlaintext: '原文导出',
        exportModeMasked: '脱敏导出'
      },
      steps: {
        title: '工单进度',
        create: '创建工单',
        update: '更新工单',
        approve: '审核工单',
        execute: '执行导出'
      },
      history: {
        title: '工单操作记录'
      }
    },
    action: {
      workflowDetail: '工单详情',
      close: {
        text: '关闭工单',
        successTips: '工单关闭成功！'
      },
      approve: {
        text: '审核通过',
        successTips: '工单审核通过！'
      },
      reject: {
        modal: {
          title: '驳回',
          text: '驳回'
        },
        reason: '审批意见',
        text: '审核驳回',
        tips: '当前操作将驳回工单下所有导出任务，请谨慎操作！',
        successTips: '工单驳回成功！'
      },
      execute: {
        text: '执行导出',
        successTips: '执行导出操作已提交',
        confirmTips:
          '当前操作将立即执行导出工单下的所有任务，是否确认立即执行导出?'
      }
    },
    operator: {
      unknown: '未知步骤',
      waitAudit: '等待审核人操作',
      alreadyRejected: '工单已被驳回',
      alreadyClosed: '工单已被关闭',
      approvalComment: '审批意见',
      notFilled: '未填写',
      confirmApprove: '确认通过'
    }
  },
  common: {
    auditResult: {
      column: {
        number: '序号',
        execSql: '执行语句',
        sqlType: '语句类型',
        auditResult: '审核结果',
        createWhitelist: '添加为审核SQL例外',
        exportPlaintext: '导出原文',
        exportPlaintextAction: '导出原文数据（需审批）',
        snapshotInfo: '血缘/脱敏快照',
        maskingSnapshotCount: '脱敏字段 {{count}} 个',
        lineageSnapshotCount: '血缘来源 {{count}} 条',
        snapshotDetail: '查看详情',
        maskingFields: '脱敏字段与规则',
        lineagePathPreview: '血缘路径预览'
      }
    }
  }
};
