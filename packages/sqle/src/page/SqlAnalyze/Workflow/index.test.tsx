import { act, fireEvent, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';

import task from '@actiontech/shared/lib/api/sqle/service/task';
import { WorkflowSqlAnalyzeData } from '../__testData__';

import WorkflowSqlAnalyze from '.';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import {
  mockUsePermission,
  mockUseCurrentUser,
  mockUseCurrentProject,
  mockUseDbServiceDriver
} from '@actiontech/shared/lib/testUtil';
import { ModalName } from '../../../data/ModalName';
import { useSelector } from 'react-redux';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('SqlAnalyze/Workflow', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let sqlOptimizeSpy: jest.SpyInstance;

  beforeEach(() => {
    MockDate.set(dayjs('2025-01-09 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    useParamsMock.mockReturnValue({
      taskId: 'taskId1',
      sqlNum: '123'
    });
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlAnalyze: {
          modalStatus: {
            [ModalName.Sql_Optimization_Result_Drawer]: false
          },
          resultDrawer: {
            currentResultDrawerData: {
              optimizationId: '1'
            }
          }
        }
      })
    );
    sqlOptimizeSpy = sqlOptimization.optimizeSQLReq();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAnalyzeData = (hasAffectRows = false) => {
    const spy = jest.spyOn(task, 'getTaskAnalysisDataV2');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        ...WorkflowSqlAnalyzeData,
        performance_statistics: {
          affect_rows: hasAffectRows
            ? {
                count: 10,
                err_message: ''
              }
            : undefined
        }
      })
    );
    return spy;
  };

  it('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = superRender(<WorkflowSqlAnalyze />);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      task_id: 'taskId1',
      number: 123,
      affectRowsEnabled: false
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[1]);
    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[2]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  it('should get performance statistics', async () => {
    const spy = mockGetAnalyzeData(true);
    superRender(<WorkflowSqlAnalyze />);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      task_id: 'taskId1',
      number: 123,
      affectRowsEnabled: false
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('获 取'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, {
      task_id: 'taskId1',
      number: 123,
      affectRowsEnabled: true
    });
  });

  it('should create sql optimization task', async () => {
    const spy = mockGetAnalyzeData(true);
    superRender(<WorkflowSqlAnalyze />, undefined, {
      routerProps: {
        initialEntries: ['/analyze?instance_name=Mysql1&schema=sqle']
      }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      task_id: 'taskId1',
      number: 123,
      affectRowsEnabled: false
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('SQL优化'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(sqlOptimizeSpy).toHaveBeenCalledTimes(1);
  });

  it('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(WorkflowSqlAnalyzeData, {
        otherData: {
          code: 8001
        }
      })
    );
    const { container } = superRender(<WorkflowSqlAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should render error result of type "error" when response code is not 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(WorkflowSqlAnalyzeData, {
        otherData: {
          code: 8000
        }
      })
    );
    const { container } = superRender(<WorkflowSqlAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
