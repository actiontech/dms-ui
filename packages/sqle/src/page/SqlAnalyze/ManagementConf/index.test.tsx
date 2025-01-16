import { act, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ManagementConfAnalyze from '.';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';
import { AuditPlanSqlAnalyzeData } from '../__testData__';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

const projectName = 'default';

describe('SqlAnalyze/ManagementConfAnalyze', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    MockDate.set(dayjs('2025-01-09 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockUseCurrentProject();
    useParamsMock.mockReturnValue({
      instanceAuditPlanId: '1',
      id: '2',
      projectName
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(
      instance_audit_plan,
      'getAuditPlanSqlAnalysisDataV1'
    );
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanSqlAnalyzeData));
    return spy;
  };

  test('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = renderWithReduxAndTheme(
      <ManagementConfAnalyze />
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      project_name: projectName,
      instance_audit_plan_id: '1',
      id: '2'
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3500));

    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[1]);
    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[2]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  test('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(AuditPlanSqlAnalyzeData, {
        otherData: {
          code: 8001
        }
      })
    );
    const { container } = renderWithReduxAndTheme(<ManagementConfAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should render error result of type "error" when response code is not 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(AuditPlanSqlAnalyzeData, {
        otherData: {
          code: 8000
        }
      })
    );
    const { container } = renderWithReduxAndTheme(<ManagementConfAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
