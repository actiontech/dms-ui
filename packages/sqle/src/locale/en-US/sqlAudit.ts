// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: 'SQL audit',
    action: {
      create: 'Create audit',
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
  detail: {
    download: 'Download audit result',
    auditID: 'Audit ID',
    auditRating: 'Audit rating',
    auditPassRate: 'Audit pass rate'
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
