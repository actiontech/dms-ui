import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import {
  renderHooksWithTheme,
  renderWithThemeAndRedux
} from '../../../../testUtils/customRender';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import sqlOptimization from '../../../../testUtils/mockApi/sqlOptimization';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import { mockThemeStyleData } from '../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import OptimizationDistribution, {
  renderAreaStyle,
  renderAnnotationsContent,
  renderAnnotationsPosition,
  renderTooltipFormatter,
  renderTooltipCustomContent
} from '.';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ThemeData, SupportTheme } from '../../../../theme';
import { AreaConfig } from '@ant-design/plots';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Area: jest.requireActual('@ant-design/plots').BarWithCustomRenderCalled({
      tooltip: {
        customContent: (props: AreaConfig) => {
          return [
            '',
            [
              {
                name: props.data[0]?.time,
                value: props.data[0]?.record_number
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

describe('ProjectOverview/OptimizationDistribution', () => {
  ignoreAntdPlotsAttr();
  let getOptimizationOverviewSpy: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<OptimizationDistribution />);
  };

  beforeEach(() => {
    MockDate.set(dayjs('2022-01-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    getOptimizationOverviewSpy = sqlOptimization.getOptimizationOverview();
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
    expect(getOptimizationOverviewSpy).toHaveBeenCalled();
  });

  it('render chart snap when api return empty', async () => {
    getOptimizationOverviewSpy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationOverviewSpy).toHaveBeenCalled();
  });

  it('refresh optimization distribution', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    // act(() => {
    //   eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
    // });
    await act(async () => jest.advanceTimersByTime(300));
    expect(getOptimizationOverviewSpy).toHaveBeenCalled();
  });

  it('select diff time to show optimization', async () => {
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
    expect(getOptimizationOverviewSpy).toHaveBeenCalled();
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
      renderAnnotationsPosition({ time: '12', record_number: 1 })
    );
    expect(result.current).toStrictEqual(['12', 1]);
  });

  it('render tooltip formatter', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipFormatter?.({ time: '', record_number: '' })
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
