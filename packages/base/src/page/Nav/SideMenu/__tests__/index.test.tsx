import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseRecentlyOpenedProjects } from '../testUtils/mockUseRecentlyOpenedProjects';
import project from '../../../../testUtils/mockApi/project';
import { superRender } from '../../../../testUtils/customRender';
import SideMenu from '..';
import eventEmitter from '../../../../utils/EventEmitter';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { useDispatch } from 'react-redux';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';
import { mockProjectList } from '../../../../testUtils/mockApi/project/data';
import { ModalName } from '../../../../data/ModalName';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import system from '../../../../testUtils/mockApi/system';
import { mockUseRecentlySelectedZone } from '../../../../testUtils/mockHooks/mockUseRecentlySelectedZone';
import gateway from '../../../../testUtils/mockApi/gateway';
import { mockGatewayTipsData } from '../../../../testUtils/mockApi/gateway/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test Base/Nav/SideMenu/index', () => {
  let getProjectsSpy: jest.SpyInstance;
  let subscribeSpy: jest.SpyInstance;
  let getSystemModuleRedDotsSpy: jest.SpyInstance;
  let getGatewayTipsSpy: jest.SpyInstance;

  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  const unsubscribeSpy = jest.fn();

  const mockBindProjects = mockProjectList.map((v) => ({
    project_id: v.uid ?? '',
    project_name: v.name ?? '',
    archived: !!v.archived,
    is_manager: false
  }));

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);
  beforeEach(() => {
    subscribeSpy = jest
      .spyOn(eventEmitter, 'subscribe')
      .mockImplementation(() => ({ unsubscribe: unsubscribeSpy }));
    jest.useFakeTimers();
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    mockUseCurrentUser({
      bindProjects: mockBindProjects
    });
    mockUseRecentlyOpenedProjects({
      currentProjectID: mockBindProjects[0].project_id,
      recentlyProjects: [
        {
          project_id: mockBindProjects[0].project_id,
          project_name: mockBindProjects[0].project_name
        }
      ]
    });

    mockUseRecentlySelectedZone();
    getGatewayTipsSpy = gateway.getGatewayTips();

    getProjectsSpy = project.getProjectList();
    getSystemModuleRedDotsSpy = system.getSystemModuleRedDots();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it('mount and unmount component', async () => {
    const { baseElement, unmount } = superRender(<SideMenu />);
    expect(baseElement).toMatchSnapshot();
    expect(getProjectsSpy).toHaveBeenCalledTimes(1);
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    expect(getProjectsSpy).toHaveBeenCalledWith({ page_size: 9999 });
    expect(subscribeSpy).toHaveBeenCalledTimes(2);
    expect(subscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.Refresh_Availability_Zone_Selector
    );
    expect(subscribeSpy.mock.calls[1][0]).toBe(
      EmitterKey.DMS_Sync_Project_Archived_Status
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'nav/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Company_Notice]: false
        }
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'user/updateBindProjects',
      payload: {
        bindProjects: mockBindProjects
      }
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();

    unmount();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
  });

  it('Click on the menu of the project selector', async () => {
    const { baseElement } = superRender(<SideMenu />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText(mockBindProjects[1].project_name));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockBindProjects[1].project_id}/overview`
    );
  });

  it('should dispatch updateAvailabilityZoneTips and call verifyRecentlySelectedZoneRecord func after request gateway tips', async () => {
    const verifyRecentlySelectedZoneRecordSpy = jest.fn();
    mockUseRecentlySelectedZone({
      verifyRecentlySelectedZoneRecord: verifyRecentlySelectedZoneRecordSpy
    });
    superRender(<SideMenu />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGatewayTipsSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateAvailabilityZoneTips',
      payload: {
        availabilityZoneTips: mockGatewayTipsData
      }
    });
    expect(verifyRecentlySelectedZoneRecordSpy).toHaveBeenCalledTimes(1);
  });
});
