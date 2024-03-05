import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import userManagement from '../../../../testUtils/mockApi/userManagement';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import {
  adminPermission,
  userListData
} from '../../../../testUtils/mockApi/userManagement/data';
import UserList from './';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('diagnosis/test user table', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    userManagement.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data = adminPermission) => {
    return superRender(<UserList />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {}
        },
        user: {
          userScope: data
        }
      }
    });
  };

  it('render without permission', async () => {
    const { baseElement } = customRender([]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render table when api return null', async () => {
    const request = userManagement.getUserList();
    request.mockImplementation(() => createSpySuccessResponse({ data: [] }));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = userManagement.getUserList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('admin')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('管 理').length).toBe(2);
    expect(screen.queryAllByText('删 除').length).toBe(1);
  });

  it('should open model when click edit button', async () => {
    const request = userManagement.getUserList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getAllByText('管 理').length).toBe(2);

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('管 理')[0]);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: userListData[0],
      type: 'userManagement/updateSelectUserData'
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Update_User,
        status: true
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should open query popover when click delete button', async () => {
    const request = userManagement.getUserList();
    const deleteRequest = userManagement.deleteUser();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认要删除用户: "test"?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除用户: "test..."')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('删除用户 "test" 成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalled();
  });

  it('delete user failed', async () => {
    const request = userManagement.getUserList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: [{ ...userListData[0], username: undefined, user_id: undefined }]
      })
    );
    const deleteRequest = userManagement.deleteUser();
    deleteRequest.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认要删除用户: ""?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除用户: "..."')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(1000));
  });

  it('should refresh table when change pagination info', async () => {
    const request = userManagement.getUserList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 条/页'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toHaveBeenCalled();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
  });
});
