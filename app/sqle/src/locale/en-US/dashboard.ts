// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Workbench',
  pageDesc: 'You can filter projects and view the corresponding workbench data',
  tableLimitTips: 'The current table only displays the top {{number}} data',
  allProjectTip: 'All projects',
  projectName: 'Project name',
  title: {
    pendingOrder: 'Pending workflow',
    myOrderSituation: 'My workflow situation',
    auditPlanRisk: 'Pending scan tasks'
  },
  pendingOrder: {
    needMeReview: 'Need audit',
    needMeExec: 'Need execute'
  },
  myOrderSituation: {
    pendingReviewByMe: 'Pending audit',
    pendingExecByMe: 'Pending execute',
    rejectedOrderByMe: 'Rejected'
  },
  auditPlanRisk: {
    tableColumn: {
      name: 'Scan task report',
      source: 'DB instance',
      time: 'Time',
      count: 'Risk SQL'
    }
  }
};
