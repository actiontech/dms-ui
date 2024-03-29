import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import project from '../../testUtils/mockApi/project';
import EventEmitter from '../../utils/EventEmitter';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { superRender } from '../../testUtils/customRender';
import Project from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../data/EmitterKey';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project', () => {
  let emitSpy: jest.SpyInstance;
  const useSelectorMock = useSelector as jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    emitSpy = jest.spyOn(EventEmitter, 'emit');

    project.getProjectList();
    mockUseCurrentUser();
    mockUseUserInfo();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useSelectorMock.mockImplementation((e) =>
      e({
        project: {
          modalStatus: {
            [ModalName.DMS_Add_Project]: false,
            [ModalName.DMS_Update_Project]: false
          }
        }
      })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = superRender(<Project />);
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should be refresh table when clicking refresh button', async () => {
    superRender(<Project />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).not.toHaveBeenCalled();
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Refresh_Project_List);
  });

  it('should open the modal for creating a project when click the Create Project button', () => {
    mockUseCurrentUser({ isAdmin: true });
    superRender(<Project />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('创建项目'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'project/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Project,
        status: true
      }
    });

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockUseCurrentUser({
      isAdmin: false
    });
    superRender(<Project />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('创建项目'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockUseCurrentUser({
      isAdmin: false,
      managementPermissions: []
    });
    superRender(<Project />);
    expect(screen.queryByText('创建项目')).not.toBeInTheDocument();
  });
});
