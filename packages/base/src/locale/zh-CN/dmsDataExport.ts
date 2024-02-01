// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据导出',
  ceTips:
    '当您没有某个数据源的查看权限，但需要导出其中的数据时，可以利用数据导出功能。通过进行审批流程，您可以获取相应的数据。这样，即使没有直接的查看权限，您仍然可以获得所需的数据。',
  status: {
    wait_for_audit: '待审核',
    wait_for_export: '待导出',
    finished: '导出成功',
    exporting: '正在导出',
    export_failed: '导出失败',
    expired: '已过期',
    rejected: '已驳回',
    canceled: '已关闭',
    file_deleted: '已移除'
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
        describePlaceholder: '点击添加数据导出描述'
      },
      source: {
        title: '选择导出对象',
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
    update: {
      baseTitle: '工单基本信息',
      sourceTitle: '工单导出对象',
      methodTitle: '导出方式',
      updateInfoAction: '编辑工单信息',
      submitAction: '提交工单',
      submitTips: '仅支持对DQL语句创建导出工单'
    },
    result: {
      success: '工单创建成功',
      guide: '查看刚刚创建的工单'
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
      viewOrderDetail: '查看工单详情'
    },
    actions: {
      closed: '关闭',
      closeTips: '确认要关闭任务"{{name}}"么？'
    }
  },
  detail: {
    reject: {
      reason: '{{name}}驳回了当前工单，驳回原因为：',
      tips: '当工单被驳回时，工单创建者需要对其进行修改，然后重新提交审核。（目前暂不支持修改工单。）'
    },
    exportResult: {
      title: '导出结果',
      overview: {
        title: '概览',
        column: {
          dbService: '数据源',
          status: '状态',
          assigneeUser: '待操作人',
          exportStartTime: '导出开始时间',
          exportEndTime: '导出结束时间',
          exportType: '导出方式',
          exportFileType: '导出文件类型',
          action: {
            download: '下载数据',
            downloadTips: '请在24小时内下载数据集，如超期，则需要重新提交工单。'
          }
        }
      },
      taskDetail: {
        copy: '复制SQL语句',
        exportContent: '导出内容',
        exportFileType: '导出格式',
        auditResult: '审核结果',
        exportResult: '导出结果'
      }
    },
    record: {
      title: '工单信息',
      basicInfo: {
        title: '基本信息',
        createUser: '创建人',
        createTime: '创建时间',
        status: '状态'
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
        reason: '驳回原因',
        text: '审核驳回',
        tips: '当前操作将驳回工单下所有导出任务，请谨慎操作！',
        successTips: '工单驳回成功！'
      },
      execute: {
        text: '执行导出',
        successTips: '工单执行导出成功！',
        confirmTips:
          '当前操作将立即执行导出工单下的所有任务，是否确认立即执行导出?'
      }
    }
  },
  common: {
    auditResult: {
      column: {
        number: '序号',
        execSql: '执行语句',
        sqlType: '语句类型',
        auditResult: '审核结果'
      }
    }
  }
};
