import { cleanup, act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import MockDate from 'mockdate';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import CardNumberShow from '.';
import dayjs from 'dayjs';

describe('ReportStatistics/CardNumberShow', () => {
  const customRender = () => {
    return sqleSuperRender(<CardNumberShow />);
  };

  beforeEach(() => {
    MockDate.set(dayjs('2010-01-01 08:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockThemeStyleData();
    statistic.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('render snap loading', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return empty', async () => {
    const getWorkflowCount = statistic.getWorkflowCount();
    getWorkflowCount.mockImplementation(() => createSpySuccessResponse({}));
    const getWorkflowDurationOfWaitingForAudit =
      statistic.getWorkflowDurationOfWaitingForAudit();
    getWorkflowDurationOfWaitingForAudit.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const getWorkflowAuditPassPercent = statistic.getWorkflowAuditPassPercent();
    getWorkflowAuditPassPercent.mockImplementation(() =>
      createSpySuccessResponse({})
    );

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getWorkflowCount).toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(getWorkflowDurationOfWaitingForAudit).toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(getWorkflowAuditPassPercent).toHaveBeenCalled();

    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return error', async () => {
    const getWorkflowCount = statistic.getWorkflowCount();
    getWorkflowCount.mockImplementation(() =>
      createSpyFailResponse({ message: 'error-getWorkflowCount' })
    );
    const getWorkflowDurationOfWaitingForAudit =
      statistic.getWorkflowDurationOfWaitingForAudit();
    getWorkflowDurationOfWaitingForAudit.mockImplementation(() =>
      createSpyFailResponse({
        message: 'error-getWorkflowDurationOfWaitingForAudit'
      })
    );
    const getWorkflowAuditPassPercent = statistic.getWorkflowAuditPassPercent();
    getWorkflowAuditPassPercent.mockImplementation(() =>
      createSpyFailResponse({})
    );

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return data', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(baseElement).toMatchSnapshot();
  });
});
