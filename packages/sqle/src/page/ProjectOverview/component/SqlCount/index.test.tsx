import { sqleSuperRender } from '../../../../testUtils/superRender';
import SqlCount from '.';
import projectOverview from '@actiontech/shared/lib/testUtil/mockApi/sqle/projectOverview';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useNavigate } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '../../../../utils/EventEmitter';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { RingProgressConfig } from '@ant-design/plots';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    RingProgress: jest
      .requireActual('@ant-design/plots')
      .RingProgressWithCustomRenderCalled({
        statistic: {
          title: {
            customHtml: (props: RingProgressConfig) => {
              return [null, null, { percent: props.percent }];
            }
          }
        }
      })
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/ProjectOverview/SqlCount', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.PARENT_COMPONENT_PROP_ERROR
  ]);

  const navigateSpy = jest.fn();

  beforeEach(() => {
    projectOverview.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return sqleSuperRender(<SqlCount />);
  };

  it('render sql count', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL统计')).toBeInTheDocument();
  });

  it('render sql count when risk SQL rate is 0%', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          total_sql_count: 5000,
          risk_sql_count: 1
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL统计')).toBeInTheDocument();
  });

  it('render sql count when risk sql count is 0', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          total_sql_count: 100,
          risk_sql_count: 0
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL统计')).toBeInTheDocument();
  });

  it('render sql count when total sql count is 0', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          total_sql_count: 0,
          risk_sql_count: 0
        }
      })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷 新')).toBeInTheDocument();
  });

  it('render no data and refresh list', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = projectOverview.getStatisticsAuditedSQL();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    const { baseElement } = customRender();
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷 新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷 新'));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
