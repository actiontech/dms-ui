// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: 'SQL audit',
    action: {
      create: 'Create audit',
      aggregate: 'Audit summary',
      updateTags: {
        successTips: 'Update business tags successfully',
        addTag: {
          text: 'Add business tag',
          notTags: 'No tag data',
          placeholder: 'Please input the new business tag'
        }
      }
    },
    filter: {
      instanceName: 'DB instance',
      auditTime: 'Audit time',
      inputTagPlaceholder: 'Please input the business tag to search'
    },
    status: {
      auditStatus: {
        auditing: 'Auditing',
        successfully: 'Audit succeed'
      }
    },
    columns: {
      auditID: 'Audit ID',
      auditStatus: 'Audit status',
      businessTag: 'Business tag',
      auditRating: 'Score',
      auditPassRate: 'Audit pass rate (%)',
      createUser: 'Create user',
      auditTime: 'Audit time',
      instanceName: 'DB instance'
    }
  },
  common: {
    goBackList: 'Back to SQL audit list'
  },
  aggregate: {
    pageTitle: 'SQL audit summary',
    pageSubtitle:
      'Results are filtered by records visible to you on the quick audit list; score and pass rate are not included',
    scopeMode: {
      filters: 'By filters',
      records: 'By audit records'
    },
    filter: {
      scopeMode: 'Summary mode',
      auditTime: 'Audit time',
      instance: 'DB instance',
      tags: 'Business tags',
      allInstances: 'All instances',
      allTags: 'All tags',
      selectedTagsCount: '{{count}} tags selected',
      dateTo: 'to',
      tagsMatchAny: 'When multiple tags are selected, match any one',
      records: 'Audit records',
      recordsPlaceholder: 'Search and select audit records (record ID or tags)',
      recordsHint:
        'Select 1–50 audited records visible to you; search by record ID or tags',
      pickerTriggerEmpty: 'Select audit records',
      pickerTriggerSelected: '{{count}} audit record(s) selected',
      pickerOpen: 'Select',
      pickerTitle: 'Select audit records',
      pickerHint:
        'Only audited records you can access are listed. Select up to 50.',
      pickerSearchPlaceholder: 'Search by record ID or tags',
      pickerSelectVisible: 'Select current results',
      pickerClear: 'Clear',
      pickerConfirm: 'Confirm',
      pickerSelectedCount: 'Selected {{count}} / {{max}}',
      pickerEmptyTitle: 'No audit records found',
      pickerEmptyTip: 'Try a different search keyword.',
      pickerOffline: 'Offline audit',
      pickerSqlCount: '{{value}} SQL(s)'
    },
    action: {
      query: 'Query',
      export: 'Export report',
      back: 'Back to quick audit'
    },
    export: {
      title: 'Export report',
      confirm: 'Download',
      reportTime: 'Report time',
      customFieldsTitle: 'Custom filename fields',
      customFieldsHint:
        'Optional. Up to {{max}} pairs; only non-empty values are inserted into the filename in order.',
      customFieldsEmpty: 'No custom fields yet. Click Add field to create one.',
      addField: 'Add field',
      removeField: 'Remove',
      moveUp: 'Up',
      moveDown: 'Down',
      fieldNamePlaceholder: 'Field name (max 16)',
      fieldValuePlaceholder: 'Field value (in filename, max 32)',
      filenamePreview: 'Filename preview',
      downloading: 'Exporting report…',
      downloadSuccess: 'Download started',
      downloadFailed:
        'Export failed. Narrow the scope or check permissions, then retry'
    },
    validate: {
      auditTimeRequired: 'Select an audit time range before querying',
      spanExceeded:
        'Audit time span cannot exceed 31 days. Please narrow the range',
      recordsRequired: 'Select at least one audit record before querying',
      recordsOverLimit: 'You can select at most 50 audit records'
    },
    reportScope: {
      title: 'Summary report scope',
      permissionHint: 'Filtered by your current permissions',
      project: 'Project',
      mode: 'Summary mode',
      auditTime: 'Audit time',
      instance: 'DB instance',
      tags: 'Business tags',
      instanceAndTags: 'Instance / tags',
      recordCount: 'Audit records',
      recordCountValue: '{{count}}',
      visibility: 'Visibility',
      visibilityTip: 'Tasks visible to the current user'
    },
    overview: {
      title: 'Overview',
      taskCount: 'Audit tasks',
      taskUnit: '',
      sqlCount: 'SQL',
      sqlUnit: '',
      ruleHitCount: 'Rule hits',
      ruleHitNote: '(exempted results excluded)',
      placeholder: '--'
    },
    levelHint: 'Counted from non-exempted rule findings',
    content: {
      sqlTab: 'SQL details',
      rulesTab: 'Rule summary'
    },
    result: {
      notQueried: 'Ready to query',
      notQueriedTip:
        'Confirm the filters, then click Query to generate the summary.',
      stale: 'Filters changed',
      staleTip: 'Current results are stale. Click Query to refresh.',
      summaryTitle: 'Summary report',
      loadFailed: 'Failed to load the summary report. Please try again',
      sqlsLoadFailed: 'Failed to load SQL details. Please try again',
      recordsRejected:
        'The selected audit records are invalid or unavailable. Please reselect and try again',
      emptyTitle: 'No audit data found',
      emptyTip: 'Adjust the time range or instance and query again.'
    },
    sqls: {
      title: 'SQL details',
      columns: {
        createdAt: 'Audit time',
        recordId: 'Audit record ID',
        taskId: 'Task ID',
        creator: 'Creator',
        instanceName: 'Instance',
        offlineInstance: '(Offline audit, no instance)',
        dbType: 'DB type',
        schema: 'Schema',
        sqlSource: 'SQL source',
        sourceFile: 'Source file / line',
        execSql: 'SQL',
        auditLevel: 'Audit level',
        auditResult: 'Audit result',
        ruleHitCount: 'Rule hits'
      }
    }
  },

  detail: {
    download: 'Download audit result',
    auditID: 'Audit ID',
    auditRating: 'Audit rating',
    auditPassRate: 'Audit pass rate',
    sourceHeader: {
      instanceName: 'Data source',
      address: 'Address',
      instanceDbType: 'Instance type',
      instanceSchema: 'Schema',
      sqlSource: 'SQL source',
      sourceFiles: 'Source files',
      sqlSourceEnum: {
        form_data: 'Form',
        sql_file: 'SQL file',
        mybatis_xml_file: 'MyBatis',
        zip_file: 'ZIP',
        git_repository: 'GIT'
      }
    },
    levelHitSummary: {
      title: 'Level hit summary',
      sqlCount: 'SQL count',
      loading: 'Loading…',
      loadFailed: 'Failed to load level hit summary'
    },
    ruleHitDetails: {
      title: 'Rule summary',
      empty: 'No rule hits',
      loading: 'Loading…',
      loadFailed: 'Failed to load rule summary',
      columns: {
        rule: 'Rule name',
        level: 'Level',
        hitCount: 'Hit count',
        message: 'Description',
        sqlNumbers: 'Related SQL'
      }
    }
  },
  create: {
    title: 'Create SQL audit',
    createTagErrorTips: 'The current tag already exists',
    successTips: 'Create audit successfully',
    baseInfoForm: {
      tags: 'Business tag',
      tagsPlaceholder: 'Business tag to search'
    },
    sqlInfo: {
      title: 'Audit SQL statement information',
      audit: 'Audit',
      format: 'SQL beautify',
      formatTips:
        'Currently, the database types supported for SQL beautify are {{supportType}}. if no data source is selected or the selected data source type is not supported, SQL beautification may lead to syntax errors in SQL statements.',
      form: {
        auditType: 'Audit method',
        auditTypeDesc:
          'During online audit, platform audit will give suggestions based on the actual database schema of the selected data source; during offline audit, platform audit will not connect to the data source.',
        dbType: 'Database type',
        instanceName: 'DB instance',
        instanceSchema: 'Database',
        staticAudit: 'Offline audit',
        dynamicAudit: 'Online audit',
        uploadType: 'Select SQL statement upload method'
      },
      uploadTypeEnum: {
        sql: 'Input SQL statement',
        sqlFile: 'Upload SQL file',
        mybatisFile: 'Upload Mybatis XML file',
        zipFile: 'Upload ZIP file',
        git: 'Configure GIT repository'
      },
      uploadLabelEnum: {
        sql: 'SQL statement',
        sqlFile: 'SQL file',
        mybatisFile: 'Mybatis XML file',
        zipFile: 'ZIP file',
        gitUrl: 'GIT address',
        gitUrlTips:
          'Please enter the HTTP(S) clone address of the git repository. if it is a private GIT repository, you must enter the account and password with read permission'
      },
      uploadFileTip: {
        sqlFile: 'Click to select a SQL file or drag the file to this area',
        mybatisFile:
          'Click to select a Mybatis XML file or drag the file to this area',
        zipFile:
          'Click to select a ZIP file or drag the file to this area. currently, only .xml and .sql files in the ZIP file can be audited for SQL'
      }
    }
  },
  result: {
    deleteRuleTip: 'The rule has been deleted'
  }
};
