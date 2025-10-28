// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Dashboard',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  pendingWorkOrder: 'Pending Work Order',
  onlineWorkOrder: 'Online Work Order',
  exportWorkOrder: 'Export Work Order',
  pendingSql: {
    title: 'Pending SQL',
    column: {
      desc: 'Description',
      source: 'Source',
      status: 'Status',
      firstAppearTime: 'First Appear Time',
      instance: 'Instance',
      project: 'Project',
      projectPriority: 'Project Priority',
      detail: 'Detail'
    },
    ceTips:
      'The pending SQL panel will integrate the SQL identified as problems in SQL control. If you need to centrally track the progress of problem SQL resolution, you can access it globally in the pending SQL panel.'
  },
  initiatedWorkOrder: 'Initiated Work Order',
  filter: {
    project: 'Project',
    instance: 'Instance',
    projectPriority: 'Project Priority'
  },
  workflow: {
    status: 'Workflow Status',
    name: 'Workflow Name',
    desc: 'Workflow Description',
    createTime: 'Create Time'
  }
};
