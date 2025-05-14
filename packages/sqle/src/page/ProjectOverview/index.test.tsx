import { sqleSuperRender } from '../../testUtils/superRender';
import Overview from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EmitterKey from '../../data/EmitterKey';
import eventEmitter from '../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

describe('page/ProjectOverview', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    MockDate.set(dayjs('2022-01-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
    MockDate.reset();
  });

  const customRender = () => {
    return sqleSuperRender(<Overview />);
  };

  it('render over view and refresh page', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目概览')).toBeInTheDocument();
    fireEvent.click(getBySelector('.refresh-icon'));
    expect(eventEmitSpy).toHaveBeenCalled();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });

  it('render over view when sql optimization is not supported', async () => {
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: false, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目概览')).toBeInTheDocument();
  });
});
