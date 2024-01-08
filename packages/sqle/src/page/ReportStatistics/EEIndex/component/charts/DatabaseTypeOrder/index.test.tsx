import { cleanup, act } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../../../../testUtils/customRender';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import DatabaseTypeOrder from '.';

describe('ReportStatistics/DatabaseTypeOrder', () => {
  ignoreAntdPlotsAttr();
  let requestPlotsData: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<DatabaseTypeOrder />);
  };
  beforeEach(() => {
    jest.useFakeTimers();
    requestPlotsData = statistic.getWorkflowPercentCountedByInstanceType();
    mockUseCurrentUser();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render chart snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toBeCalled();
  });

  it('render chart snap when api return empty', async () => {
    requestPlotsData.mockImplementation(() => createSpySuccessResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toBeCalled();
  });
});
