import { screen, cleanup, act } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';

import statistic from '../../../../../testUtils/mockApi/statistic';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import CardNumberShow from '.';

describe('ReportStatistics/CardNumberShow', () => {
  let DateSpy: jest.SpyInstance;
  const customRender = () => {
    const mockDate = new Date('2010-01-01T00:00:00Z');
    DateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as any);
    return renderWithTheme(<CardNumberShow />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
    statistic.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    DateSpy.mockRestore();
    cleanup();
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
    expect(getWorkflowCount).toBeCalled();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(getWorkflowDurationOfWaitingForAudit).toBeCalled();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(getWorkflowAuditPassPercent).toBeCalled();

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
