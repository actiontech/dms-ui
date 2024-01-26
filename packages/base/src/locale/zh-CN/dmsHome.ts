// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '用户引导',
  defaultScene: {
    header: {
      adminUser: '管理用户',
      normalUser: '普通用户'
    },
    steps: {
      databaseTarget: {
        title: '数据源管理',
        innerContents: {
          title_0: '数据源管理',
          content_0: '管理数据源相关操作',
          action_0_0: '查看列表',
          action_0_1: '添加数据源',
          title_1: '外部数据源',
          content_1: '管理外部数据源相关操作',
          action_1_0: '查看列表',
          action_1_1: '新建同步任务'
        }
      },
      memberAndPermission: {
        title: '成员与权限管理',
        innerContents: {
          title_0: '成员与权限管理',
          content_0: '为项目添加成员/成员组，并配置相应的数据源操作权限',
          action_0_0: '查看成员'
        }
      },
      safetyRule: {
        title: '数据安全规则管理',
        innerContents: {
          title_0: '审核管理',
          content_0:
            '查看平台支持的审核规则，并自定义审核规则模板，监察已生成的SQL，或使用SQL审核改善SQL质量',
          action_0_0: '查看审核规则',
          action_0_1: '查看规则模板',
          action_0_2: ' 查看智能扫描',
          action_0_3: '新建SQL审核',
          title_1: '数据源授权管理',
          content_1: '配置数据权限模版，将数据权限模版授权给指定用户',
          action_1_0: '权限模板',
          action_1_1: '授权清单',
          title_2: '审批流程',
          content_2: '根据实际业务流转变更流程模板',
          action_2_0: '配置审批流程模板'
        }
      },
      queryAndModify: {
        title: '数据查询与变更',
        innerContents: {
          title_0: 'SQL窗口',
          content_0: '使用在线的数据编辑器（CloudBeaver）进行SQL查询和编辑',
          action_0_0: '进入SQL工作台',
          title_1: '数据变更',
          content_1: '在线提起SQL变更申请，经由审批流程完成上线',
          action_1_0: '发起SQL工单',
          action_1_1: ' 发起提权工单',
          title_2: '数据导出',
          content_2: '发起数据导出工单，审核通过后获取数据集。',
          action_2_0: '发起导出工单'
        }
      },
      devopsAndAudit: {
        title: '运维与审计',
        innerContents: {
          title_0: '巡检与诊断',
          content_0: '您可以对数据源进行定期或手动巡检，智能诊断异常问题',
          title_1: '操作审计',
          content_1: '审计平台内用户操作',
          action_1_0: '授权审计',
          action_1_1: '权限模板审计',
          action_1_2: '数据源操作审计',
          action_1_3: 'SQLE操作记录'
        }
      }
    }
  }
};
