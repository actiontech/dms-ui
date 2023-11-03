// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: 'SQL审核',
    action: {
      create: '创建审核',
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
  detail: {
    download: '下载审核结果',
    auditID: '审核ID',
    auditRating: '审核评分',
    auditPassRate: '审核通过率'
  },
  create: {
    title: '创建SQL审核',
    createTagErrorTips: '当前标签已存在',
    form: {
      tags: '业务标签',
      tagsPlaceholder: '要搜索的业务标签'
    }
  }
};
