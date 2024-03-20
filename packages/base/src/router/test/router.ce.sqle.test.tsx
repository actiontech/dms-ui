/**
 * @test_version ce
 */
import { MemoryRouterProps } from 'react-router-dom';
import { act, screen, cleanup } from '@testing-library/react';

import mockUseRoutes, { RenderRouterComponent } from './data';
import { superRender } from '../../testUtils/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('base/router-sqle-ce', () => {
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
        const { baseElement } = customRender(['/sqle/reportStatistics']);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('reportStatistics')).toBeInTheDocument();
      });

      it('render route rule', () => {
        const { baseElement } = customRender(['/sqle/rule']);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('rule')).toBeInTheDocument();
      });

      it('render route ruleManager', async () => {
        const { baseElement } = customRender(['/sqle/ruleManager']);
        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('ruleTemplateManagement')).toBeInTheDocument();
      });

      it('render route globalCreate', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/globalCreate'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateCreate')
        ).toBeInTheDocument();
      });

      it('render route globalImport', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/globalImport'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateImport')
        ).toBeInTheDocument();
      });

      it('render route globalUpdate', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/globalUpdate/templateName'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateUpdate')
        ).toBeInTheDocument();
      });

      it('render route globalDetail', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/globalDetail/templateName/dbType'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(
          screen.getByText('globalRuleTemplateDetail')
        ).toBeInTheDocument();
      });

      it('render route customCreate', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/customCreate'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('createCustomRule')).toBeInTheDocument();
      });

      it('render route customUpdate', () => {
        const { baseElement } = customRender([
          '/sqle/ruleManager/customUpdate/ruleID'
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('updateCustomRule')).toBeInTheDocument();
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

      describe('render route order', () => {
        it('render route orderList', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/order`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });

        it('render route orderCreate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/order/create`
          ]);

          await act(async () => jest.advanceTimersByTime(0));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('orderCreate')).toBeInTheDocument();
        });

        it('render route orderDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/order/orderId`
          ]);

          await act(async () => jest.advanceTimersByTime(0));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('orderDetail')).toBeInTheDocument();
        });
      });

      describe('render route sqlAudit', () => {
        it('render route sqlAuditList', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sqlAudit`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlAuditList')).toBeInTheDocument();
        });

        it('render route sqlAuditCreate', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sqlAudit/create`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('sqlAuditCreate')).toBeInTheDocument();
        });

        it('render route sqlAuditDetail', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sqlAudit/detail/sql_audit_record_id`
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

      it('render route dashboard', async () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/dashboard`
        ]);

        await act(async () => jest.advanceTimersByTime(300));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('dashboard')).toBeInTheDocument();
      });

      describe('render route plan', () => {
        it('render route auditPlanList', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/auditPlan`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });

        it('render route auditPlanCreate', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/auditPlan/create`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('auditPlanCreate')).toBeInTheDocument();
        });

        it('render route auditPlanUpdate', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/auditPlan/update/auditPlanName`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('auditPlanUpdate')).toBeInTheDocument();
        });

        it('render route auditPlanDetail', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/auditPlan/detail/auditPlanName`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('auditPlanDetail')).toBeInTheDocument();
        });
        it('render route auditPlanDetailReport', () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/auditPlan/detail/auditPlanName/report/reportId`
          ]);

          expect(baseElement).toMatchSnapshot();
          expect(screen.getByText('auditPlanDetailReport')).toBeInTheDocument();
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
          `/sqle/project/${projectID}/operationRecord`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('operationRecord')).toBeInTheDocument();
      });

      describe('render route sqlManagement', () => {
        it('render sqlManagement', async () => {
          const { baseElement } = customRender([
            `/sqle/project/${projectID}/sqlManagement`
          ]);

          await act(async () => jest.advanceTimersByTime(300));
          expect(baseElement).toMatchSnapshot();
        });
      });
    });

    describe('render route analyze', () => {
      it('render route orderAnalyze', () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/order/taskId/sqlNum/analyze`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('orderAnalyze')).toBeInTheDocument();
      });

      it('render route auditPlanDetail', () => {
        const { baseElement } = customRender([
          `/sqle/project/${projectID}/auditPlan/reportId/sqlNum/:auditPlanName/analyze`
        ]);

        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('auditPlanDetailAnalyze')).toBeInTheDocument();
      });
    });
  });
});
