import { cleanup, act } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../../../../testUtils/customRender';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';

import DatabaseSourceOrder from '.';

describe('ReportStatistics/DatabaseSourceOrder', () => {
  ignoreAntdPlotsAttr();
  let requestPlotsData: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<DatabaseSourceOrder />);
  }
  beforeEach(() => {
    jest.useFakeTimers();
    requestPlotsData = statistic.getInstancesTypePercent();
    mockUseCurrentUser();
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
  })
});
