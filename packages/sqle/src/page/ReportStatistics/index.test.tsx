import { cleanup } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../testUtils/customRender';
import { mockThemeStyleData } from '../../testUtils/mockHooks/mockThemeStyleData';

import ReportStatistics from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import statistic from '../../testUtils/mockApi/statistic';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/ReportStatistics', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR
  ]);
  beforeEach(() => {
    statistic.mockAllApi();
    jest.useFakeTimers();
    MockDate.set(dayjs('2022-01-01 12:00:00').valueOf());
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithThemeAndRedux(<ReportStatistics />);
    expect(baseElement).toMatchSnapshot();
  });
});
