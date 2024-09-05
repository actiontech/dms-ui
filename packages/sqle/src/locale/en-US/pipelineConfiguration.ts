// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'CI/CD pipeline configuration',
  createPipeline: 'Create pipeline',

  defaultPrompt: {
    promptTitle: 'No pipeline configured',
    promptDesc:
      'By configuring the pipeline, you can integrate the platform’s review and execution capabilities into the CI/CD process, achieving automated SQL quality supervision.',
    promptStep:
      'Create Pipeline\nGet Pipeline Integration Instructions\nConfigure and Execute in CI/CD\nReceive Execution Results and Review'
  },

  table: {
    name: 'Pipeline name',
    desc: 'Pipeline description',
    address: 'Associated pipeline URL',
    nodeCount: 'Number of nodes',
    confirmDelete: 'Confirm delete this pipeline?',
    deleting: 'Deleting pipeline...',
    deleteSuccess: 'Pipeline deleted successfully'
  },

  create: {
    backToPipelineList: 'Back to pipeline list',
    title: 'Create pipeline',
    successTips: 'Pipeline created successfully',
    successSubTips:
      'Now you can configure the CI/CD pipeline according to the integration instructions to obtain review/deployment results.',
    successButtonText: 'Get pipeline integration instructions'
  },
  update: {
    title: 'Update pipeline',
    successTips: 'Pipeline updated successfully'
  },
  form: {
    baseConfig: 'Basic information',
    name: 'Pipeline name',
    nameTip:
      'Please enter the pipeline name created in the CI/CD platform or another name that is easy to understand and associate.',
    desc: 'Pipeline Description',
    descTip: 'Please enter information related to the purpose and expectations of this pipeline.',
    address: 'Pipeline URL',
    addressTip:
      'Please provide the pipeline project URL created in the CI/CD platform, such as http(s)://ip:port/job/jobname/, to facilitate association. If you have not created a pipeline, you can add it later.',
    nodeConfig: 'Node Configuration',
    node: {
      emptyTips: 'No pipeline node added',
      name: 'Node name',
      duplicateName: 'Node name must be unique',
      type: 'Node type',
      auditObjectType: 'Audit object type',
      auditObjectTypeTips: 'Currently supports auditing SQL files and MyBatis files.',
      auditObjectTypeDictionary: {
        sql: 'SQL file',
        mybatis: 'MyBatis file'
      },
      auditObjectPath: 'Audit object path',
      auditObjectPathTips:
        'Please enter the path of the SQL objects to be audited, to help the platform generate SQL collection commands. These commands will be used for CI/CD platform configuration. You need to input the absolute path of the file, e.g., /opt/sqle/std.log, or the directory path where the file is located, e.g., /opt/sqle/.',
      auditMethod: 'Audit method',
      auditMethodTips:
        'Select online audit if you need to obtain audit results combined with data sources; select offline audit if you only need syntax audit of SQL itself.',
      auditMethodDictionary: {
        offline: 'Offline audit',
        online: 'Online audit'
      },
      instance: 'Data source',
      instanceTips: 'Please select a data source. The platform will provide audit results based on the data source.',
      template: 'Audit rule template',
      templateTips: 'Please select the audit rule template applied by the platform when auditing SQL.',
      typeDictionary: {
        audit: 'Audit',
        release: 'Deployment'
      },
      removeConfirmTips: 'Confirm delete this pipeline node?',
      addNode: 'Add node',
      modal: {
        createTitle: 'Create node',
        editTitle: 'Edit node'
      }
    }
  },

  modal: {
    title: 'Pipeline details',
    pipelineNode: 'Pipeline node',
    integrationInfo: 'Integration instructions',
    view: 'View',
    viewIntegrationInfo: 'View integration instructions'
  }
};