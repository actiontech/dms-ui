import { DatabaseObjectObjectTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../testUtils/customRender';
import ModifiedSqlDrawer from '../component/ModifiedSqlDrawer';
import { fireEvent, screen } from '@testing-library/dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { compressToEncodedURIComponent } from 'lz-string';

describe('ModifiedSqlDrawer', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const onCloseSpy = jest.fn();
  const apiParams = {
    project_name: 'default',
    base_instance_id: '1861344168081625088',
    comparison_instance_id: '1861344168081625088',
    database_schema_objects: [
      {
        base_schema_name: 'dms',
        comparison_schema_name: 'sqle',
        database_objects: [
          {
            object_name: 'audit_files',
            object_type: DatabaseObjectObjectTypeEnum.TABLE
          },
          {
            object_name: 'audit_plan_report_sqls_v2',
            object_type: DatabaseObjectObjectTypeEnum.TABLE
          }
        ]
      }
    ]
  };
  const dbExistingSchemas = ['schema'];
  const comparisonInstanceName = 'test-instance-name';
  const customRender = (open = true, generateModifySqlPending = false) => {
    return superRender(
      <ModifiedSqlDrawer
        open={open}
        onClose={onCloseSpy}
        instanceType="MySQL"
        generateModifySqlPending={generateModifySqlPending}
        comparisonInstanceInfo={{
          instanceId: 'instanceId',
          instanceName: comparisonInstanceName,
          instanceType: 'MySQL'
        }}
        genDatabaseDiffModifiedSQLsParams={apiParams}
        dbExistingSchemas={dbExistingSchemas}
      />
    );
  };

  it('should not render the drawer when open is false', () => {
    customRender(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the drawer with the correct title when open is true', () => {
    customRender(true);

    expect(screen.getByText('变更SQL语句信息')).toBeInTheDocument();
  });

  it('should call onClose and reset auditResultCollapseActiveKeys when the close button is clicked', () => {
    customRender(true);

    fireEvent.click(getBySelector('.closed-icon-custom'));
    expect(onCloseSpy).toHaveBeenCalled();
  });

  it('should display a loading spinner when generateModifySqlPending is true', () => {
    const { container } = customRender(true, true);

    expect(container).toMatchSnapshot();
  });

  it('should render the extra content provided by CreateWorkflowForModifiedSqlAction', () => {
    customRender(true);
    expect(screen.getByText('生成变更工单')).toBeInTheDocument();
    expect(screen.getByText('生成变更工单').closest('a')).toHaveAttribute(
      'href',
      `/sqle/project/${
        mockProjectInfo.projectID
      }/exec-workflow/create?gen_modified_sql_params=${compressToEncodedURIComponent(
        JSON.stringify({
          ...apiParams,
          comparisonInstanceName,
          dbExistingSchemas
        })
      )}`
    );
  });

  it('should not render the extra content when checkActionPermission is return false', () => {
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(false)
      },
      { useSpyOnMockHooks: true }
    );

    customRender(true);
    expect(screen.queryByText('生成变更工单')).not.toBeInTheDocument();
  });
});
