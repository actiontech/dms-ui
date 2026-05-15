import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockThemeStyleData } from '../../testUtils/mockHooks/mockThemeStyleData';

import ReportStatistics from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';

describe('sqle/ReportStatistics', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR,
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.FUNCTION_COMPONENT_REF
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
    jest.useRealTimers();
    cleanup();
    MockDate.reset();
  });

  it('should match snap shot', async () => {
    const { baseElement } = sqleSuperRender(<ReportStatistics />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should switch to ai governance tab', async () => {
    sqleSuperRender(<ReportStatistics />);
    await act(async () => jest.advanceTimersByTime(3300));

    const allTabs = getAllBySelector('.ant-segmented-item-input');
    expect(allTabs[0]).toBeChecked();
    fireEvent.click(allTabs[1]);
    expect(allTabs[1]).toBeChecked();
    expect(screen.getByText('AI 智能效能中心')).toBeInTheDocument();
  });

  it('should emit refresh event when click refresh icon', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    sqleSuperRender(<ReportStatistics />);
    await act(async () => jest.advanceTimersByTime(3300));

    fireEvent.click(getBySelector('.refresh-icon'));
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.Refresh_Report_Statistics);
  });
});
