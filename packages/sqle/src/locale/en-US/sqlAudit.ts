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
    successTips: '创建审核成功',
    baseInfoForm: {
      tags: '业务标签',
      tagsPlaceholder: '要搜索的业务标签'
    },
    sqlInfo: {
      title: '审核SQL语句信息',
      form: {
        auditType: '审核方式',
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
        gitUrlTips: '若为私有GIT仓库，则必须输入有读权限的账号密码'
      },
      uploadFileTip: {
        sqlFile: '点击选择SQL文件或将文件拖拽到此区域',
        mybatisFile: '点击选择Mybatis的XML文件或将文件拖拽到此区域',
        zipFile: '点击选择ZIP文件或将文件拖拽到此区域'
      }
    }
  },
  result: {
    deleteRuleTip: '该规则已删除'
  }
};
