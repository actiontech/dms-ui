import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import {
  renderHooksWithTheme,
  renderWithThemeAndRedux
} from '../../../../../../testUtils/customRender';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import OrderQuantityTrend, {
  renderAreaStyle,
  renderAnnotationsContent,
  renderAnnotationsPosition,
  renderTooltipFormatter,
  renderTooltipCustomContent
} from '.';
import eventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ThemeData, SupportTheme } from '../../../../../../theme';

const themeData = ThemeData[SupportTheme.LIGHT];

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('ReportStatistics/OrderQuantityTrend', () => {
  ignoreAntdPlotsAttr();
  let requestPlotsData: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<OrderQuantityTrend />);
  };

  beforeEach(() => {
    MockDate.set(dayjs('2022-01-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    requestPlotsData = statistic.getWorkflowCreatedCountEachDay();
    mockUseCurrentUser();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    MockDate.reset();
  });

  it('render chart snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('render chart snap when api return empty', async () => {
    requestPlotsData.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('refresh order quantity trend', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    act(() => {
      eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('select diff time to show trend', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(getBySelector('input[value="2022-01-01"]')).toBeInTheDocument();
    fireEvent.click(getBySelector('input[value="2022-01-01"]'));
    await act(async () => jest.advanceTimersByTime(3000));

    const inputEle = getAllBySelector('.ant-picker-input input', baseElement);
    expect(inputEle.length).toBe(2);

    fireEvent.click(inputEle[0].parentElement!);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('15')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getAllByText('15')[1]);
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('render area style', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderAreaStyle(themeData.sharedTheme)
    );
    expect(result.current.fill).toStrictEqual(`l(90) 0:#4583ff  1:#4583ff00`);
  });

  it('render annotations content', async () => {
    const { result } = renderHooksWithTheme(() => renderAnnotationsContent(1));
    expect(result.current).toStrictEqual(1);
  });

  it('render annotations position', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderAnnotationsPosition({ date: '12', value: 1 })
    );
    expect(result.current).toStrictEqual(['12', 1]);
  });

  it('render tooltip formatter', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipFormatter?.({ date: '', value: '' })
    );
    expect(result.current).toStrictEqual({ name: '', value: '' });
  });

  it('render empty tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent([], themeData.sharedTheme)
    );
    expect(result.current).toBe(null);
  });

  it('render tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent(
        [{ name: '1', value: 1 }],
        themeData.sharedTheme
      )
    );
    expect(result.current).toMatchSnapshot();
  });
});
