import { renderWithThemeAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import project from '../../../testUtils/mockApi/project';
import ProjectList from '.';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockProjectList } from '../../../testUtils/mockApi/project/data';
import { superRender } from '../../../testUtils/customRender';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/project/list', () => {
  let archiveProjectSpy: jest.SpyInstance;
  let unarchiveProjectSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let deleteProjectList: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    emitSpy = jest.spyOn(EventEmitter, 'emit');

    getProjectListSpy = project.getProjectList();
    deleteProjectList = project.deleteProject();
    archiveProjectSpy = project.archiveProject();
    unarchiveProjectSpy = project.unarchiveProject();
    mockUseCurrentUser();
    mockUseUserInfo();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should be get data from the request to render the table', async () => {
    const subscriptSpy = jest.spyOn(EventEmitter, 'subscribe');

    expect(getProjectListSpy).toHaveBeenCalledTimes(0);
    const { container } = superRender(<ProjectList />);
    expect(container).toMatchSnapshot();
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    expect(subscriptSpy).toHaveBeenCalledTimes(1);
    expect(subscriptSpy.mock.calls[0][0]).toBe(
      EmitterKey.DMS_Refresh_Project_List
    );
  });

  it('should be called delete request when clicking the delete button', async () => {
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(deleteProjectList).toHaveBeenCalledTimes(0);

    expect(screen.getAllByText('删 除')[0].closest('button')).toBeDisabled();

    fireEvent.click(screen.getAllByText('删 除')[1]);
    expect(
      screen.getByText(`确认要删除项目"${mockProjectList[1].name}"么?`)
    ).toBeInTheDocument();
    expect(deleteProjectList).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('确 认'));
    expect(deleteProjectList).toHaveBeenCalledTimes(1);
    expect(deleteProjectList).toHaveBeenCalledWith({
      project_uid: mockProjectList[1].uid
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`删除项目"${mockProjectList[1].name}"成功`)
    ).toBeInTheDocument();
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`删除项目"${mockProjectList[1].name}"成功`)
    ).not.toBeInTheDocument();
  });

  it('should be called archive request when clicking the archive button', async () => {
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(archiveProjectSpy).toHaveBeenCalledTimes(0);
    expect(screen.getAllByText('冻 结')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('冻 结')[0]);
    expect(
      screen.queryByText(`确认要冻结项目"${mockProjectList[1].name}"么?`)
    ).toBeInTheDocument();
    expect(archiveProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('确 认'));
    expect(archiveProjectSpy).toHaveBeenCalledTimes(1);
    expect(archiveProjectSpy).toHaveBeenCalledWith({
      project_uid: mockProjectList[1].uid
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`冻结项目"${mockProjectList[1].name}"成功`)
    ).toBeInTheDocument();
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Sync_Project_Archived_Status
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`冻结项目"${mockProjectList[1].name}"成功`)
    ).not.toBeInTheDocument();
  });

  it('should be called unarchive request when clicking the unarchive button', async () => {
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(unarchiveProjectSpy).toHaveBeenCalledTimes(0);

    expect(screen.getAllByText('启 用')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('启 用')[0]);
    expect(
      screen.queryByText(`确认要启用项目"${mockProjectList[0].name}"么?`)
    ).toBeInTheDocument();
    expect(unarchiveProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('确 认'));
    expect(unarchiveProjectSpy).toHaveBeenCalledTimes(1);
    expect(unarchiveProjectSpy).toHaveBeenCalledWith({
      project_uid: mockProjectList[0].uid
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`启用项目"${mockProjectList[0].name}"成功`)
    ).toBeInTheDocument();
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Sync_Project_Archived_Status
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText(`启用项目"${mockProjectList[0].name}"成功`)
    ).not.toBeInTheDocument();
  });

  it('should open the modal for updating a project when click the Update Project button', async () => {
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('编 辑')[0].closest('button')).toBeDisabled();
    expect(screen.getAllByText('编 辑')[1]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('编 辑')[1]);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(1, {
      type: 'project/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Project,
        status: true
      }
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        project: mockProjectList[1]
      },
      type: 'project/updateSelectProject'
    });
  });

  it('should disabled the Delete, Edit, Archive, Unarchive feature when not currently a project manager or admin', async () => {
    mockUseCurrentUser({
      isAdmin: false,
      bindProjects: [],
      managementPermissions: []
    });
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')[1].closest('button')).toBeDisabled();

    fireEvent.click(screen.queryAllByText('删 除')[1]);
    expect(
      screen.queryByText(`确认要删除项目"${mockProjectList[1].name}"么?`)
    ).not.toBeInTheDocument();

    expect(screen.queryAllByText('编 辑')[1].closest('button')).toBeDisabled();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getAllByText('编 辑')[1]);
    expect(dispatchSpy).toHaveBeenCalledTimes(0);

    expect(screen.queryAllByText('启 用')[0].closest('button')).toBeDisabled();
    fireEvent.click(screen.queryAllByText('启 用')[0]);
    expect(
      screen.queryByText(`确认要启用项目"${mockProjectList[0].name}"么?`)
    ).not.toBeInTheDocument();

    expect(screen.queryAllByText('冻 结')[0].closest('button')).toBeDisabled();
    fireEvent.click(screen.queryAllByText('冻 结')[0]);
    expect(
      screen.queryByText(`确认要冻结项目"${mockProjectList[1].name}"么?`)
    ).not.toBeInTheDocument();
    cleanup();
    jest.clearAllMocks();

    let mockIsProjectManager = jest.fn();
    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: mockIsProjectManager
    });
    mockIsProjectManager.mockReturnValue(true);
    superRender(<ProjectList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryAllByText('删 除')[1].closest('button')
    ).not.toBeDisabled();

    expect(screen.queryAllByText('编 辑')[1]).not.toBeDisabled();

    expect(screen.queryAllByText('启 用')[0]).not.toBeDisabled();

    expect(screen.queryAllByText('冻 结')[0]).not.toBeDisabled();
  });
});
