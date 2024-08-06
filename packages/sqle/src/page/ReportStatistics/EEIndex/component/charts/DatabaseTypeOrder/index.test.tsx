import { cleanup, act } from '@testing-library/react';
import {
  renderWithThemeAndRedux,
  renderHooksWithTheme
} from '../../../../../../testUtils/customRender';

import statistic from '../../../../../../testUtils/mockApi/statistic';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import DatabaseTypeOrder, {
  renderLabelContent,
  renderTooltipFormatter,
  renderTooltipCustomContent
} from '.';
import { ThemeData, SupportTheme } from '../../../../../../theme';

const themeData = ThemeData[SupportTheme.LIGHT];

describe('ReportStatistics/DatabaseTypeOrder', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR
  ]);
  let requestPlotsData: jest.SpyInstance;
  const customRender = () => {
    return renderWithThemeAndRedux(<DatabaseTypeOrder />);
  };
  beforeEach(() => {
    jest.useFakeTimers();
    requestPlotsData = statistic.getWorkflowPercentCountedByInstanceType();
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

  it('render empty count for workflow', async () => {
    requestPlotsData.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          workflow_total_num: 2,
          workflow_percents: [
            undefined,
            {
              percent: 91
            }
          ]
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestPlotsData).toHaveBeenCalled();
  });

  it('render label content', async () => {
    const { result } = renderHooksWithTheme(() => renderLabelContent({}));
    expect(result.current).toStrictEqual('');
  });

  it('render tooltip formatter', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipFormatter?.({ name: '', value: '' })
    );
    expect(result.current).toStrictEqual({ name: '', value: '' });
  });

  it('render empty tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent([], themeData.sharedTheme, 1)
    );
    expect(result.current).toBe(null);
  });

  it('render tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent(
        [{ color: 'red', data: { data: { name: 'test', value: '12' } } }],
        themeData.sharedTheme,
        1
      )
    );
    expect(result.current).toMatchSnapshot();
  });
});
