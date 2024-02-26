import { cleanup } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../testUtils/customRender';
import { mockThemeStyleData } from '../../testUtils/mockHooks/mockThemeStyleData';

import ReportStatistics from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import statistic from '../../testUtils/mockApi/statistic';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/ReportStatistics', () => {
  ignoreAntdPlotsAttr();
  beforeEach(() => {
    statistic.mockAllApi();
    jest.useFakeTimers();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithThemeAndRedux(<ReportStatistics />);
    expect(baseElement).toMatchSnapshot();
  });
});
