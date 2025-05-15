import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import {
  sqleSuperRenderHook,
  sqleSuperRender
} from '../../../../testUtils/superRender';
import sqlOptimization from '../../../../testUtils/mockApi/sqlOptimization';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockThemeStyleData } from '../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import DataSourcePerformance from '.';
import { ThemeData, SupportTheme } from '../../../../theme';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IDBPerformanceImproveOverview } from '@actiontech/shared/lib/api/sqle/service/common';
import { BarConfig } from '@ant-design/plots';
import {
  defaultItemKey,
  labelFormatter,
  renderTooltipCustomContent,
  renderTooltipFormatter
} from './index.data';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Bar: jest.requireActual('@ant-design/plots').BarWithCustomRenderCalled({
      tooltip: {
        customContent: (props: BarConfig) => {
          return [
            '',
            [
              {
                name: props.data[0]?.instance_name,
                value: props.data[0]?.avg_performance_improve
              }
            ]
          ];
        }
      }
    })
  };
});

const themeData = ThemeData[SupportTheme.LIGHT];

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('ProjectOverview/DataSourcePerformance', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR
  ]);
  let getDBPerformanceImproveOverviewSpy: jest.SpyInstance;
  const customRender = () => {
    return sqleSuperRender(<DataSourcePerformance />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getDBPerformanceImproveOverviewSpy =
      sqlOptimization.getDBPerformanceImproveOverview();
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
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDBPerformanceImproveOverviewSpy).toHaveBeenCalled();
  });

  it('render data source performance list more than 8', async () => {
    getDBPerformanceImproveOverviewSpy.mockClear();
    const mockData: IDBPerformanceImproveOverview[] = [];
    for (let index = 0; index < 10; index++) {
      mockData.push({
        avg_performance_improve: index,
        instance_name: `${index}name`
      });
    }
    getDBPerformanceImproveOverviewSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockData })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render chart snap when api return empty', async () => {
    getDBPerformanceImproveOverviewSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDBPerformanceImproveOverviewSpy).toHaveBeenCalled();
  });

  it('render tooltip formatter', async () => {
    const { result } = sqleSuperRenderHook(() =>
      renderTooltipFormatter?.({
        instance_name: '',
        avg_performance_improve: ''
      })
    );
    expect(result.current).toStrictEqual({ name: '', value: '' });
  });

  it('render empty tooltip customContent', async () => {
    const { result } = sqleSuperRenderHook(() =>
      renderTooltipCustomContent([], themeData.sqleTheme, themeData.sharedTheme)
    );
    expect(result.current).toBe(null);
  });

  it('render tooltip name start with defaultItemKey', async () => {
    const { result } = sqleSuperRenderHook(() =>
      renderTooltipCustomContent(
        [{ name: `${defaultItemKey}1`, value: 0 }],
        themeData.sqleTheme,
        themeData.sharedTheme
      )
    );
    expect(result.current).toMatchSnapshot();
  });

  it('render tooltip customContent', async () => {
    const { result } = sqleSuperRenderHook(() =>
      renderTooltipCustomContent(
        [{ name: '1', value: 1 }],
        themeData.sqleTheme,
        themeData.sharedTheme
      )
    );
    expect(result.current).toMatchSnapshot();
  });

  it('render label', async () => {
    const { result } = sqleSuperRenderHook(() => labelFormatter('test-label'));
    expect(result.current).toEqual('test-label');
  });

  it('render label when start with defaultItemKey', async () => {
    const { result } = sqleSuperRenderHook(() =>
      labelFormatter(`${defaultItemKey}1`)
    );
    expect(result.current).toEqual('');
  });
});
