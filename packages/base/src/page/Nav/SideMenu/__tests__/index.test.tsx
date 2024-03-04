import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseRecentlyOpenedProjects } from '../testUtils/mockUseRecentlyOpenedProjects';
import project from '../../../../testUtils/mockApi/project';
import { superRender } from '../../../../testUtils/customRender';
import SideMenu from '..';
import eventEmitter from '../../../../utils/EventEmitter';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import { useDispatch } from 'react-redux';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';
import { mockProjectList } from '../../../../testUtils/mockApi/project/data';
import { ModalName } from '../../../../data/ModalName';

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

  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  const unsubscribeSpy = jest.fn();

  const mockBindProjects = mockProjectList.map((v) => ({
    project_id: v.uid ?? '',
    project_name: v.name ?? '',
    archived: !!v.archived,
    is_manager: false
  }));

  ignoreComponentCustomAttr();
  beforeEach(() => {
    subscribeSpy = jest
      .spyOn(eventEmitter, 'subscribe')
      .mockImplementation(() => ({ unsubscribe: unsubscribeSpy }));
    jest.useFakeTimers();
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

    getProjectsSpy = project.getProjectList();
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
    expect(getProjectsSpy).toHaveBeenCalledWith({ page_size: 9999 });
    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.DMS_Sync_Project_Archived_Status
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).nthCalledWith(1, {
      type: 'nav/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Company_Notice]: false
        }
      }
    });
    expect(dispatchSpy).nthCalledWith(2, {
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
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
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
});
