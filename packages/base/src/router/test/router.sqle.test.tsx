import { MemoryRouterProps } from 'react-router-dom';
import { act, screen, cleanup } from '@testing-library/react';
import mockUseRoutes, { RenderRouterComponent } from './data';
import { superRender } from '../../testUtils/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('base/router-sqle-ee', () => {
  const projectID = mockProjectInfo.projectID;

  const customRender = (
    initialEntries: MemoryRouterProps['initialEntries'] = []
  ) => {
    return superRender(<RenderRouterComponent type="sqle" />, undefined, {
      routerProps: {
        initialEntries
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('render sqle route data snap', () => {
    expect(mockUseRoutes('sqle')).toMatchSnapshot();
  });

  it('render route sqle index page', () => {
    const { baseElement } = customRender([`/sqle-test-router`]);

    expect(baseElement).toMatchSnapshot();
  });

  describe('render sqle global router', () => {
    describe('render sqle router when version is ce', () => {
      it('render route reportStatistics', () => {
        const { baseElement } = customRender(['/sqle/report-statistics']);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('reportStatistics')).toBeInTheDocument();
      });

      it('render route rule', () => {
        const { baseElement } = customRender(['/sqle/rule']);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('rule')).toBeInTheDocument();
      });

      it('render route ruleManager', async () => {
        const { baseElement } = customRender(['/sqle/rule-manager']);
        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('ruleTemplateManagement')).toBeInTheDocument();
      });

      it('render route global-create', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/global-create'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateCreate')
        ).toBeInTheDocument();
      });

      it('render route global-import', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/global-import'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateImport')
        ).toBeInTheDocument();
      });

      it('render route global-update', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/global-update/templateName'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateUpdate')
        ).toBeInTheDocument();
      });

      it('render route global-detail', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/global-detail/templateName/dbType'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateDetail')
        ).toBeInTheDocument();
      });

      it('render route custom-create', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/custom-create'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('createCustomRule')).toBeInTheDocument();
      });

      it('render route custom-update', () => {
        const { baseElement } = customRender([
          '/sqle/rule-manager/custom-update/ruleID'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('updateCustomRule')).toBeInTheDocument();
      });
    });

    describe('render sqle router when version is ee', () => {
      it('render route ruleKnowledge', () => {
        const { baseElement } = customRender([
          '/sqle/rule/knowledge/ruleName/dbType'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('ruleKnowledge')).toBeInTheDocument();
      });
    });
  });

  describe('render sqle project detail router', () => {
    describe('render sqle project detail router when version is ce', () => {
      it('render route projectOverview', async () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/overview`
        ]);

        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('projectOverview')).toBeInTheDocument();
      });

      describe('render route workflow', () => {
        it('render route list', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/exec-workflow`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlExecWorkflowList')).toBeInTheDocument();
        });

        it('render route createSqlExecWorkflow', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/exec-workflow/create`
          ]);

          await act(async () => jest.advanceTimersByTime(0));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('createSqlExecWorkflow')).toBeInTheDocument();
        });

        it('render route workflowDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/exec-workflow/workflowId`
          ]);

          await act(async () => jest.advanceTimersByTime(0));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('workflowDetail')).toBeInTheDocument();
        });

        it('render SQLFileStatementOverview', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/exec-workflow/123/files/434/sqls`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('workflowSqlFileStatementOverview')
          ).toBeInTheDocument();
        });
      });

      describe('render route sqlAudit', () => {
        it('render route sqlAuditList', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-audit`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlAuditList')).toBeInTheDocument();
        });

        it('render route sqlAuditCreate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-audit/create`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlAuditCreate')).toBeInTheDocument();
        });

        it('render route sqlAuditDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-audit/detail/sql_audit_record_id`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlAuditDetail')).toBeInTheDocument();
        });
      });

      it('render route pluginAuditList', async () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/plugin-audit`
        ]);

        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('pluginAuditList')).toBeInTheDocument();
      });

      describe('render route sqlOptimization', () => {
        it('render route sqlOptimization', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-optimization`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlOptimizationList')).toBeInTheDocument();
        });

        it('render route sqlOptimizationCreate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-optimization/create`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlOptimizationCreate')).toBeInTheDocument();
        });

        it('render route sqlOptimizationOverview', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-optimization/overview/testId`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('sqlOptimizationOverview')
          ).toBeInTheDocument();
        });

        it('render route sqlOptimizationDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-optimization/detail/MySQL/testId/1`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlOptimizationDetail')).toBeInTheDocument();
        });
      });

      it('render route dashboard', async () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/dashboard`
        ]);

        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('dashboard')).toBeInTheDocument();
      });

      describe('render route sqlManagementConf', () => {
        it('render route list', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management-conf`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });

        it('render route create', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management-conf/create`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('CreateSqlManagementConf')
          ).toBeInTheDocument();
        });

        it('render route update', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management-conf/update/1`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('UpdateSqlManagementConf')
          ).toBeInTheDocument();
        });

        it('render route auditPlanDetail', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management-conf/1`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('SqlManagementConfDetail')
          ).toBeInTheDocument();
        });

        it('render route SqlManagementConfAnalyze', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management-conf/1/analyze/:id`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(
            screen.getByText('SqlManagementConfAnalyze')
          ).toBeInTheDocument();
        });
      });

      describe('render route ruleTemplate', () => {
        it('render route ruleTemplate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });

        it('render route ruleTemplate list', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template/list`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('ruleTemplate')).toBeInTheDocument();
        });

        it('render route ruleTemplate create', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template/create`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('ruleTemplateCreate')).toBeInTheDocument();
        });

        it('render route ruleTemplate import', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template/import`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('ruleTemplateImport')).toBeInTheDocument();
        });

        it('render route ruleTemplateDetail', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template/detail/templateName/dbType`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('ruleTemplateDetail')).toBeInTheDocument();
        });

        it('render route ruleTemplateUpdate', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/rule/template/update/templateName`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('ruleTemplateUpdate')).toBeInTheDocument();
        });
      });

      describe('render route progress', () => {
        it('render progressDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/progress`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });

        it('render progressUpdate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/progress/update/workflowName`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('progressUpdate')).toBeInTheDocument();
        });
      });

      it('render whitelist', () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/whitelist`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('Whitelist')).toBeInTheDocument();
      });

      it('render operationRecord', () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/operation-record`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('operationRecord')).toBeInTheDocument();
      });

      describe('render route sqlManagement', () => {
        it('render sqlManagement', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sql-management`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });
      });
    });

    describe('render sqle project detail router when version is ee', () => {
      it('render route workflowAnalyze', () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/exec-workflow/taskId/sqlNum/analyze`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('workflowAnalyze')).toBeInTheDocument();
      });

      it('render SqlManagementAnalyze', async () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/sql-management/sqlManageId/analyze`
        ]);

        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('SqlManagementAnalyze')).toBeInTheDocument();
      });
    });
  });
});
