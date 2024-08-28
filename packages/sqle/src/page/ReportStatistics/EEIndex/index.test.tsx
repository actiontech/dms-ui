import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../testUtils/mockHooks/mockThemeStyleData';

import EEIndex from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import statistic from '../../../testUtils/mockApi/statistic';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

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
    MockDate.set(dayjs('2022-01-01 12:00:00').valueOf());
    requestPlotsData = statistic.getInstancesTypePercent();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('render report statics page', async () => {
    const { baseElement } = renderWithThemeAndRedux(<EEIndex />);
    expect(requestPlotsData).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('报表统计')).toBeInTheDocument();
    expect(getBySelector('.refresh-icon')).toBeInTheDocument();
    fireEvent.click(getBySelector('.refresh-icon'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestPlotsData).toHaveBeenCalled();
  });
});
