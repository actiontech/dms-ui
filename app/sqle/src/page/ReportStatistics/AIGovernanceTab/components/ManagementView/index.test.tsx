import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import statistic from '@actiontech/shared/lib/testUtil/mockApi/sqle/statistic';
import EmitterKey from '../../../../../data/EmitterKey';
import eventEmitter from '../../../../../utils/EventEmitter';
import ManagementView from '.';

describe('ReportStatistics/AIGovernance/ManagementView', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR
  ]);

  const onViewTypeChange = jest.fn();
  let requestManagementViewSpy: jest.SpyInstance;

  const customRender = (viewType: 'rewrite' | 'tuning' = 'rewrite') => {
    return sqleSuperRender(
      <ManagementView viewType={viewType} onViewTypeChange={onViewTypeChange} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestManagementViewSpy = statistic.getAIHubManagementView();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render management view and rewrite module data', async () => {
    const { baseElement } = customRender('rewrite');

    await act(async () => jest.advanceTimersByTime(3300));

    expect(requestManagementViewSpy).toHaveBeenCalled();
    expect(screen.getByText('管理视图')).toBeInTheDocument();
    expect(screen.getByText('分析层')).toBeInTheDocument();
    expect(screen.getByText('AI 智能修正')).toBeInTheDocument();
    expect(screen.getByText('AI 性能引擎')).toBeInTheDocument();
    expect(screen.getByText('重写项目A')).toBeInTheDocument();
    const plot = screen.getByTestId('mock-antd-plots');
    const params = JSON.parse(plot.getAttribute('data-custom-params') || '{}');
    expect(params.data).toEqual([{ type: '语法错误', value: 45 }]);
    expect(baseElement).toMatchSnapshot();
  });

  it('should switch to available view type when current type is unavailable', async () => {
    requestManagementViewSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          modules: [
            {
              ai_module_type: 'performance_engine',
              project_io_analysis: [{ project_name: '仅调优项目' }],
              top_problem_distribution: [
                { problem_type: '慢查询', percentage: 60 }
              ]
            }
          ]
        }
      })
    );

    customRender('rewrite');

    await act(async () => jest.advanceTimersByTime(3300));

    expect(onViewTypeChange).toHaveBeenCalledTimes(1);
    expect(onViewTypeChange).toHaveBeenCalledWith('tuning');
  });

  it('should switch displayed data when click segmented option', async () => {
    const ControlledView = () => {
      const [viewType, setViewType] = useState<'rewrite' | 'tuning'>('rewrite');
      return (
        <ManagementView viewType={viewType} onViewTypeChange={setViewType} />
      );
    };

    customRender('rewrite');
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('重写项目A')).toBeInTheDocument();
    expect(screen.queryByText('调优项目B')).not.toBeInTheDocument();

    cleanup();
    sqleSuperRender(<ControlledView />);
    await act(async () => jest.advanceTimersByTime(3300));

    fireEvent.click(screen.getByText('AI 性能引擎'));

    expect(screen.getByText('调优项目B')).toBeInTheDocument();
    expect(screen.queryByText('重写项目A')).not.toBeInTheDocument();
    const plot = screen.getByTestId('mock-antd-plots');
    const params = JSON.parse(plot.getAttribute('data-custom-params') || '{}');
    expect(params.data).toEqual([{ type: '索引优化', value: 38 }]);
  });

  it('should refresh data when report statistics refresh event is emitted', async () => {
    customRender('rewrite');
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestManagementViewSpy).toHaveBeenCalledTimes(1);

    act(() => {
      eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
    });
    await act(async () => jest.advanceTimersByTime(3300));

    expect(requestManagementViewSpy).toHaveBeenCalledTimes(2);
  });
});
