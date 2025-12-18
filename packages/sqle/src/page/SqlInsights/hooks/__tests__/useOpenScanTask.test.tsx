import { renderHook, act, cleanup } from '@testing-library/react';
import useOpenScanTask from '../useOpenScanTask';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi/common';
import { useTypedNavigate } from '@actiontech/shared';

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedNavigate: jest.fn()
}));

describe('useOpenScanTask', () => {
  const navigateSpy = jest.fn();
  const mockProjectName = 'test-project';
  const mockProjectID = '1';
  const mockSelectedInstance = 'test-instance-id';
  const mockInstanceEnvironmentTag = 'test-env';

  let getInstanceAuditPlansSpy: jest.SpyInstance;

  const mockAuditPlanWithProcesslist: IInstanceAuditPlanResV1 = {
    instance_audit_plan_id: 2,
    instance_name: 'test-instance',
    environment: 'test-env',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 2,
        type: 'processlist_mysql',
        desc: 'Processlist'
      }
    ],
    create_time: '2024-01-01T00:00:00Z',
    creator: 'admin'
  };

  const mockAuditPlanWithTopSql: IInstanceAuditPlanResV1 = {
    instance_audit_plan_id: 3,
    instance_name: 'test-instance',
    environment: 'test-env',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 3,
        type: 'top_sql_mysql',
        desc: 'Top SQL'
      }
    ],
    create_time: '2024-01-01T00:00:00Z',
    creator: 'admin'
  };

  const mockAuditPlanWithSlowLog: IInstanceAuditPlanResV1 = {
    instance_audit_plan_id: 4,
    instance_name: 'test-instance',
    environment: 'test-env',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 4,
        type: 'slow_log_mysql',
        desc: 'Slow log'
      }
    ],
    create_time: '2024-01-01T00:00:00Z',
    creator: 'admin'
  };

  const mockAuditPlanWithoutMatchingScanType: IInstanceAuditPlanResV1 = {
    instance_audit_plan_id: 5,
    instance_name: 'test-instance',
    environment: 'test-env',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 5,
        type: 'sql_file',
        desc: 'SQL file'
      }
    ],
    create_time: '2024-01-01T00:00:00Z',
    creator: 'admin'
  };

  beforeEach(() => {
    mockUseCurrentProject({
      projectName: mockProjectName,
      projectID: mockProjectID
    });
    getInstanceAuditPlansSpy =
      sqleMockApi.instanceAuditPlan.getInstanceAuditPlans();
    (useTypedNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useOpenScanTask());

    expect(result.current.getAuditPlanDataLoading).toBe(false);
    expect(typeof result.current.onCreateSqlManagementConf).toBe('function');

    expect(getInstanceAuditPlansSpy).not.toHaveBeenCalled();
  });

  describe('when auditPlanData does not exist', () => {
    beforeEach(() => {
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [],
          total_nums: 0
        })
      );
    });

    it('should navigate to create page when onCreateSqlManagementConf is called', () => {
      const { result } = renderHook(() =>
        useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
      );

      act(() => {
        result.current.onCreateSqlManagementConf(
          GetSqlPerformanceInsightsMetricNameEnum.comprehensive_trend
        );
      });

      expect(navigateSpy).toHaveBeenCalledWith(
        ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create,
        {
          params: {
            projectID: mockProjectID
          },
          queries: {
            instance_id: mockSelectedInstance,
            environment_tag: mockInstanceEnvironmentTag
          }
        }
      );
    });
  });

  describe('when auditPlanData exists', () => {
    describe('when audit plan type does not exist', () => {
      it('should navigate to update page when processlist scan type is not configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithoutMatchingScanType],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.active_session_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update,
          {
            params: {
              projectID: mockProjectID,
              id: '5'
            }
          }
        );
      });

      it('should navigate to update page when top_sql scan type is not configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithoutMatchingScanType],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.top_sql_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update,
          {
            params: {
              projectID: mockProjectID,
              id: '5'
            }
          }
        );
      });

      it('should navigate to update page when slow_log scan type is not configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithoutMatchingScanType],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.slow_sql_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update,
          {
            params: {
              projectID: mockProjectID,
              id: '5'
            }
          }
        );
      });
    });

    describe('when audit plan type exists', () => {
      it('should navigate to detail page when processlist scan type is configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithProcesslist],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.active_session_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail,
          {
            params: {
              projectID: mockProjectID,
              id: '2'
            }
          }
        );
      });

      it('should navigate to detail page when top_sql scan type is configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithTopSql],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.top_sql_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail,
          {
            params: {
              projectID: mockProjectID,
              id: '3'
            }
          }
        );
      });

      it('should navigate to detail page when slow_log scan type is configured', async () => {
        getInstanceAuditPlansSpy.mockImplementation(() =>
          createSpySuccessResponse({
            data: [mockAuditPlanWithSlowLog],
            total_nums: 1
          })
        );

        const { result } = renderHook(() =>
          useOpenScanTask(mockSelectedInstance, mockInstanceEnvironmentTag)
        );

        await act(async () => jest.advanceTimersByTime(3000));

        act(() => {
          result.current.onCreateSqlManagementConf(
            GetSqlPerformanceInsightsMetricNameEnum.slow_sql_trend
          );
        });

        expect(navigateSpy).toHaveBeenCalledWith(
          ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail,
          {
            params: {
              projectID: mockProjectID,
              id: '4'
            }
          }
        );
      });
    });
  });
});
