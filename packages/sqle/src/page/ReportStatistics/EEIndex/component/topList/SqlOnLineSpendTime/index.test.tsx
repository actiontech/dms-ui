import { cleanup, act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import SqlOnLineSpendTime from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('ReportStatistics/topList/SqlOnLineSpendTime', () => {
  const customRender = () => {
    return sqleSuperRender(<SqlOnLineSpendTime />);
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
    const getSqlAverageExecutionTime = statistic.getSqlAverageExecutionTime();
    getSqlAverageExecutionTime.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getSqlAverageExecutionTime).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return error', async () => {
    const getSqlAverageExecutionTime = statistic.getSqlAverageExecutionTime();
    getSqlAverageExecutionTime.mockImplementation(() =>
      createSpyFailResponse({ message: 'error-getSqlAverageExecutionTime' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getSqlAverageExecutionTime).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when api return data', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });
});
