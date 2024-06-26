import { superRender } from '../../../../testUtils/customRender';
import SqlCount from '.';
import projectOverview from '../../../../testUtils/mockApi/projectOverview';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useNavigate } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '../../../../utils/EventEmitter';
import { ignoreAntdPlotsAttr } from '@actiontech/shared/lib/testUtil/common';
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
  ignoreAntdPlotsAttr();

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
    return superRender(<SqlCount />);
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
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
