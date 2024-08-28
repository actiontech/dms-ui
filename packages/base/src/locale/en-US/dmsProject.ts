// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Project management',
  pageDesc:
    'Organize and manage DMS platform resources and functions from the project dimension, support various audit functions through the project entry, and isolate resources between different projects.',
  projectList: {
    title: 'Project list',
    deleteSuccessTips: 'Delete project "{{name}}" successfully',
    archiveProjectSuccessTips: 'Archive project "{{name}}" successfully',
    unarchiveProjectSuccessTips: 'Unarchive project "{{name}}" successfully',
    exportMessage: 'Exporting project',
    columns: {
      status: 'Project status',
      available: 'Available',
      unavailable: 'Unavailable',
      createTime: 'Create time',
      createUser: 'Creator',
      deleteProjectTips: 'Are you sure you want to delete project "{{name}}"?',
      archive: 'Archive',
      unarchive: 'Unarchive',
      archiveProjectTips:
        'Are you sure you want to archive project "{{name}}"?',
      unarchiveProjectTips:
        'Are you sure you want to unarchive project "{{name}}"?'
    }
  },
  projectForm: {
    name: 'Project name',
    desc: 'Project description',
    business: 'Available business',
    addBusiness: 'Add business',
    deleteTip:
      'The current business is already associated with resources and cannot be deleted',
    fixedBusiness: 'Fix selectable business tags',
    fixedBusinessExtra:
      'If enabled, the business tags available in the project will be fixed and can only be managed by the administrator',
    businessName: 'Business name'
  },
  createProject: {
    modalTitle: 'Create project',
    createSuccessTips: 'Create project {{name}} successfully'
  },
  updateProject: {
    modalTitle: 'Edit project',
    updateSuccessTips: 'Update project {{name}} successfully'
  },
  detail: {
    modalTitle: 'Select project',
    modalTips: 'No recently opened projects, please select a project!',
    projectSelectorDropdownSlot: 'Project list'
  },
  exportProject: {
    buttonText: 'Export'
  },
  importProject: {
    buttonText: 'Import',
    title: 'Import project and business',
    selectFile: 'Select import file',
    submitText: 'Import',
    fileRequireTips: 'No file selected',
    successTitle: 'Import project and business successfully',
    successTips: 'Go to the project list to view the imported project',
    importingFile: 'Importing file...',
    downloadTemplate: 'Download import template',
    table: {
      project: 'Project',
      desc: 'Description',
      business: 'Business'
    }
  },
  batchImportDataSource: {
    buttonText: 'Batch import data source',
    title: 'Batch import data source',
    successTitle: 'Batch import data source successfully',
    checkSuccess: 'Validation passed',
    testConnectLabel: 'Test data source connectivity',
    testConnect: 'Batch test data source connectivity',
    testConnectSuccess: 'Test connectivity success {{count}}',
    testConnectFail:
      'Test connectivity failed {{count}}, data source is {{name}}',
    requestAuditErrorMessage:
      'The current import information has validation failures, please modify it according to the hints in the downloaded file, and import again'
  },
  backToList: 'Back to project list',
  businessDescription: {
    title:
      'Our platform uses a hierarchical structure of project-business-data source to provide you with a clear and orderly data resource management method.',
    project:
      'Project: each project represents an independent product environment, serving as a unit for resource isolation to ensure data security and product independence. at the project level, you can aggregate and manage related business modules.',
    business:
      'Business: based on the project, business acts as a sub-project or a tag for a specific business domain, helping you further organize and refine data resources. the business layer enables you to centrally manage and operate data for specific needs.',
    dataSource:
      'Data source: data source is the actual operation object built on the basis of business. you can perform specific data operations at the data source level, such as querying, updating, and managing data.'
  }
};
