import { act, fireEvent } from '@testing-library/react';
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
  mockUseCurrentProject
} from '@actiontech/shared/lib/testUtil';
import { ModalName } from '../../../data/ModalName';
import { useSelector } from 'react-redux';

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

  beforeEach(() => {
    MockDate.set(dayjs('2025-01-09 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    useParamsMock.mockReturnValue({
      taskId: 'taskId1',
      sqlNum: '123'
    });
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUsePermission({}, { useSpyOnMockHooks: true });
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
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(task, 'getTaskAnalysisDataV2');
    spy.mockImplementation(() => resolveThreeSecond(WorkflowSqlAnalyzeData));
    return spy;
  };

  it('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = superRender(<WorkflowSqlAnalyze />);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      task_id: 'taskId1',
      number: 123
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
