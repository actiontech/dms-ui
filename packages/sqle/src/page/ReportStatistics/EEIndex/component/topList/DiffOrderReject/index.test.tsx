import { cleanup, act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

import DiffOrderReject from '.';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('ReportStatistics/topList/DiffOrderReject', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);
  const customRender = () => {
    return sqleSuperRender(<DiffOrderReject />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    statistic.mockAllApi();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap loading', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return empty', async () => {
    const requestInstance =
      statistic.getWorkflowRejectedPercentGroupByCreator();
    requestInstance.mockImplementation(() =>
      createSpySuccessResponse({ message: 'error-getWorkflowCount' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestInstance).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return error', async () => {
    const requestInstance =
      statistic.getWorkflowRejectedPercentGroupByCreator();
    requestInstance.mockImplementation(() =>
      createSpyFailResponse({
        message: 'error-getWorkflowRejectedPercentGroupByCreator'
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return data', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });
});
