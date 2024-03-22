import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import {
  renderWithThemeAndRedux,
  renderHooksWithTheme
} from '../../../../../../testUtils/customRender';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import DatabaseSourceOrder, {
  renderTooltipFormatter,
  renderTooltipCustomContent
} from '.';
import { ThemeData, SupportTheme } from '../../../../../../theme';
import { PieConfig } from '@ant-design/plots';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Pie: jest.requireActual('@ant-design/plots').PieWithCustomRenderCalled({
      statistic: {
        title: {
          customHtml: (props: PieConfig) => {
            return [null, null, null, props.data];
          }
        }
      },
      tooltip: {
        customContent: (props: PieConfig) => {
          return [
            '',
            [
              {
                color: '#6094FC',
                name: props.data[0]?.name,
                value: props.data[0]?.value
              }
            ]
          ];
        }
      }
    })
  };
});

const themeData = ThemeData[SupportTheme.LIGHT];

describe('ReportStatistics/DatabaseSourceOrder', () => {
  ignoreAntdPlotsAttr();
  let requestPlotsData: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<DatabaseSourceOrder />);
  };
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
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('render chart snap when api return empty', async () => {
    requestPlotsData.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toHaveBeenCalled();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('render tooltip formatter', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipFormatter?.({ name: '', value: '' })
    );
    expect(result.current).toStrictEqual({ name: '', value: '' });
  });

  it('render empty tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent([], themeData.sharedTheme, 0)
    );
    expect(result.current).toBe(null);
  });

  it('render tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent(
        [{ color: 'red', name: 'test', value: '12' }],
        themeData.sharedTheme,
        12
      )
    );
    expect(result.current).toMatchSnapshot();
  });
});
