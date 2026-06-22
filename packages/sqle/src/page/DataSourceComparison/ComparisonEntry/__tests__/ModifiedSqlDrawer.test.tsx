import { DatabaseObjectObjectTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import ModifiedSqlDrawer from '../component/ModifiedSqlDrawer';
import { fireEvent, screen } from '@testing-library/dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { compressToEncodedURIComponent } from 'lz-string';
import { IDatabaseDiffModifySQL } from '@actiontech/shared/lib/api/sqle/service/common';
import i18n from 'i18next';
import enUSDataSourceComparison from '../../../../locale/en-US/dataSourceComparison';
import zhCNDataSourceComparison from '../../../../locale/zh-CN/dataSourceComparison';

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
    return sqleSuperRender(
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

  // ---------------------------------------------------------------------------
  // UI-3 (compat-RISK-6): WARNING banner + per-line highlight coverage.
  //
  // map-case fixtures: every scenario stuffs `databaseDiffModifiedSqlInfos`
  // with a hand-crafted `modify_sqls` list so the production code's WARNING
  // detection (`anySqlHasWarning` + `sqlHasWarningLine`) walks the same input
  // path it would in real life. We never assert against translated strings to
  // avoid coupling to the locale wording — the data-testid contract is the
  // stable surface for both banner and highlight.
  // ---------------------------------------------------------------------------
  const buildDiffInfos = (
    sqls: string[],
    schemaName = 'dms'
  ): IDatabaseDiffModifySQL[] => [
    {
      schema_name: schemaName,
      modify_sqls: sqls.map((sql) => ({ sql_statement: sql }))
    }
  ];

  const renderWithSqls = (sqls: string[]) =>
    sqleSuperRender(
      <ModifiedSqlDrawer
        open={true}
        onClose={onCloseSpy}
        instanceType="MySQL"
        generateModifySqlPending={false}
        databaseDiffModifiedSqlInfos={buildDiffInfos(sqls)}
        comparisonInstanceInfo={{
          instanceId: 'instanceId',
          instanceName: comparisonInstanceName,
          instanceType: 'MySQL'
        }}
        genDatabaseDiffModifiedSQLsParams={apiParams}
        dbExistingSchemas={dbExistingSchemas}
      />
    );

  it('should render the drop-create warning banner when a SQL statement contains -- WARNING comment', () => {
    renderWithSqls([
      `-- WARNING: data loss risk; table will be dropped and recreated.\nDROP TABLE IF EXISTS audit_files;\nCREATE TABLE audit_files (id BIGINT);`
    ]);

    expect(
      screen.getByTestId('modified-sql-drop-create-warning-banner')
    ).toBeInTheDocument();
  });

  it('should add a warning-highlight-line class to every -- WARNING line inside the SQL preview', () => {
    renderWithSqls([
      `-- WARNING: data loss risk; table will be dropped and recreated.\nDROP TABLE IF EXISTS audit_files;\nCREATE TABLE audit_files (id BIGINT);`
    ]);

    const highlightContainer = screen.getByTestId('warning-highlighted-sql');
    expect(highlightContainer).toBeInTheDocument();
    const warningLineNodes = highlightContainer.querySelectorAll(
      '.warning-highlight-line'
    );
    expect(warningLineNodes.length).toBe(1);
    expect(warningLineNodes[0].textContent).toMatch(/-- WARNING:/);
  });

  it('should not render the banner nor the warning highlight container when no SQL contains a -- WARNING comment', () => {
    renderWithSqls([
      `ALTER TABLE audit_files ADD COLUMN status VARCHAR(32);`,
      `ALTER TABLE audit_files ADD COLUMN created_at DATETIME;`
    ]);

    expect(
      screen.queryByTestId('modified-sql-drop-create-warning-banner')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('warning-highlighted-sql')
    ).not.toBeInTheDocument();
    // Sanity: SQL lines still render but never carry the highlight class.
    expect(document.querySelectorAll('.warning-highlight-line').length).toBe(0);
  });

  it('should render the drop-create warning banner only once even when multiple modify SQLs carry -- WARNING comments', () => {
    renderWithSqls([
      `-- WARNING: view will be recreated; downstream queries may be affected.\nDROP VIEW IF EXISTS v_audit_summary;\nCREATE VIEW v_audit_summary AS SELECT id FROM audit_files;`,
      `-- WARNING: data loss risk; table will be dropped and recreated.\nDROP TABLE IF EXISTS audit_files;\nCREATE TABLE audit_files (id BIGINT, status VARCHAR(32));`
    ]);

    expect(
      screen.queryAllByTestId('modified-sql-drop-create-warning-banner').length
    ).toBe(1);
    // Both SQL fragments must keep their own highlight container — banner
    // dedup happens at the drawer level, not by collapsing per-fragment
    // visual cues.
    expect(screen.queryAllByTestId('warning-highlighted-sql').length).toBe(2);
    expect(document.querySelectorAll('.warning-highlight-line').length).toBe(2);
  });

  // Case 4 — i18n switching: banner copy MUST follow the active language.
  // jest-setup only seeds zh-CN; we add the en-US bundle on the fly so the
  // test can flip to English and assert the literal differs from Chinese.
  describe('locale switching for the WARNING banner copy', () => {
    beforeAll(() => {
      i18n.addResourceBundle(
        'en-US',
        'translation',
        { dataSourceComparison: enUSDataSourceComparison },
        true,
        true
      );
    });

    afterEach(() => {
      // restore default zh-CN so the rest of the test file keeps using the
      // language jest-setup expects
      i18n.changeLanguage('zh-CN');
    });

    it('should render the WARNING banner copy according to the active language (zh-CN vs en-US)', async () => {
      const sqls = [
        `-- WARNING: data loss risk; table will be dropped and recreated.\nDROP TABLE IF EXISTS audit_files;\nCREATE TABLE audit_files (id BIGINT);`
      ];

      // ----- zh-CN -----
      await i18n.changeLanguage('zh-CN');
      const zhView = renderWithSqls(sqls);
      const zhBanner = zhView.getByTestId(
        'modified-sql-drop-create-warning-banner'
      );
      const zhCopy =
        zhCNDataSourceComparison.entry.modifiedSqlDrawer
          .dropCreateWarningBanner;
      expect(zhBanner).toHaveTextContent(zhCopy);
      zhView.unmount();

      // ----- en-US -----
      await i18n.changeLanguage('en-US');
      const enView = renderWithSqls(sqls);
      const enBanner = enView.getByTestId(
        'modified-sql-drop-create-warning-banner'
      );
      const enCopy =
        enUSDataSourceComparison.entry.modifiedSqlDrawer
          .dropCreateWarningBanner;
      expect(enBanner).toHaveTextContent(enCopy);

      // sanity — the two locales must actually produce different copy or the
      // test would always pass on either branch.
      expect(zhCopy).not.toEqual(enCopy);
    });
  });
});
