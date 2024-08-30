// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '流水线配置',
  createPipeline: '创建流水线',

  defaultPrompt: {
    promptTitle: '暂未生成流水线',
    promptDesc:
      '通过配置流水线，您可以将平台的审核、上线能力集成到上游CI/CD流程中，实现自动化的SQL质量监督',
    promptStep:
      '创建流水线\n获取流水线对接说明\n去上游CI/CD配置并执行\n获得执行结果并查看'
  },

  table: {
    name: '流水线名称',
    desc: '流水线描述',
    address: '关联流水线地址',
    nodeCount: '节点个数',
    confirmDelete: '确认删除该流水线吗？',
    deleting: '正在删除流水线...',
    deleteSuccess: '删除流水线配置成功'
  },

  create: {
    backToPipelineList: '返回流水线配置列表',
    title: '创建流水线配置',
    successTips: '流水线创建成功',
    successSubTips:
      '现在您可以根据对接说明，配置上游CI/CD流水线，以获取审核/上线结果。',
    successButtonText: '获取流水线对接说明'
  },
  update: {
    title: '更新流水线配置',
    successTips: '流水线更新成功'
  },
  form: {
    baseConfig: '基础配置',
    name: '流水线名称',
    nameTip:
      '请填写上游CI/CD平台创建的流水线名称，或其他方便理解、建立关联的名称。',
    desc: '流水线描述',
    descTip: '请输入对此条流水线的用途、预期等相关信息。',
    address: '流水线地址',
    addressTip:
      '请提供您在上游CI/CD平台创建的流水线项目地址，如http(s)://ip:port/job/jobname/，方便建立关联。如尚未创建流水线，可后续编辑流水线补充。',
    nodeConfig: '节点配置',
    node: {
      emptyTips: '您还没有为流水线添加节点',
      name: '节点名称',
      duplicateName: '节点名称不可重复',
      type: '节点类型',
      auditObjectType: '审核对象类型',
      auditObjectTypeTips: '当前支持审核SQL文件及MyBatis文件。',
      auditObjectTypeDictionary: {
        sql: 'SQL文件',
        mybatis: 'MyBatis文件'
      },
      auditObjectPath: '审核对象路径',
      auditObjectPathTips:
        '请填写要审核的SQL对象路径，帮助平台生成SQL采集指令，SQL采集指令将用于CI/CD平台配置。需要输入文件的绝对路径，如/opt/sqle/std.log，或文件所在的文件夹路径，如/opt/sqle/。',
      auditMethod: '审核方式',
      auditMethodTips:
        '当需要结合数据源获取审核结果时，请选择在线审核，并指定数据源；如仅需对SQL本身做语法审核，请选择离线审核。',
      auditMethodDictionary: {
        offline: '离线审核',
        online: '在线审核'
      },
      instance: '数据源',
      instanceTips: '请选择数据源，平台将结合数据源数据情况，给出审核结果。',
      template: '审核规则模板',
      templateTips: '请选择平台审核SQL时应用的审核规则模板。',
      typeDictionary: {
        audit: '审核',
        release: '上线'
      },
      removeConfirmTips: '确认删除该流水线节点吗？',
      addNode: '添加节点',
      modal: {
        createTitle: '创建节点',
        editTitle: '编辑节点'
      }
    }
  },

  modal: {
    title: '流水线详情',
    pipelineNode: '流水线节点',
    integrationInfo: '对接说明',
    view: '查看',
    viewIntegrationInfo: '查看对接说明'
  }
};
