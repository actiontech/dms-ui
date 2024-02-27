import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../testUtils/mockHooks/mockThemeStyleData';

import EEIndex from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import statistic from '../../../testUtils/mockApi/statistic';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/ReportStatistics/EEIndex', () => {
  let requestPlotsData: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestPlotsData = statistic.getInstancesTypePercent();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render report statics page', async () => {
    const { baseElement } = renderWithThemeAndRedux(<EEIndex />);
    expect(requestPlotsData).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('报表统计')).toBeInTheDocument();
    expect(getBySelector('.refresh-icon')).toBeInTheDocument();
    fireEvent.click(getBySelector('.refresh-icon'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestPlotsData).toBeCalled();
  });
});