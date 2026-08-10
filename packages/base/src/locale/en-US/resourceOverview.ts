// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Resource Overview',
  baseInfo: {
    businessCount: 'Total Businesses',
    projectCount: 'Total Projects',
    sourceCount: 'Total Data Sources'
  },
  expandAll: 'Expand All',
  collapseAll: 'Collapse All',
  resourceTopology: 'Resource Topology',
  resourceDetail: 'Resource Details',
  selectProjectFirst: 'Please select a project first',
  unboundProject: 'Not linked to a project',
  resourceList: {
    resourceName: 'Resource Name',
    type: 'Resource Type',
    business: 'Business',
    project: 'Project',
    environment: 'Environment',
    auditScore: 'Audit Quality Score',
    auditScoreTips: 'Score range: 0-100',
    highPrioritySqlCount: 'High-Priority SQL Count',
    pendingWorkflowCount: 'Pending Workflows',
    viewDetail: 'View Details'
  },
  distributionChart: {
    title: 'Resource Type Distribution',
    emptyText: 'No data. Add data sources and return to this page to view.',
    sourceTotal: 'Total Data Sources',
    sourceNumItem: 'Data Source Count',
    sourceProportionItem: 'Data Source Percentage'
  },
  export: 'Export',
  exportTips: 'Exporting resource details'
};
