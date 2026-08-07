// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Schema Comparison',
  ceTips:
    'Use schema comparison to quickly identify differences between two environments.',
  entry: {
    baselineEnvironment: 'Baseline environment',
    baselineEnvironmentDescription:
      'Select the data source environment you consider the "standard".\nThis environment will serve as the baseline for comparison.',
    comparisonEnvironment: 'Comparison environment',
    comparisonEnvironmentDescription:
      'Select the database environment you want to inspect or update.\nThis environment will be compared against the baseline to identify differences.',
    selectorValidatorSchemaMessage:
      'The baseline environment is selected at the schema level. Please also select a schema in the comparison data source.',
    selectorValidatorDataSourceMessage:
      'The baseline environment is selected at the data source level. Please also select a data source in the comparison data source.',
    executeComparison: 'Run comparison',
    showDifferencesOnly: 'Show differences only',
    modifyMappings: 'Edit mappings',
    generateSQL: 'Generate change SQL',
    generateSQLErrorTips:
      'The selected nodes include objects with matching comparison results. Please modify your selection and try again.',
    generateSQLDisabledTips: 'Please select data objects first',
    noDifferencesFound: 'No differences found in the current comparison result',
    structureDifference: 'Schema differences',
    newObject: 'Added',
    missingObject: 'Missing',
    selector: {
      title: 'Comparison selection'
    },
    overview: {
      title: 'Result overview'
    },
    details: {
      title: 'Result details'
    },
    comparisonDetail: {
      title: 'View comparison details',
      generateSQL: 'Generate change SQL',
      generateSQLDisabledTips:
        'No deviations found in the current comparison result',
      ddlDiff: 'DDL differences',
      modifySqlInfo: '{{schema}} change SQL details',
      auditFailed: 'Audit failed',
      auditResult: 'Audit result',
      exception: 'Audit exception',
      exceptionTips:
        'Please search sqled.log for related information based on the error message',
      baselineDDLAuditResultTitle: 'Baseline environment DDL audit result',
      comparisonDDLAuditResultTitle: 'Comparison environment DDL audit result',
      modifiedSqlAuditResultTitle: 'Change SQL audit result',
      actions: {
        createChangeWorkflow: 'Create change workflow',
        copyChangeSQL: 'Copy change SQL',
        downloadChangeSQL: 'Download change SQL'
      }
    },
    modifiedSqlDrawer: {
      title: 'Change SQL information'
    },
    modifiedSqlAuditResult: {
      cardTitle: 'Change statements'
    }
  },
  overview: {
    missingObjects: 'Missing objects',
    newObjects: 'Added objects',
    differentDefinitions: 'Definition differences',
    sameObjects: 'Matching objects',
    needsAction: 'Requires immediate action',
    suggestCheck: 'Review recommended',
    noActionNeeded: 'No action required',
    startTime: 'Start time',
    endTime: 'End time'
  }
};
