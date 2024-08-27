// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'User guide',
  defaultScene: {
    header: {
      adminUser: 'Admin user',
      normalUser: 'Normal user'
    },
    steps: {
      databaseTarget: {
        title: 'DB instances',
        innerContents: {
          title_0: 'DB instances',
          content_0: 'Manage DB instance related operations',
          action_0_0: 'View list',
          action_0_1: 'Add DB instance',
          title_1: 'External DB instance',
          content_1: 'Manage external DB instance related operations',
          action_1_0: 'View list',
          action_1_1: 'Create sync task'
        }
      },
      memberAndPermission: {
        title: 'Members',
        innerContents: {
          title_0: 'Members',
          content_0:
            'Add members/member groups to the project and configure corresponding DB instance operation permissions',
          action_0_0: 'View members'
        }
      },
      safetyRule: {
        title: 'Data security rule management',
        innerContents: {
          title_0: 'Audit management',
          content_0:
            'View the audit rules supported by the platform, customize audit rule templates, monitor generated SQL, or use SQL audit to improve SQL quality',
          action_0_0: 'View audit rules',
          action_0_1: 'View rule templates',
          action_0_2: 'View SQL management configuration',
          action_0_3: 'Create new SQL audit',
          title_1: 'DB instance authorization management',
          content_1:
            'Configure data permission templates and authorize them to specified users',
          action_1_0: 'Permission templates',
          action_1_1: 'Authorization list',
          title_2: 'Approval process',
          content_2:
            'Change the process template according to the actual business flow',
          action_2_0: 'Configure approval process template',
          action_2_1: 'View approval process template'
        }
      },
      queryAndModify: {
        title: 'Data query and modification',
        innerContents: {
          title_0: 'SQL window',
          content_0:
            'Use the online data editor (CloudBeaver) to query and edit SQL',
          action_0_0: 'Enter SQL workbench',
          title_1: 'Data modification',
          content_1:
            'Submit SQL modification requests online, complete the online process through the approval process',
          action_1_0: 'Submit SQL ticket',
          action_1_1: 'Submit authorization ticket',
          title_2: 'Data export',
          content_2:
            'Submit data export tickets, and get the data set after approval.',
          action_2_0: 'Submit export ticket'
        }
      },
      devopsAndAudit: {
        title: 'Operation and log',
        innerContents: {
          title_0: 'Patrol and diagnosis',
          content_0:
            'You can perform periodic or manual patrols on the DB instance, and intelligently diagnose abnormal problems',
          title_1: 'Operation log',
          content_1: 'Audit user operations within the platform',
          action_1_0: 'Authorization audit',
          action_1_1: 'Permission template audit',
          action_1_2: 'DB instance operation audit',
          action_1_3: 'SQLE operation records'
        }
      }
    }
  }
};
